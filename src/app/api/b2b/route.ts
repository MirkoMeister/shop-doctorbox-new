import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { email, honeypot, invalidResponse, line, rateLimitedResponse, requiredLine } from "@/lib/form-fields";
import { sendMail } from "@/lib/mail";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Payload = z.object({
  company: requiredLine(200),
  name: requiredLine(200),
  email,
  phone: line(50).optional(),
  interest: requiredLine(200),
  volume: line(100).optional(),
  message: z.string().trim().max(5000).optional(),
  website: honeypot, // honeypot
  locale: line(10).optional(),
});

/** Each inquiry lands in the inbox and uses mail quota */
const limited = rateLimiter({ windowMs: 60 * 60 * 1000, perKey: 5, global: 100 });

/**
 * B2B inquiry endpoint. Sends the request by e-mail (Brevo or Resend, see lib/mail.ts) when
 * a key is configured; otherwise it is logged on the server so the
 * form still works in development. Recipient: B2B_INQUIRY_TO (default heimtest@doctorbox.eu).
 */
export async function POST(req: NextRequest) {
  const parsed = Payload.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalidResponse(parsed.error);
  const body = parsed.data;
  if (body.website) return NextResponse.json({ ok: true }); // bot filled the honeypot
  if (limited(clientIp(req.headers) ?? "local")) return rateLimitedResponse();

  const to = process.env.B2B_INQUIRY_TO ?? "heimtest@doctorbox.eu";
  const text = [
    `Unternehmen: ${body.company}`,
    `Name: ${body.name}`,
    `E-Mail: ${body.email}`,
    `Telefon: ${body.phone || "–"}`,
    `Interesse: ${body.interest}`,
    `Volumen: ${body.volume || "–"}`,
    `Sprache: ${body.locale ?? "de"}`,
    "",
    body.message ?? "",
  ].join("\n");

  let sent: boolean;
  try {
    sent = await sendMail({ to, replyTo: body.email, subject: `B2B-Anfrage: ${body.company} (${body.interest})`, text });
  } catch (err) {
    console.error("[b2b inquiry] delivery failed", err);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  if (!sent) {
    console.info("[b2b inquiry] (no BREVO_API_KEY or RESEND_API_KEY configured, logging only)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
