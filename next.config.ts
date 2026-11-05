import { existsSync, readFileSync } from "node:fs";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Shopify keeps serving the agent-commerce endpoints (UCP profile, UCP MCP server)
 * on its own domain. The storefront proxies them so agents that discover the shop
 * at shop.doctorbox.de keep working after the domain moves to this app. Shopify-only
 * paths (checkout, account, orders, apps) are sent to the Shopify domain.
 */
const shopifyDomain = process.env.SHOPIFY_ONLINE_STORE_DOMAIN ?? "doctorbox-heimtests.myshopify.com";
// Only the live domain may be indexed; the scalingo.io address and any other host send noindex
const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.doctorbox.de").host;

const nextConfig: NextConfig = {
  // Dev only: lets phones/laptops in the local network load the dev server via LAN IP or Bonjour name
  allowedDevOrigins: ["192.168.178.187", "mirkos-macbook-pro.local", "localhost"],
  // No on-server image optimisation: the Shopify CDN resizes its own images, local photos are pre-sized at build
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Browsers ignore it over plain http, so local and LAN dev are unaffected
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Baseline only: no script-src, because a nonce policy would force every page to render dynamically
          // and GTM, iubenda and the pixels load scripts from changing hosts
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'" },
          // UCP discovery for AI shopping agents (same header Shopify storefronts send)
          { key: "Link", value: '</.well-known/ucp>; rel="ucp"' },
        ],
      },
      {
        // Pre-sized photos (scripts/build-images.mjs): names aren't content-hashed, so a day fresh, then revalidated in the background
        source: "/_img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/(.*)",
        missing: [{ type: "host", value: siteHost }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/.well-known/ucp", destination: `https://${shopifyDomain}/.well-known/ucp` },
      { source: "/.well-known/ucp/:path*", destination: `https://${shopifyDomain}/.well-known/ucp/:path*` },
      { source: "/api/ucp/:path*", destination: `https://${shopifyDomain}/api/ucp/:path*` },
    ];
  },
  async redirects() {
    // Shopify-hosted flows that have no page in this app
    return [
      ...["/checkouts/:path*", "/cart/c/:path*", "/account/:path*", "/orders/:path*", "/apps/:path*", "/tools/:path*", "/password"].map((source) => ({
        source,
        destination: `https://${shopifyDomain}${source.replace(/:path\*$/, ":path*")}`,
        permanent: false,
      })),
      // Withdrawal form (§ 356a BGB) comes from the "EU Widerruf Button" app, which only renders in the Shopify theme;
      // the redirect theme leaves this page alone
      ...["/pages/widerruf-formular", "/en/pages/widerruf-formular"].map((source) => ({
        source,
        destination: `https://${shopifyDomain}${source}`,
        permanent: false,
      })),
      // Migrated content links images as shop.doctorbox.de/cdn/shop/…, which is the Shopify CDN under the custom domain
      { source: "/cdn/shop/:path*", destination: "https://cdn.shopify.com/s/files/1/0564/6991/3683/:path*", permanent: false },
    ];
  },
};

/**
 * Version skew protection: the ID comes from scripts/deployment-id.mjs (prebuild) and is the same in
 * the build and the running server. Tabs opened before a deploy then reload on their next navigation.
 */
function deploymentId(phase: string): string | undefined {
  if (phase === PHASE_DEVELOPMENT_SERVER || !existsSync(".deployment-id")) return undefined;
  return readFileSync(".deployment-id", "utf8").trim() || undefined;
}

export default function config(phase: string): NextConfig {
  return { ...nextConfig, deploymentId: deploymentId(phase) };
}
