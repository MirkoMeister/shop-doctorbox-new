import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

type Payload = {
  topic: string;
  name: string;
  email: string;
  order?: string;
  message: string;
  website?: string; // honeypot
  locale?: string;
};

/**
 * Contact form endpoint. Sends the message by e-mail through Resend when
 * RESEND_API_KEY is configured; otherwise it is logged on the server so the
 * form still works in development. Recipient: CONTACT_TO (falls back to B2B_INQUIRY_TO).
 */
export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // bot filled the honeypot
  for (const k of ["topic", "name", "email", "message"] as const) {
    if (!body[k] || String(body[k]).trim().length < 2) return NextResponse.json({ ok: false, error: "missing", field: k }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  if (body.message.length > 5000) return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });

  const to = process.env.CONTACT_TO ?? process.env.B2B_INQUIRY_TO ?? "heimtest@doctorbox.eu";
  const text = [
    `Thema: ${body.topic}`,
    `Name: ${body.name}`,
    `E-Mail: ${body.email}`,
    `Bestellnummer: ${body.order?.trim() || "–"}`,
    `Sprache: ${body.locale ?? "de"}`,
    "",
    body.message.trim(),
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] (no RESEND_API_KEY configured, logging only)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.B2B_INQUIRY_FROM ?? "DoctorBox Shop <shop@doctorbox.de>",
      to: [to],
      reply_to: body.email,
      subject: `Kontakt (${body.topic}): ${body.name}${body.order ? ` · ${body.order.trim()}` : ""}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
