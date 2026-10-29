"use client";

import type { Cart, CartLine, Product, Variant } from "@/lib/shopify/types";

/**
 * E-commerce events for GTM (GA4 format, same shape as the old Shopify theme pushed),
 * the Meta pixel (PageView, ViewContent, AddToCart, never Purchase: the Shopify app tracks
 * checkout) and the Reddit pixel.
 *
 * dataLayer pushes are only processed once GTM runs, which iubenda allows after consent.
 * Meta and Reddit calls wait in a queue until their pixel was activated after consent
 * (see Analytics.tsx), so nothing leaves the browser without consent.
 */

export type TrackItem = {
  productId: string;
  variantId: string;
  name: string;
  variant: string | null;
  brand: string;
  category: string;
  sku: string | null;
  price: number;
  compareAt: number | null;
  quantity: number;
  currency: string;
};

type Call = unknown[];
type TrackingWindow = Window & {
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  rdt?: (...args: unknown[]) => void;
  __dbxMeta?: boolean;
  __dbxMetaQ?: Call[];
  __dbxReddit?: boolean;
  __dbxRedditQ?: Call[];
};

const COUNTRY = "DE";
const round = (n: number) => Math.round(n * 100) / 100;
const numericId = (gid: string) => gid.split("/").pop() ?? gid;

/** "shopify_DE_<product>_<variant>", the ID format of the Shopify Google and Meta catalogues */
export const catalogId = (productId: string, variantId: string) =>
  `shopify_${COUNTRY}_${numericId(productId)}_${numericId(variantId)}`;

const variantName = (title: string | null) => (title && title !== "Default Title" ? title : null);
const value = (items: TrackItem[]) => round(items.reduce((s, i) => s + i.price * i.quantity, 0));

function ga4Item(i: TrackItem, index: number) {
  return {
    index,
    item_id: catalogId(i.productId, i.variantId),
    product_id: numericId(i.productId),
    variant_id: numericId(i.variantId),
    item_name: i.name,
    quantity: i.quantity,
    price: round(i.price),
    discount: i.compareAt && i.compareAt > i.price ? round(i.compareAt - i.price) : 0,
    item_category: i.category,
    item_brand: i.brand,
    ...(i.variant ? { item_variant: i.variant } : {}),
    ...(i.sku ? { sku: i.sku } : {}),
  };
}

function pushEcommerce(event: string, items: TrackItem[]) {
  if (!items.length) return;
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  // Clear the previous ecommerce object first (Google's recommendation for GA4 pushes)
  w.dataLayer.push({ ecommerce: null });
  w.dataLayer.push({ event, ecommerce: { currency: items[0].currency, value: value(items), items: items.map(ga4Item) } });
}

/** Calls the pixel when it is active, otherwise queues the call for its activation after consent */
function pixel(kind: "Meta" | "Reddit", ...args: Call) {
  const w = window as TrackingWindow;
  const fn = kind === "Meta" ? w.fbq : w.rdt;
  if (w[`__dbx${kind}`] && fn) fn(...args);
  else (w[`__dbx${kind}Q`] = w[`__dbx${kind}Q`] || []).push(args);
}

function metaParams(items: TrackItem[]) {
  return {
    content_ids: items.map((i) => catalogId(i.productId, i.variantId)),
    content_type: "product",
    ...(items.length === 1 ? { content_name: items[0].name } : {}),
    contents: items.map((i) => ({ id: catalogId(i.productId, i.variantId), quantity: i.quantity, item_price: round(i.price) })),
    value: value(items),
    currency: items[0].currency,
  };
}

function redditParams(items: TrackItem[]) {
  return {
    currency: items[0].currency,
    value: value(items),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    products: items.map((i) => ({ id: catalogId(i.productId, i.variantId), name: i.name, category: i.category })),
  };
}

/* ------------------------------------------------------------------ */

export function itemFromVariant(product: Pick<Product, "id" | "title" | "vendor" | "productType">, variant: Variant): TrackItem {
  return {
    productId: product.id,
    variantId: variant.id,
    name: product.title,
    variant: variantName(variant.title),
    brand: product.vendor,
    category: product.productType,
    sku: variant.sku,
    price: Number(variant.price.amount),
    compareAt: variant.compareAtPrice ? Number(variant.compareAtPrice.amount) : null,
    quantity: 1,
    currency: variant.price.currencyCode,
  };
}

export function itemFromLine(line: CartLine, quantity = line.quantity): TrackItem {
  const unit = Number(line.cost.totalAmount.amount) / Math.max(line.quantity, 1);
  const m = line.merchandise;
  return {
    productId: m.product.id,
    variantId: m.id,
    name: m.product.title,
    variant: variantName(m.title),
    brand: m.product.vendor,
    category: m.product.productType,
    sku: m.sku,
    price: unit,
    compareAt: line.cost.compareAtAmountPerQuantity ? Number(line.cost.compareAtAmountPerQuantity.amount) : null,
    quantity,
    currency: line.cost.totalAmount.currencyCode,
  };
}

export function trackViewItem(item: TrackItem) {
  pushEcommerce("view_item", [item]);
  pixel("Meta", "track", "ViewContent", metaParams([item]));
  pixel("Reddit", "track", "ViewContent", redditParams([item]));
}

export function trackAddToCart(item: TrackItem) {
  pushEcommerce("add_to_cart", [item]);
  pixel("Meta", "track", "AddToCart", metaParams([item]));
  pixel("Reddit", "track", "AddToCart", redditParams([item]));
}

export function trackViewCart(cart: Cart) {
  pushEcommerce("view_cart", cart.lines.map((l) => itemFromLine(l)));
}

/** Client-side navigation; the first page view comes from the pixel snippets themselves */
export function trackPageView() {
  const w = window as TrackingWindow;
  if (w.__dbxMeta && w.fbq) w.fbq("track", "PageView");
  if (w.__dbxReddit && w.rdt) w.rdt("track", "PageVisit");
}
