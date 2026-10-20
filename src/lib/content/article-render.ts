import { stripHtml } from "@/lib/format";
import { classes, cleanText, find, findAll, hasClass, isNode, nodes, parseHtml, textOf, type HChild, type HNode } from "./html-tree";

/**
 * Turns Shopify blog HTML (three different authoring templates, inline styles,
 * card grids, icon images, checkbox self-tests …) into plain content blocks.
 * Only the text survives; the shop renders the blocks in its own design.
 */
export type Inline = string; // sanitised inline HTML: text, <strong>, <em>, <a href>, <br>

export type CardTone = "default" | "warn" | "alert" | "info";
export type Card = { title: string; html: Inline; tone?: CardTone; badge?: string; kicker?: string; points?: Inline[]; note?: Inline };
export type Cta = { label: string; href: string };

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string; kicker?: string }
  | { type: "subtitle"; html: Inline }
  | { type: "paragraph"; html: Inline }
  | { type: "list"; ordered: boolean; items: Inline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "quote"; html: Inline }
  | { type: "cards"; items: Card[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "steps"; title: string | null; items: Inline[] }
  | { type: "faq"; items: { q: string; a: Inline }[] }
  | { type: "callout"; title: string | null; html: Inline; cta?: Cta }
  | { type: "conclusion"; title: string; html: Inline; cta?: Cta };

export type ExtractedArticle = {
  kicker: string | null;
  lead: string | null;
  /** products the template links to (product cards, CTAs) */
  productHandles: string[];
  blocks: Block[];
  toc: { id: string; text: string }[];
  words: number;
  readingMinutes: number;
};

const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "img", "td", "th"]);
const SKIP_TAGS = new Set(["style", "script", "link", "noscript", "svg", "button", "form", "select", "textarea", "iframe", "input", "nav", "header", "footer", "aside"]);
const KEEP_INLINE = new Set(["strong", "b", "em", "i", "a", "br", "sup", "sub"]);
const VOID_TAGS = new Set(["br", "img", "hr", "input", "link", "meta", "source", "wbr", "col", "embed", "track", "area", "base"]);

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function isContentImage(src: string, alt: string): boolean {
  if (!/^https?:\/\//.test(src)) return false;
  if (/\.svg(\?|$)/i.test(src)) return false;
  if (/\/\d{2,3}x\d{2,3}\//.test(src)) return false; // storyblok icon sizes like /512x512/
  if (/symbol|icon|logo/i.test(alt)) return false;
  return true;
}

function rewriteHref(href: string): string {
  let h = href.replace(/https?:\/\/shop\.doctorbox\.de/, "");
  const art = h.match(/^(\/en)?\/blogs\/[^/]+\/([^/?#]+)/);
  if (art) h = `${art[1] ?? ""}/blog/${art[2]}`;
  return h;
}

/** Minimal tokenizer: emits tags and text in order. */
function* tokens(html: string): Generator<{ kind: "open" | "close" | "text"; tag?: string; attrs?: string; text?: string; selfClosing?: boolean }> {
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[1]) yield { kind: "close", tag: m[1].toLowerCase() };
    else if (m[2]) {
      const tag = m[2].toLowerCase();
      yield { kind: "open", tag, attrs: m[3] ?? "", selfClosing: Boolean(m[4]) || VOID_TAGS.has(tag) };
    }
    else if (m[5]) yield { kind: "text", text: m[5] };
  }
}

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1] ?? attrs.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`, "i"))?.[1] ?? null;

function extractLegacy(html: string): ExtractedArticle {
  const blocks: Block[] = [];
  let kicker: string | null = null;

  // current block being collected
  let current: { tag: string; cls: string; parts: string[] } | null = null;
  const listStack: { ordered: boolean; items: Inline[] }[] = [];
  let skipDepth = 0;
  const skipStack: string[] = [];
  let inlineOpen: string[] = [];
  let sawH1 = false;

  const flush = () => {
    if (!current) return;
    const { tag, cls, parts } = current;
    current = null;
    // close dangling inline tags
    let html = parts.join("");
    for (const t of inlineOpen.reverse()) html += `</${t}>`;
    inlineOpen = [];
    html = html.replace(/\s+/g, " ").trim().replace(/^(<br>\s*)+|(\s*<br>)+$/g, "");
    const text = decode(stripHtml(html)).trim(); // plain text for headings/kicker (React escapes on render)
    if (!text) return;
    if (tag === "li") {
      const list = listStack[listStack.length - 1];
      if (list) list.items.push(html);
      else blocks.push({ type: "list", ordered: false, items: [html] });
      return;
    }
    if (tag === "h1") {
      sawH1 = true;
      return;
    }
    if (/^h[2-6]$/.test(tag)) {
      const level = Math.min(4, Math.max(2, Number(tag[1]))) as 2 | 3 | 4;
      blocks.push({ type: "heading", level, text });
      return;
    }
    if (tag === "blockquote") {
      blocks.push({ type: "quote", html });
      return;
    }
    if (/eyebrow|kicker|category/.test(cls) && !kicker && text.length < 80) {
      kicker = text;
      return;
    }
    blocks.push({ type: "paragraph", html });
  };

  for (const tk of tokens(html)) {
    if (tk.kind === "open") {
      const tag = tk.tag!;
      if (SKIP_TAGS.has(tag)) {
        if (!tk.selfClosing) {
          skipDepth++;
          skipStack.push(tag);
        }
        continue;
      }
      if (skipDepth) continue;
      if (tag === "img") {
        const src = attr(tk.attrs!, "src") ?? attr(tk.attrs!, "data-src") ?? "";
        const alt = decode(attr(tk.attrs!, "alt") ?? "");
        if (isContentImage(src, alt)) {
          flush();
          blocks.push({ type: "image", src, alt });
        }
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        flush();
        listStack.push({ ordered: tag === "ol", items: [] });
        continue;
      }
      if (BLOCK_TAGS.has(tag)) {
        flush();
        current = { tag, cls: attr(tk.attrs!, "class") ?? "", parts: [] };
        continue;
      }
      if (KEEP_INLINE.has(tag) && current) {
        if (tag === "br") {
          current.parts.push("<br>");
        } else if (tag === "a") {
          const href = attr(tk.attrs!, "href");
          if (href && !/^javascript:/i.test(href)) {
            const h = rewriteHref(href);
            const external = /^https?:\/\//.test(h);
            current.parts.push(`<a href="${escape(h)}"${external ? ' target="_blank" rel="noopener"' : ""}>`);
            inlineOpen.push("a");
          }
        } else {
          const t = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
          current.parts.push(`<${t}>`);
          inlineOpen.push(t);
        }
        continue;
      }
      // div/section/article/span/label … : structural, ignored. A div that directly holds text acts like a paragraph.
      continue;
    }
    if (tk.kind === "close") {
      const tag = tk.tag!;
      if (SKIP_TAGS.has(tag)) {
        if (skipStack[skipStack.length - 1] === tag) {
          skipStack.pop();
          skipDepth = Math.max(0, skipDepth - 1);
        }
        continue;
      }
      if (skipDepth) continue;
      if (tag === "ul" || tag === "ol") {
        flush();
        const list = listStack.pop();
        if (list && list.items.length) {
          const parent = listStack[listStack.length - 1];
          if (parent && parent.items.length) {
            // nested list → append items to parent's last item
            parent.items[parent.items.length - 1] += `<ul>${list.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
          } else blocks.push({ type: "list", ordered: list.ordered, items: list.items });
        }
        continue;
      }
      if (BLOCK_TAGS.has(tag)) {
        if (current && current.tag === tag) flush();
        continue;
      }
      if (KEEP_INLINE.has(tag) && current) {
        const t = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
        const idx = inlineOpen.lastIndexOf(t);
        if (idx !== -1) {
          current.parts.push(`</${t}>`);
          inlineOpen.splice(idx, 1);
        }
        continue;
      }
      continue;
    }
    // text
    if (skipDepth) continue;
    const raw = tk.text!;
    if (!raw.trim()) {
      if (current) current.parts.push(" ");
      continue;
    }
    if (!current) {
      // loose text inside a div/span → treat as its own paragraph
      current = { tag: "p", cls: "", parts: [] };
    }
    current.parts.push(escape(decode(raw)).replace(/&amp;(amp;)+/g, "&amp;"));
  }
  flush();
  void sawH1;

  // Lead: first paragraph (before the first heading) if long enough
  let lead: string | null = null;
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  const leadIdx = blocks.findIndex((b, i) => b.type === "paragraph" && (firstHeading === -1 || i < firstHeading) && stripHtml(b.html).length > 60);
  if (leadIdx !== -1) {
    lead = decode(stripHtml((blocks[leadIdx] as { html: string }).html));
    blocks.splice(leadIdx, 1);
  }

  // Group runs of [h3/h4 + single paragraph] (≥3) into card grids
  const grouped: Block[] = [];
  for (let i = 0; i < blocks.length; ) {
    const run: { title: string; html: Inline }[] = [];
    let j = i;
    while (j + 1 < blocks.length) {
      const h = blocks[j];
      const p = blocks[j + 1];
      const next = blocks[j + 2];
      if (h.type === "heading" && h.level >= 3 && p.type === "paragraph" && (!next || next.type !== "paragraph")) {
        run.push({ title: h.text, html: p.html });
        j += 2;
      } else break;
    }
    if (run.length >= 3) {
      grouped.push({ type: "cards", items: run });
      i = j;
    } else {
      grouped.push(blocks[i]);
      i++;
    }
  }

  // h4 followed by a paragraph → callout
  const final: Block[] = [];
  for (let i = 0; i < grouped.length; i++) {
    const b = grouped[i];
    const n = grouped[i + 1];
    if (b.type === "heading" && b.level === 4 && n && n.type === "paragraph") {
      final.push({ type: "callout", title: b.text, html: n.html });
      i++;
    } else final.push(b);
  }

  // TOC from h2
  const used = new Set<string>();
  const toc: { id: string; text: string }[] = [];
  for (const b of final) {
    if (b.type === "heading" && b.level === 2) {
      let id = slugify(b.text) || `abschnitt-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      b.id = id;
      toc.push({ id, text: b.text });
    }
  }

  const words = final
    .map((b) => ("html" in b ? stripHtml(b.html) : "text" in b ? b.text : b.type === "list" ? b.items.map(stripHtml).join(" ") : b.type === "cards" ? b.items.map((c) => c.title + " " + stripHtml(c.html)).join(" ") : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return { kicker, lead, productHandles: [], blocks: final, toc, words, readingMinutes: Math.max(1, Math.round(words / 200)) };
}

/* ------------------------------------------------------------------------------------------ */
/* Templated articles ("BlogPage": hero, panels, cards, timeline, FAQ, Fazit box)              */
/* ------------------------------------------------------------------------------------------ */

const isTemplated = (html: string) => /class="[^"]*\b(BlogPage|section-title|hero-text-content)\b/.test(html);

/** Serialise a subtree to sanitised inline HTML (text, strong/em/a/br; paragraphs become line breaks, lists stay lists). */
function inlineOf(n: HChild, opts: { paragraphs?: boolean } = {}): Inline {
  if (!isNode(n)) return escape(n);
  if (["style", "script", "svg", "img", "link", "meta", "button", "input"].includes(n.tag)) return "";
  if (n.tag === "br") return "<br>";
  const inner = () => n.children.map((c) => inlineOf(c, opts)).join("");
  if (n.tag === "strong" || n.tag === "b") return `<strong>${inner()}</strong>`;
  if (n.tag === "em" || n.tag === "i") return `<em>${inner()}</em>`;
  if (n.tag === "sup" || n.tag === "sub") return `<${n.tag}>${inner()}</${n.tag}>`;
  if (n.tag === "a") {
    const href = n.attrs.href;
    if (!href || /^javascript:/i.test(href)) return inner();
    const h = rewriteHref(href);
    const external = /^https?:\/\//.test(h);
    return `<a href="${escape(h)}"${external ? ' target="_blank" rel="noopener"' : ""}>${inner()}</a>`;
  }
  if (n.tag === "ul" || n.tag === "ol") {
    const items = nodes(n).filter((c) => c.tag === "li").map((li) => `<li>${inlineOf(li, opts)}</li>`);
    return `<${n.tag}>${items.join("")}</${n.tag}>`;
  }
  if (n.tag === "p" || n.tag === "div" || /^h[1-6]$/.test(n.tag)) {
    const t = inner().trim();
    return t ? `${t}<br><br>` : "";
  }
  return inner();
}
const tidy = (html: string) =>
  html
    .replace(/\s+/g, " ")
    .replace(/(<br>\s*)+$/g, "")
    .replace(/^(\s*<br>)+/g, "")
    .trim();

function extractTemplated(html: string): ExtractedArticle {
  const root = parseHtml(html);
  const blocks: Block[] = [];
  const productHandles: string[] = [];
  let kicker: string | null = null;
  let pendingKicker: string | null = null;

  const pushParagraph = (n: HNode) => {
    const h = tidy(n.children.map((c) => inlineOf(c)).join(""));
    if (h && stripHtml(h).trim()) blocks.push({ type: "paragraph", html: h });
  };
  const heading = (n: HNode, level: 2 | 3 | 4) => {
    const text = cleanText(textOf(n));
    if (!text) return;
    const b: Block = { type: "heading", level, text };
    if (level === 2 && pendingKicker) {
      b.kicker = pendingKicker;
      pendingKicker = null;
    }
    blocks.push(b);
  };
  const ctaOf = (n: HNode): Cta | undefined => {
    const a = find(n, (x) => x.tag === "a" && (hasClass(x, "cta-button") || hasClass(x, "product-button")));
    if (!a?.attrs.href) return undefined;
    return { label: cleanText(textOf(a)), href: rewriteHref(a.attrs.href) };
  };
  const noteProduct = (n: HNode) => {
    for (const a of findAll(n, (x) => x.tag === "a")) {
      const m = (a.attrs.href ?? "").match(/\/products\/([a-z0-9%\-]+)/i);
      if (m) productHandles.push(decodeURIComponent(m[1]));
    }
  };
  const toneOf = (n: HNode): CardTone => {
    const c = classes(n).join(" ");
    if (/--warn|warning/.test(c)) return "warn";
    if (/--alert|danger|red/.test(c)) return "alert";
    if (/info-box|--info/.test(c)) return "info";
    return "default";
  };
  const CARD = (n: HNode) =>
    ["mini-card", "reason-card", "step-card", "info-box", "checklist-card", "symptom-card", "stat-card", "signal-card", "symptom-item", "benefit-card", "fact-card"].some((c) => hasClass(n, c));
  const GRID = (n: HNode) =>
    ["intro-split", "mini-stack", "reason-grid", "steps-grid", "stat-grid", "signal-grid", "symptoms-grid", "card-grid", "cards", "grid", "benefits-grid"].some((c) => hasClass(n, c));

  const cardOf = (n: HNode): Card | { stat: { value: string; label: string } } | null => {
    // stat tile: <span class="count"> + <span class="label">
    const count = find(n, (x) => hasClass(x, "count") || hasClass(x, "stat-value") || hasClass(x, "stat-number"));
    const label = find(n, (x) => hasClass(x, "label") || hasClass(x, "stat-label"));
    if (count && label) return { stat: { value: cleanText(textOf(count)), label: cleanText(textOf(label)) } };
    const titleNode = find(n, (x) => /^h[2-6]$/.test(x.tag) || hasClass(x, "symptom-title") || hasClass(x, "card-title"));
    const title = titleNode ? cleanText(textOf(titleNode)) : "";
    const badge = find(n, (x) => hasClass(x, "signal-badge") || hasClass(x, "badge"));
    const kickerNode = find(n, (x) => hasClass(x, "signal-kicker") || hasClass(x, "card-kicker"));
    const note = find(n, (x) => hasClass(x, "signal-note") || hasClass(x, "note"));
    const points = find(n, (x) => x.tag === "ul" && (hasClass(x, "signal-points") || hasClass(x, "checklist-list") || hasClass(x, "symptom-list") || hasClass(x, "info-list")));
    const skip = new Set<HNode>([titleNode, badge, kickerNode, note, points].filter(Boolean) as HNode[]);
    // body: everything that is not one of the structured parts
    const bodyParts: string[] = [];
    const collect = (x: HNode) => {
      for (const c of x.children) {
        if (!isNode(c)) {
          if (c.trim()) bodyParts.push(escape(c));
          continue;
        }
        if (skip.has(c) || ["img", "svg", "style", "script"].includes(c.tag)) continue;
        if (c.tag === "div" || c.tag === "section" || c.tag === "article") collect(c);
        else bodyParts.push(inlineOf(c));
      }
    };
    collect(n);
    const body = tidy(bodyParts.join(" "));
    if (!title && !body) return null;
    const card: Card = { title, html: body, tone: toneOf(n) };
    if (badge) card.badge = cleanText(textOf(badge));
    if (kickerNode) card.kicker = cleanText(textOf(kickerNode));
    if (points) card.points = nodes(points).filter((li) => li.tag === "li").map((li) => tidy(inlineOf(li)));
    if (note) card.note = tidy(note.children.map((c) => inlineOf(c)).join(""));
    return card;
  };

  const pushCards = (cardNodes: HNode[]) => {
    const cards: Card[] = [];
    const stats: { value: string; label: string }[] = [];
    for (const c of cardNodes) {
      const r = cardOf(c);
      if (!r) continue;
      if ("stat" in r) stats.push(r.stat);
      else cards.push(r);
    }
    if (stats.length) blocks.push({ type: "stats", items: stats });
    if (cards.length) blocks.push({ type: "cards", items: cards });
  };

  const walk = (n: HNode, ctx: { inFaq: boolean }) => {
    for (const c of n.children) {
      if (!isNode(c)) {
        if (c.trim()) blocks.push({ type: "paragraph", html: escape(cleanText(c)) });
        continue;
      }
      const tag = c.tag;
      if (["style", "script", "link", "meta", "svg", "button", "form", "input", "nav", "footer", "noscript", "iframe"].includes(tag)) continue;
      if (tag === "img") {
        const src = c.attrs.src ?? c.attrs["data-src"] ?? "";
        const alt = c.attrs.alt ?? "";
        if (isContentImage(src, alt)) blocks.push({ type: "image", src, alt });
        continue;
      }
      // hero: lead paragraphs + highlight; title/eyebrow come from the article itself
      if (hasClass(c, "hero") && (tag === "section" || tag === "div")) {
        const eyebrow = find(c, (x) => hasClass(x, "hero-eyebrow"));
        if (eyebrow && !kicker) kicker = cleanText(textOf(eyebrow));
        const textContent = find(c, (x) => hasClass(x, "hero-text-content")) ?? c;
        for (const p of nodes(textContent)) {
          if (p.tag === "p") pushParagraph(p);
          else if (hasClass(p, "hero-highlight")) {
            const h4 = find(p, (x) => x.tag === "h4" || x.tag === "strong");
            const title = h4 && h4.tag === "h4" ? cleanText(textOf(h4)) : null;
            const body = tidy(p.children.filter((x) => !(isNode(x) && x === h4)).map((x) => inlineOf(x)).join(""));
            if (body) blocks.push({ type: "callout", title, html: body });
          }
        }
        continue;
      }
      if (hasClass(c, "section-eyebrow") || hasClass(c, "fazit-eyebrow")) {
        pendingKicker = cleanText(textOf(c));
        continue;
      }
      if (hasClass(c, "section-subtitle")) {
        const h = tidy(c.children.map((x) => inlineOf(x)).join(""));
        if (h) blocks.push({ type: "subtitle", html: h });
        continue;
      }
      if (hasClass(c, "cta-section") || hasClass(c, "fazit-box")) {
        const titleNode = find(c, (x) => x.tag === "h2" || x.tag === "h3");
        const title = titleNode ? cleanText(textOf(titleNode)) : pendingKicker ?? "Fazit";
        const textNode = find(c, (x) => hasClass(x, "cta-text")) ?? c;
        const body = tidy(
          textNode.children
            .filter((x) => !(isNode(x) && (x === titleNode || x.tag === "a" || hasClass(x, "fazit-eyebrow") || hasClass(x, "cta-image"))))
            .map((x) => inlineOf(x))
            .join(""),
        );
        noteProduct(c);
        blocks.push({ type: "conclusion", title, html: body, cta: ctaOf(c) });
        pendingKicker = null;
        continue;
      }
      if (hasClass(c, "product-card") || hasClass(c, "product-grid") || hasClass(c, "blog-grid") || hasClass(c, "blog-card")) {
        noteProduct(c);
        continue;
      }
      if (hasClass(c, "cta-strip")) {
        const p = find(c, (x) => x.tag === "p");
        const body = p ? tidy(p.children.map((x) => inlineOf(x)).join("")) : tidy(c.children.filter((x) => !(isNode(x) && x.tag === "a")).map((x) => inlineOf(x)).join(""));
        noteProduct(c);
        if (body) blocks.push({ type: "callout", title: null, html: body, cta: ctaOf(c) });
        continue;
      }
      if (hasClass(c, "timeline-card") || hasClass(c, "timeline")) {
        const titleNode = hasClass(c, "timeline-card") ? nodes(c).find((x) => /^h[2-6]$/.test(x.tag)) : undefined;
        const items = findAll(c, (x) => hasClass(x, "timeline-item")).map((it) => {
          const body = find(it, (x) => hasClass(x, "timeline-body")) ?? it;
          return tidy(body.children.map((x) => inlineOf(x)).join(""));
        });
        if (items.length) blocks.push({ type: "steps", title: titleNode ? cleanText(textOf(titleNode)) : null, items });
        continue;
      }
      // FAQ: div.faq > .item (strong + p)  |  section#faq with cards (h3 = question)
      if (hasClass(c, "faq") && !hasClass(c, "faq-section")) {
        const items = nodes(c)
          .filter((x) => hasClass(x, "item") || x.tag === "details")
          .map((it) => {
            const q = find(it, (x) => x.tag === "strong" || x.tag === "summary" || /^h[2-6]$/.test(x.tag));
            const a = tidy(it.children.filter((x) => !(isNode(x) && x === q)).map((x) => inlineOf(x)).join(""));
            return q ? { q: cleanText(textOf(q)), a } : null;
          })
          .filter((x): x is { q: string; a: string } => Boolean(x));
        if (items.length) {
          blocks.push({ type: "faq", items });
          continue;
        }
      }
      if (GRID(c)) {
        const cardNodes = findAll(c, CARD).filter((x) => !findAll(x, CARD).length || hasClass(x, "signal-card"));
        if (ctx.inFaq && cardNodes.length) {
          blocks.push({
            type: "faq",
            items: cardNodes
              .map((x) => cardOf(x))
              .filter((r): r is Card => Boolean(r) && !("stat" in (r as object)))
              .map((r) => ({ q: r.title, a: r.html })),
          });
        } else pushCards(cardNodes);
        continue;
      }
      if (CARD(c)) {
        pushCards([c]);
        continue;
      }
      if (tag === "h1") continue;
      if (/^h[2-6]$/.test(tag)) {
        heading(c, Math.min(4, Math.max(2, Number(tag[1]))) as 2 | 3 | 4);
        continue;
      }
      if (tag === "p") {
        pushParagraph(c);
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = nodes(c).filter((li) => li.tag === "li").map((li) => tidy(inlineOf(li)));
        if (items.length) blocks.push({ type: "list", ordered: tag === "ol", items });
        continue;
      }
      if (tag === "blockquote") {
        const h = tidy(c.children.map((x) => inlineOf(x)).join(""));
        if (h) blocks.push({ type: "quote", html: h });
        continue;
      }
      if (tag === "table") continue;
      // structural element → recurse
      const faq = ctx.inFaq || c.attrs.id === "faq" || hasClass(c, "faq-section");
      walk(c, { inFaq: faq });
    }
  };
  walk(root, { inFaq: false });

  // Lead: first paragraph before the first heading
  let lead: string | null = null;
  const firstHeading = blocks.findIndex((b) => b.type === "heading");
  const leadIdx = blocks.findIndex((b, i) => b.type === "paragraph" && (firstHeading === -1 || i < firstHeading) && stripHtml(b.html).length > 60);
  if (leadIdx !== -1) {
    lead = decode(stripHtml((blocks[leadIdx] as { html: string }).html));
    blocks.splice(leadIdx, 1);
  }

  // TOC from h2
  const used = new Set<string>();
  const toc: { id: string; text: string }[] = [];
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 2) {
      let id = slugify(b.text) || `abschnitt-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      b.id = id;
      toc.push({ id, text: b.text });
    }
  }

  const textOfBlock = (b: Block): string => {
    switch (b.type) {
      case "heading":
        return b.text;
      case "list":
        return b.items.map(stripHtml).join(" ");
      case "cards":
        return b.items.map((c) => `${c.title} ${stripHtml(c.html)} ${(c.points ?? []).map(stripHtml).join(" ")}`).join(" ");
      case "stats":
        return b.items.map((s) => `${s.value} ${s.label}`).join(" ");
      case "steps":
        return `${b.title ?? ""} ${b.items.map(stripHtml).join(" ")}`;
      case "faq":
        return b.items.map((f) => `${f.q} ${stripHtml(f.a)}`).join(" ");
      case "image":
        return "";
      default:
        return stripHtml(b.html);
    }
  };
  const words = blocks.map(textOfBlock).join(" ").split(/\s+/).filter(Boolean).length;
  return { kicker, lead, productHandles: Array.from(new Set(productHandles)), blocks, toc, words, readingMinutes: Math.max(1, Math.round(words / 200)) };
}

export function extractArticle(html: string): ExtractedArticle {
  return isTemplated(html) ? extractTemplated(html) : extractLegacy(html);
}
