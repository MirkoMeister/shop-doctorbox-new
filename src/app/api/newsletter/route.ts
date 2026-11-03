import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { email, honeypot, invalidResponse, line, rateLimitedResponse } from "@/lib/form-fields";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Payload = z.object({
  email,
  locale: line(10).optional(),
  source: line(100).optional(),
  website: honeypot, // honeypot
});

/** Every sign-up sends a double opt-in mail, so this also limits mails to addresses that are not the sender's */
const limited = rateLimiter({ windowMs: 60 * 60 * 1000, perKey: 5, global: 300 });

/**
 * Newsletter sign-up → Klaviyo list (double opt-in is configured on the list in
 * Klaviyo; the subscriber confirms by e-mail). Klaviyo's Shopify integration
 * syncs the consent to the customer record, so Shopify needs no separate call.
 * Env: NEXT_PUBLIC_KLAVIYO_COMPANY_ID (public key), KLAVIYO_LIST_ID
 */
export async function POST(req: NextRequest) {
  const parsed = Payload.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalidResponse(parsed.error);
  const body = parsed.data;
  if (body.website) return NextResponse.json({ ok: true }); // honeypot
  if (limited(clientIp(req.headers) ?? "local")) return rateLimitedResponse();

  const company = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID;
  const list = process.env.KLAVIYO_LIST_ID ?? process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
  if (!company || !list) {
    console.warn("[newsletter] Klaviyo company id or list id missing");
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(company)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", revision: "2025-01-15" },
    body: JSON.stringify({
      data: {
        type: "subscription",
        attributes: {
          custom_source: body.source ?? "Shop",
          profile: {
            data: {
              type: "profile",
              attributes: {
                email: body.email,
                properties: { locale: body.locale ?? "de", shop: "shop.doctorbox.de" },
                subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
              },
            },
          },
        },
        relationships: { list: { data: { type: "list", id: list } } },
      },
    }),
  });
  if (!res.ok && res.status !== 202) {
    console.warn("[newsletter] Klaviyo", res.status, (await res.text()).slice(0, 300));
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
