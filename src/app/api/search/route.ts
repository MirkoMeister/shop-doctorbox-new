import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { predictiveSearch } from "@/lib/shopify/queries";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  const loc = req.nextUrl.searchParams.get("locale") ?? "de";
  const locale = isLocale(loc) ? loc : "de";
  if (q.length < 2) {
    return NextResponse.json({ products: [], queries: [], collections: [] });
  }
  try {
    const result = await predictiveSearch(q, locale, 6);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e) {
    console.error("[search]", e);
    return NextResponse.json({ products: [], queries: [], collections: [] }, { status: 200 });
  }
}
