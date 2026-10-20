import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { buildKnowledge } from "@/lib/assistant/knowledge";
import { systemPrompt } from "@/lib/assistant/prompt";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { predictiveSearch } from "@/lib/shopify/queries";
import type { ProductCard } from "@/lib/shopify/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-opus-5-5";

/* ------------------------------------------------------------------ input */
const Body = z.object({
  locale: z.string().optional(),
  /** Page context (e.g. a collection) that focuses the advice; trusted copy from our own config only */
  topic: z.string().max(1200).optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(24),
});

/* ------------------------------------------------------------- rate limit */
const hits = new Map<string, number[]>();
function limited(ip: string, max = 30, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

/* ----------------------------------------------------------------- tools */
const RecommendInput = z.object({
  handles: z.array(z.string()).min(1).max(4),
  reason: z.string().max(300).optional(),
});
const SearchInput = z.object({ query: z.string().min(2).max(80) });

const tools: Anthropic.Tool[] = [
  {
    name: "recommend_tests",
    description:
      "Show up to four tests from the catalogue as product cards to the user. Call this whenever you recommend specific tests. Use the exact handles from the catalogue.",
    strict: true,
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        handles: { type: "array", items: { type: "string" }, description: "One to four product handles from the catalogue" },
        reason: { type: "string", description: "One sentence on why these fit (optional)" },
      },
      required: ["handles"],
      additionalProperties: false,
    },
  },
  {
    name: "search_tests",
    description: "Search the live shop for tests by keyword (value, symptom, topic). Use it only if the catalogue does not answer the question.",
    strict: true,
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: "Search term" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
];

/* --------------------------------------------------------------- stream */
type Event =
  | { type: "text"; text: string }
  | { type: "products"; items: ProductTeaser[]; reason?: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type ProductTeaser = {
  handle: string;
  title: string;
  price: string;
  currency: string;
  image: string | null;
  sample: string | null;
  values: number;
  rating: number | null;
  ratingCount: number;
  subscription: boolean;
};

const teaser = (p: ProductCard): ProductTeaser => ({
  handle: p.handle,
  title: p.title,
  price: p.priceRange.minVariantPrice.amount,
  currency: p.priceRange.minVariantPrice.currencyCode,
  image: p.featuredImage?.url ?? null,
  sample: p.sampleMaterial?.split("|")[0]?.trim() ?? null,
  values: p.biomarkers.length,
  rating: p.rating,
  ratingCount: p.ratingCount,
  subscription: p.hasSubscription,
});

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const locale: Locale = parsed.data.locale && isLocale(parsed.data.locale) ? parsed.data.locale : "de";
  const topic = parsed.data.topic?.trim() || null;

  // Org-level keys (not scoped to a workspace) must name the workspace per request
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic(workspace ? { defaultHeaders: { "anthropic-workspace-id": workspace } } : undefined);
  const knowledge = await buildKnowledge(locale);
  const byHandle = new Map(knowledge.products.map((p) => [p.handle, p]));

  const messages: Anthropic.MessageParam[] = parsed.data.messages.map((m) => ({ role: m.role, content: m.content }));
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        // Manual streaming tool loop (max 3 rounds)
        let emitted = false;
        for (let round = 0; round < 3; round++) {
          let emittedThisRound = false;
          const s = client.beta.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" },
            system: [
              { type: "text", text: systemPrompt(locale) },
              { type: "text", text: knowledge.text, cache_control: { type: "ephemeral" } },
              ...(topic ? [{ type: "text" as const, text: (locale === "en" ? "Page context: " : "Seitenkontext: ") + topic }] : []),
            ],
            tools,
            messages,
          });
          s.on("text", (delta) => {
            if (!delta) return;
            // text after a tool round starts a new paragraph
            if (emitted && !emittedThisRound) send({ type: "text", text: "\n\n" });
            emitted = emittedThisRound = true;
            send({ type: "text", text: delta });
          });

          let message: Anthropic.Beta.BetaMessage;
          try {
            message = await s.finalMessage();
          } catch (err) {
            if (err instanceof Anthropic.APIError) throw err;
            // tool input not parseable → re-issue the turn once
            if (round === 2) throw err;
            continue;
          }

          if (message.stop_reason === "refusal") {
            send({
              type: "text",
              text:
                locale === "en"
                  ? "I can't help with that here. For health concerns please contact a doctor; for questions about our tests I'm happy to help."
                  : "Dabei kann ich hier nicht helfen. Bei gesundheitlichen Sorgen wende dich bitte an eine Ärztin oder einen Arzt; bei Fragen zu unseren Tests helfe ich gern.",
            });
            break;
          }
          const toolUses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
          if (!toolUses.length || message.stop_reason === "max_tokens") break;

          messages.push({ role: "assistant", content: message.content as Anthropic.MessageParam["content"] });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            if (tu.name === "recommend_tests") {
              const input = RecommendInput.safeParse(tu.input);
              if (!input.success) {
                results.push({ type: "tool_result", tool_use_id: tu.id, is_error: true, content: "INVALID_JSON" });
                continue;
              }
              const items = input.data.handles.map((h) => byHandle.get(h)).filter((p): p is ProductCard => Boolean(p));
              if (items.length) send({ type: "products", items: items.map(teaser), reason: input.data.reason });
              const missing = input.data.handles.filter((h) => !byHandle.has(h));
              results.push({
                type: "tool_result",
                tool_use_id: tu.id,
                content: items.length
                  ? `Shown to the user: ${items.map((p) => p.title).join(", ")}.${missing.length ? ` Unknown handles ignored: ${missing.join(", ")}.` : ""} Do not repeat prices or links.`
                  : `No matching handles. Valid handles are listed in the catalogue.`,
              });
            } else if (tu.name === "search_tests") {
              const input = SearchInput.safeParse(tu.input);
              if (!input.success) {
                results.push({ type: "tool_result", tool_use_id: tu.id, is_error: true, content: "INVALID_JSON" });
                continue;
              }
              const r = await predictiveSearch(input.data.query, locale, 5).catch(() => null);
              results.push({
                type: "tool_result",
                tool_use_id: tu.id,
                content: r && r.products.length ? r.products.map((p) => `${p.handle} | ${p.title} | ${p.biomarkers.join(", ")}`).join("\n") : "No results.",
              });
            } else {
              results.push({ type: "tool_result", tool_use_id: tu.id, is_error: true, content: "Unknown tool" });
            }
          }
          messages.push({ role: "user", content: results });
        }
        send({ type: "done" });
      } catch (err) {
        console.error("[assistant]", err);
        const msg =
          err instanceof Anthropic.RateLimitError
            ? locale === "en"
              ? "Too many requests right now, please try again in a moment."
              : "Gerade sind zu viele Anfragen unterwegs, bitte versuch es gleich noch einmal."
            : locale === "en"
              ? "Something went wrong. Please try again."
              : "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.";
        send({ type: "error", message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
