"use client";

import {
  AnalyticsEventName,
  AnalyticsPageType,
  ShopifySalesChannel,
  getClientBrowserParameters,
  getTrackingValues,
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
 * Visitor and session tokens come from Shopify's Customer Privacy API, which the iubenda callback
 * loads and hands the visitor's choice to (Analytics.tsx). Shopify keeps them stable
 * through its own cookies, set via our proxy (ensureCookies), whose answer the events then use. The checkout
 * on checkout.doctorbox.de continues the same session.
 *
 * Nothing is sent without consent to measurement (iubenda purpose 4 → Shopify "analytics").
 * Events from before the choice wait here and go out once Shopify reports the consent.
 */

type CustomerPrivacy = {
  analyticsProcessingAllowed?: () => boolean;
  marketingAllowed?: () => boolean;
  preferencesProcessingAllowed?: () => boolean;
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
    // the shop sells to the EU only
    gdprEnforced: true,
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
  // after the cookie request, so the first event of a page load already has the visitor's stable tokens
  void ensureCookies().then(() => {
    const payload = { ...base(), ...stable, ...event.payload } as ShopifyPageViewPayload;
    sendShopifyAnalytics({ eventName: event.eventName, payload }, TRACKING.shopifyCheckoutDomain).catch(() => {});
  });
}

/**
 * Asks Shopify, through our proxy (app/api/unstable/graphql.json), for this visitor's tokens. Shopify
 * keeps them in its own HttpOnly cookies; without them every page load would be a new visitor. The
 * page's tokens go along, so a first visit keeps the ones it started with. Once per page load, and
 * only called with consent (send runs after the consent check).
 */
let cookies: Promise<void> | null = null;
/** the tokens Shopify knows this visitor by (from its cookies); they replace the page's own */
let stable: { uniqueToken: string; visitToken: string } | null = null;

function ensureCookies(): Promise<void> {
  if (cookies) return cookies;
  const { uniqueToken, visitToken } = getTrackingValues();
  const p = privacy();
  // the visitor's real choice: with an empty one Shopify assumes "declined" and returns no tokens
  const visitorConsent = {
    analytics: true,
    marketing: safe(p?.marketingAllowed),
    preferences: safe(p?.preferencesProcessingAllowed),
    saleOfData: safe(p?.saleOfDataAllowed),
  };
  cookies = fetch("/api/unstable/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(uniqueToken && visitToken ? { "X-Shopify-UniqueToken": uniqueToken, "X-Shopify-VisitToken": visitToken } : {}),
    },
    body: JSON.stringify({
      query:
        "query ensureCookies($visitorConsent: VisitorConsent!) { consentManagement { cookies(visitorConsent: $visitorConsent) { trackingConsentCookie cookieDomain shopifyUnique shopifyVisit } } }",
      variables: { visitorConsent },
    }),
  })
    .then((r) => r.json())
    .then((j: { data?: { consentManagement?: { cookies?: { shopifyUnique?: string | null; shopifyVisit?: string | null } } } }) => {
      const c = j.data?.consentManagement?.cookies;
      if (c?.shopifyUnique && c.shopifyVisit) stable = { uniqueToken: c.shopifyUnique, visitToken: c.shopifyVisit };
    })
    .catch(() => {});
  return cookies;
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
