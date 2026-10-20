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
  ) {
    super(message);
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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: dedupeFragments(query),
      variables: {
        language: shopifyLanguage(locale),
        country: "DE",
        ...variables,
      },
    }),
    ...(cache ? { cache } : {}),
    next: cache ? undefined : { revalidate: revalidate === false ? false : revalidate, tags },
  });

  if (!res.ok) {
    throw new ShopifyError(`Shopify responded with ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors && json.errors.length) {
    // Access-scope errors on optional fields should not take the page down
    const fatal = (json.errors as { message?: string }[]).filter(
      (e) => !/Access denied/i.test(e.message ?? ""),
    );
    if (fatal.length || !json.data) {
      console.error("[shopify]", JSON.stringify(json.errors).slice(0, 800));
      throw new ShopifyError("Shopify GraphQL error", json.errors);
    }
  }
  return json.data as T;
}

/** Collapses Relay `edges { node }` into a plain array. */
export function nodes<T>(connection: { edges: { node: T }[] } | null | undefined): T[] {
  return connection?.edges.map((e) => e.node) ?? [];
}
