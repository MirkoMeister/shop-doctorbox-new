import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets phones/laptops in the local network load the dev server via LAN IP or Bonjour name
  allowedDevOrigins: ["192.168.178.187", "mirkos-macbook-pro.local", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "shop.doctorbox.de" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
