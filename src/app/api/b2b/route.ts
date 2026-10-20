import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

type Payload = {
  company: string;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  volume?: string;
  message?: string;
  website?: string; // honeypot
  locale?: string;
};

/**
 * B2B inquiry endpoint. Sends the request by e-mail through Resend when
 * RESEND_API_KEY is configured; otherwise it is logged on the server so the
 * form still works in development. Recipient: B2B_INQUIRY_TO (default heimtest@doctorbox.eu).
 */
export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // bot filled the honeypot
  const required = ["company", "name", "email", "interest"] as const;
  for (const k of required) if (!body[k] || String(body[k]).trim().length < 2) return NextResponse.json({ ok: false, error: "missing", field: k }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });

  const to = process.env.B2B_INQUIRY_TO ?? "heimtest@doctorbox.eu";
  const text = [
    `Unternehmen: ${body.company}`,
    `Name: ${body.name}`,
    `E-Mail: ${body.email}`,
    `Telefon: ${body.phone ?? "–"}`,
    `Interesse: ${body.interest}`,
    `Volumen: ${body.volume ?? "–"}`,
    `Sprache: ${body.locale ?? "de"}`,
    "",
    body.message ?? "",
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[b2b inquiry] (no RESEND_API_KEY configured, logging only)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.B2B_INQUIRY_FROM ?? "DoctorBox Shop <shop@doctorbox.de>",
      to: [to],
      reply_to: body.email,
      subject: `B2B-Anfrage: ${body.company} (${body.interest})`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[b2b inquiry] resend failed", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
