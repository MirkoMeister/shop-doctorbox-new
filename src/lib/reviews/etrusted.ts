import "server-only";

/**
 * Product reviews from Trusted Shops (eTrusted API). Server only: the client
 * credentials never reach the browser. Without credentials every call returns
 * an empty list and the shop falls back to the Shopify rating metafields.
 *
 * Env: ETRUSTED_CLIENT_ID, ETRUSTED_CLIENT_SECRET, optional ETRUSTED_CHANNEL_ID
 */
export type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  submittedAt: string;
  author: string | null;
  verified: boolean;
  sku: string | null;
  reply: string | null;
};

const TOKEN_URL = "https://login.etrusted.com/oauth/token";
const API = "https://api.etrusted.com";

export const etrustedConfigured = () => Boolean(process.env.ETRUSTED_CLIENT_ID && process.env.ETRUSTED_CLIENT_SECRET);

let token: { value: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && token.expires > Date.now() + 15_000) return token.value;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.ETRUSTED_CLIENT_ID ?? "",
      client_secret: process.env.ETRUSTED_CLIENT_SECRET ?? "",
      grant_type: "client_credentials",
      audience: API,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`eTrusted token ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return token.value;
}

type RawReview = {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  submittedAt: string;
  state?: string;
  verificationType?: string;
  customer?: { firstName?: string | null; fullName?: string | null } | null;
  product?: { sku?: string | null } | null;
  reply?: { comment?: string | null } | null;
  feedbackType?: string;
};

function normalize(r: RawReview): ProductReview {
  const first = r.customer?.firstName?.trim() || r.customer?.fullName?.trim()?.split(/\s+/)[0] || null;
  return {
    id: r.id,
    rating: Number(r.rating),
    title: r.title?.trim() || null,
    comment: r.comment?.trim() || null,
    submittedAt: r.submittedAt,
    author: first,
    verified: (r.verificationType ?? "").toUpperCase() === "VERIFIED",
    sku: r.product?.sku ?? null,
    reply: r.reply?.comment?.trim() || null,
  };
}

/**
 * Approved product reviews for the given SKUs, newest first. Pages through the
 * API; results are cached for an hour per SKU set.
 */
export async function getProductReviews(skus: string[], limit = 200): Promise<ProductReview[]> {
  const clean = Array.from(new Set(skus.map((s) => s.trim()).filter(Boolean)));
  if (!etrustedConfigured() || !clean.length) return [];
  try {
    const bearer = await accessToken();
    const out: ProductReview[] = [];
    let after: string | null = null;
    do {
      const params = new URLSearchParams({
        type: "PRODUCT_REVIEW",
        status: "APPROVED",
        sku: clean.join(","),
        count: "100",
        orderBy: "submittedAt",
      });
      if (process.env.ETRUSTED_CHANNEL_ID) params.set("channels", process.env.ETRUSTED_CHANNEL_ID);
      if (after) params.set("after", after);
      const res = await fetch(`${API}/reviews?${params}`, {
        headers: { Authorization: `Bearer ${bearer}`, Accept: "application/json" },
        next: { revalidate: 3600, tags: ["reviews"] },
      });
      if (!res.ok) throw new Error(`eTrusted reviews ${res.status}`);
      const json = (await res.json()) as { items: RawReview[]; paging?: { cursor?: { after?: string | null } } };
      out.push(...json.items.filter((r) => r.feedbackType !== "STATEMENT" && r.state !== "REJECTED").map(normalize));
      after = json.items.length === 100 && out.length < limit ? (json.paging?.cursor?.after ?? null) : null;
    } while (after);
    return out.slice(0, limit);
  } catch (err) {
    console.warn("[etrusted]", err instanceof Error ? err.message : err);
    return [];
  }
}

export function summarize(reviews: ProductReview[]): { rating: number; count: number } | null {
  if (!reviews.length) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { rating: Math.round((sum / reviews.length) * 100) / 100, count: reviews.length };
}

/**
 * Average and count per product handle across every approved product review.
 * The handle comes from the product URL Trusted Shops stores with the review,
 * so renamed SKUs still land on the right product. Cached for an hour.
 */
export async function getReviewSummaries(): Promise<Map<string, { rating: number; count: number }>> {
  const out = new Map<string, { rating: number; count: number }>();
  if (!etrustedConfigured()) return out;
  try {
    const bearer = await accessToken();
    const sums = new Map<string, { sum: number; n: number }>();
    let after: string | null = null;
    do {
      const params = new URLSearchParams({ type: "PRODUCT_REVIEW", status: "APPROVED", count: "100", orderBy: "submittedAt" });
      if (process.env.ETRUSTED_CHANNEL_ID) params.set("channels", process.env.ETRUSTED_CHANNEL_ID);
      if (after) params.set("after", after);
      const res = await fetch(`${API}/reviews?${params}`, {
        headers: { Authorization: `Bearer ${bearer}`, Accept: "application/json" },
        next: { revalidate: 3600, tags: ["reviews"] },
      });
      if (!res.ok) throw new Error(`eTrusted reviews ${res.status}`);
      const json = (await res.json()) as { items: (RawReview & { product?: { url?: string | null } | null })[]; paging?: { cursor?: { after?: string | null } } };
      for (const r of json.items) {
        if (r.feedbackType === "STATEMENT" || r.state === "REJECTED") continue;
        const handle = r.product?.url?.match(/\/products\/([^/?#]+)/)?.[1];
        if (!handle) continue;
        const s = sums.get(handle) ?? { sum: 0, n: 0 };
        s.sum += Number(r.rating);
        s.n += 1;
        sums.set(handle, s);
      }
      after = json.items.length === 100 ? (json.paging?.cursor?.after ?? null) : null;
    } while (after);
    for (const [h, s] of sums) out.set(h, { rating: Math.round((s.sum / s.n) * 100) / 100, count: s.n });
  } catch (err) {
    console.warn("[etrusted] summaries", err instanceof Error ? err.message : err);
  }
  return out;
}

/** Cards carry the Trusted Shops rating and count where reviews exist; the Shopify metafield stays the fallback */
export async function applyReviewSummaries<T extends { handle: string; rating: number | null; ratingCount: number }>(cards: T[]): Promise<T[]> {
  if (!etrustedConfigured() || !cards.length) return cards;
  const summaries = await getReviewSummaries();
  if (!summaries.size) return cards;
  return cards.map((c) => {
    const s = summaries.get(c.handle);
    return s ? { ...c, rating: s.rating, ratingCount: s.count } : c;
  });
}
