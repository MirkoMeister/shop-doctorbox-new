import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { shopifyLanguage } from "@/lib/i18n/config";

const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "shop.doctorbox.de";
const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-07";
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export class ShopifyError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown,
    /** true when the only problem is a missing Storefront API access scope */
    public readonly accessDenied = false,
  ) {
    super(message);
  }
}

/** Resolve to `fallback` instead of failing when the token lacks a scope (content, selling plans …) */
export async function soft<T>(p: Promise<T>, fallback: T, what: string): Promise<T> {
  try {
    return await p;
  } catch (err) {
    if (err instanceof ShopifyError && err.accessDenied) {
      console.warn(`[shopify] ${what}: access scope missing → showing nothing`);
      return fallback;
    }
    throw err;
  }
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  locale?: Locale;
  /** seconds; use 0 for no caching (cart) */
  revalidate?: number | false;
  tags?: string[];
  cache?: RequestCache;
};

/**
 * Fragments are composed by string interpolation, so the same fragment can
 * appear several times in one document. GraphQL requires unique names –
 * keep the first definition of each.
 */
export function dedupeFragments(query: string): string {
  const seen = new Set<string>();
  let out = "";
  let i = 0;
  const re = /fragment\s+(\w+)\s+on\s+\w+\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(query))) {
    const start = m.index;
    // find the matching closing brace
    let depth = 0;
    let j = start + m[0].length - 1;
    for (; j < query.length; j++) {
      if (query[j] === "{") depth++;
      else if (query[j] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    const end = j + 1;
    out += query.slice(i, start);
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out += query.slice(start, end);
    }
    i = end;
    re.lastIndex = end;
  }
  return out + query.slice(i);
}

/**
 * Minimal Storefront GraphQL client. Injects @inContext for the locale by
 * declaring $language/$country variables that every query can accept.
 */
export async function shopifyFetch<T>(query: string, options: FetchOptions = {}): Promise<T> {
  if (!token) {
    throw new ShopifyError("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }
  const { variables = {}, locale = "de", revalidate = 300, tags, cache } = options;

  const init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: dedupeFragments(sellingPlansDenied ? stripSellingPlans(query) : query),
      variables: {
        language: shopifyLanguage(locale),
        country: "DE",
        ...variables,
      },
    }),
    ...(cache ? { cache } : {}),
    next: cache ? undefined : { revalidate: revalidate === false ? false : revalidate, tags },
  };

  // Storefront API throttles bursts (429) and occasionally answers 5xx while the build
  // prerenders hundreds of pages: retry those with backoff instead of failing the build.
  let res: Response | null = null;
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      res = await fetch(endpoint, init);
      if (res.ok || (res.status < 500 && res.status !== 429)) break;
      lastError = new ShopifyError(`Shopify responded with ${res.status}`);
    } catch (err) {
      lastError = err;
      res = null;
    }
    await new Promise((r) => setTimeout(r, 400 * 2 ** attempt + Math.random() * 300));
  }
  if (!res) throw lastError instanceof Error ? lastError : new ShopifyError("Shopify unreachable");
  if (!res.ok) {
    throw new ShopifyError(`Shopify responded with ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors && json.errors.length) {
    const errs = json.errors as { message?: string }[];
    const denied = errs.filter((e) => /Access denied/i.test(e.message ?? ""));
    const fatal = errs.filter((e) => !/Access denied/i.test(e.message ?? ""));
    // Selling plans are optional for the shop: if the token lost that scope, drop the
    // selling-plan selections from the query and retry once, remembering the outcome.
    if (!fatal.length && denied.some((e) => /sellingPlan/i.test(e.message ?? "")) && !sellingPlansDenied) {
      sellingPlansDenied = true;
      console.warn("[shopify] token lacks unauthenticated_read_selling_plans → subscriptions disabled");
      return shopifyFetch<T>(query, options);
    }
    if (fatal.length || !json.data) {
      console.error("[shopify]", JSON.stringify(json.errors).slice(0, 800));
      throw new ShopifyError("Shopify GraphQL error", json.errors, denied.length > 0 && !fatal.length);
    }
  }
  return json.data as T;
}

/** Set once the Storefront token proved to lack the selling-plans scope */
let sellingPlansDenied = false;

/** Removes every `…sellingPlanGroups(…) { … }` / `sellingPlanAllocations(…) { … }` selection, braces balanced */
export function stripSellingPlans(query: string): string {
  const re = /(\w+:\s*)?(sellingPlanGroups|sellingPlanAllocations)\s*\([^)]*\)\s*\{/g;
  let out = "";
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(query))) {
    const start = m.index;
    let depth = 1;
    let j = re.lastIndex;
    while (j < query.length && depth > 0) {
      if (query[j] === "{") depth++;
      else if (query[j] === "}") depth--;
      j++;
    }
    out += query.slice(i, start);
    i = j;
    re.lastIndex = j;
  }
  return out + query.slice(i);
}

/** Collapses Relay `edges { node }` into a plain array. */
export function nodes<T>(connection: { edges: { node: T }[] } | null | undefined): T[] {
  return connection?.edges.map((e) => e.node) ?? [];
}
