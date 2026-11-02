import type { NextConfig } from "next";

/**
 * Shopify keeps serving the agent-commerce endpoints (UCP profile, UCP MCP server)
 * on its own domain. The storefront proxies them so agents that discover the shop
 * at shop.doctorbox.de keep working after the domain moves to this app. Shopify-only
 * paths (checkout, account, orders, apps) are sent to the Shopify domain.
 */
const shopifyDomain = process.env.SHOPIFY_ONLINE_STORE_DOMAIN ?? "doctorbox-heimtests.myshopify.com";
// Only the live domain may be indexed; the vercel.app copy and previews send noindex
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
          // UCP discovery for AI shopping agents (same header Shopify storefronts send)
          { key: "Link", value: '</.well-known/ucp>; rel="ucp"' },
        ],
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
    ];
  },
};

export default nextConfig;
