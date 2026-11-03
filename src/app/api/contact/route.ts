import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { email, honeypot, invalidResponse, line, rateLimitedResponse, requiredLine } from "@/lib/form-fields";
import { sendMail } from "@/lib/mail";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Payload = z.object({
  topic: requiredLine(200),
  name: requiredLine(200),
  email,
  order: line(100).optional(),
  message: z.string().trim().min(2).max(5000),
  website: honeypot, // honeypot
  locale: line(10).optional(),
});

/** Each message lands in the support inbox and uses mail quota */
const limited = rateLimiter({ windowMs: 60 * 60 * 1000, perKey: 5, global: 100 });

/**
 * Contact form endpoint. Sends the message by e-mail (Brevo or Resend, see lib/mail.ts) when
 * a key is configured; otherwise it is logged on the server so the
 * form still works in development. Recipient: CONTACT_TO (falls back to B2B_INQUIRY_TO).
 */
export async function POST(req: NextRequest) {
  const parsed = Payload.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalidResponse(parsed.error);
  const body = parsed.data;
  if (body.website) return NextResponse.json({ ok: true }); // bot filled the honeypot
  if (limited(clientIp(req.headers) ?? "local")) return rateLimitedResponse();

  const to = process.env.CONTACT_TO ?? process.env.B2B_INQUIRY_TO ?? "heimtest@doctorbox.eu";
  const text = [
    `Thema: ${body.topic}`,
    `Name: ${body.name}`,
    `E-Mail: ${body.email}`,
    `Bestellnummer: ${body.order || "–"}`,
    `Sprache: ${body.locale ?? "de"}`,
    "",
    body.message,
  ].join("\n");

  let sent: boolean;
  try {
    sent = await sendMail({ to, replyTo: body.email, subject: `Kontakt (${body.topic}): ${body.name}${body.order ? ` · ${body.order}` : ""}`, text });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  if (!sent) {
    console.info("[contact] (no BREVO_API_KEY or RESEND_API_KEY configured, logging only)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
