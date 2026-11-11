"use client";

import {
  AnalyticsEventName,
  AnalyticsPageType,
  ShopifySalesChannel,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  type ShopifyAnalyticsProduct,
  type ShopifyPageViewPayload,
} from "@shopify/hydrogen-react";
import type { Cart } from "@/lib/shopify/types";
import { TRACKING } from "./config";
import type { TrackItem } from "./events";

/**
 * Shopify's own analytics (Admin → Analytics: sessions, conversion rate, funnel, live view).
 * A headless storefront does not load Shopify's theme scripts, so without this Shopify only saw
 * sessions that started in the checkout.
 *
 * Visitor and session tokens (_shopify_y/_shopify_s) come from Shopify's Customer Privacy API,
 * which the iubenda callback loads and hands the visitor's choice to (Analytics.tsx). The checkout
 * on checkout.doctorbox.de continues the same session.
 *
 * Nothing is sent without consent to measurement (iubenda purpose 4 → Shopify "analytics").
 * Events from before the choice wait here and go out once Shopify reports the consent.
 */

type CustomerPrivacy = {
  analyticsProcessingAllowed?: () => boolean;
  marketingAllowed?: () => boolean;
  saleOfDataAllowed?: () => boolean;
};
type ShopifyWindow = Window & { Shopify?: { customerPrivacy?: CustomerPrivacy } };

const privacy = () => (window as ShopifyWindow).Shopify?.customerPrivacy;

/** Consent to measurement, as Shopify's Customer Privacy API knows it (false while it is not loaded) */
function analyticsAllowed(): boolean {
  try {
    return privacy()?.analyticsProcessingAllowed?.() === true;
  } catch {
    return false;
  }
}

type Event = { eventName: string; payload: Record<string, unknown> };
/** waiting for consent: the last page view and add-to-cart events */
let pendingView: Event | null = null;
const pendingCarts: Event[] = [];
let listening = false;

function base() {
  const p = privacy();
  const en = window.location.pathname === "/en" || window.location.pathname.startsWith("/en/");
  return {
    ...getClientBrowserParameters(),
    shopId: TRACKING.shopifyShopId,
    currency: "EUR" as const,
    acceptedLanguage: en ? ("EN" as const) : ("DE" as const),
    shopifySalesChannel: ShopifySalesChannel.headless,
    ...(TRACKING.shopifyStorefrontId ? { storefrontId: TRACKING.shopifyStorefrontId } : {}),
    hasUserConsent: true,
    analyticsAllowed: true,
    marketingAllowed: safe(p?.marketingAllowed),
    saleOfDataAllowed: safe(p?.saleOfDataAllowed),
  };
}

function safe(fn?: () => boolean) {
  try {
    return fn?.() === true;
  } catch {
    return false;
  }
}

function send(event: Event) {
  // payload built at send time so the tokens are the ones the Customer Privacy API holds now
  const payload = { ...base(), ...event.payload } as ShopifyPageViewPayload;
  sendShopifyAnalytics({ eventName: event.eventName, payload }, TRACKING.shopifyCheckoutDomain).catch(() => {});
}

function flush() {
  if (!analyticsAllowed()) return;
  if (pendingView) send(pendingView);
  pendingView = null;
  pendingCarts.splice(0).forEach(send);
}

/** Shopify announces a recorded choice (also on later visits, when iubenda passes on the stored one) */
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("visitorConsentCollected", flush);
  document.addEventListener("consentTrackingApiLoaded", flush);
}

function track(event: Event, kind: "view" | "cart") {
  listen();
  if (analyticsAllowed()) return send(event);
  if (kind === "view") pendingView = event;
  else if (pendingCarts.length < 5) pendingCarts.push(event);
}

/* ------------------------------------------------------------------ */

/** Shopify page type and resource details from the public URL (product pages report themselves) */
function pageDetails(): Partial<ShopifyPageViewPayload> {
  const path = window.location.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  const [, first, second, third] = path.split("/");
  if (path === "/") return { pageType: AnalyticsPageType.home };
  if (first === "collections") return second ? { pageType: AnalyticsPageType.collection, collectionHandle: second } : { pageType: AnalyticsPageType.listCollections };
  if (first === "cart") return { pageType: AnalyticsPageType.cart };
  if (first === "search") return { pageType: AnalyticsPageType.search, searchString: new URLSearchParams(window.location.search).get("q") ?? "" };
  if (first === "blogs") return { pageType: third ? AnalyticsPageType.article : AnalyticsPageType.blog };
  if (first === "blog") return { pageType: AnalyticsPageType.blog };
  if (first === "policies") return { pageType: AnalyticsPageType.policy };
  return { pageType: AnalyticsPageType.page };
}

/** last page view sent, so React's double effect run in development does not count twice */
let lastView = "";

function pageView(details: Partial<ShopifyPageViewPayload>) {
  const key = `${window.location.href}|${details.pageType}`;
  if (key === lastView) return;
  lastView = key;
  track({ eventName: AnalyticsEventName.PAGE_VIEW, payload: details }, "view");
}

const isProductPath = (path: string) => /^(\/en)?\/products\/[^/]+/.test(path);

/** Page view on load and on every client-side navigation; product pages use shopifyProductView */
export function shopifyPageView() {
  if (isProductPath(window.location.pathname)) return;
  pageView(pageDetails());
}

function product(i: TrackItem): ShopifyAnalyticsProduct {
  return {
    productGid: i.productId,
    variantGid: i.variantId,
    name: i.name,
    variantName: i.variant ?? undefined,
    brand: i.brand,
    category: i.category || undefined,
    price: String(i.price),
    sku: i.sku ?? undefined,
    quantity: i.quantity,
  };
}

export function shopifyProductView(item: TrackItem) {
  pageView({ pageType: AnalyticsPageType.product, resourceId: item.productId, products: [product(item)], totalValue: item.price * item.quantity });
}

export function shopifyAddToCart(item: TrackItem, cart: Cart) {
  track(
    {
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload: { cartId: cart.id, products: [product(item)], totalValue: Number(cart.cost.totalAmount.amount) },
    },
    "cart",
  );
}
