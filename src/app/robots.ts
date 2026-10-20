import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n/config";

/** Mirrors the old Shopify robots.txt so crawl behaviour stays the same. */
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/cart",
    "/en/cart",
    "/search",
    "/en/search",
    "/checkouts/",
    "/checkout",
    "/orders",
    "/account",
    "/collections/*sort_by*",
    "/*/collections/*sort_by*",
    "/collections/*?sort=*",
    "/*/collections/*?sort=*",
    "/collections/*?sample=*",
    "/*/collections/*?sample=*",
    "/policies/",
    "/*/policies/",
    "/*?*oseid=*",
  ];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
