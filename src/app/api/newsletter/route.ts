import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Newsletter sign-up → Klaviyo list (double opt-in is configured on the list in
 * Klaviyo; the subscriber confirms by e-mail). Klaviyo's Shopify integration
 * syncs the consent to the customer record, so Shopify needs no separate call.
 * Env: NEXT_PUBLIC_KLAVIYO_COMPANY_ID (public key), KLAVIYO_LIST_ID
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; locale?: string; source?: string; website?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot
  const email = String(body.email ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });

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
                email,
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
