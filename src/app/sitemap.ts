import type { MetadataRoute } from "next";
import { listMigratedPages } from "@/lib/content/pages";
import { BLOG_BASE, BLOG_TOPICS, GUIDE_BASE, articleHref, blogHref, guideHref, isGuidePage } from "@/lib/content/guides";
import { absoluteUrl, locales } from "@/lib/i18n/config";
import { getAllArticles, getAllPageHandles, getAllProducts, getCollections } from "@/lib/shopify/queries";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

function entry(path: string, lastModified?: string | Date, priority = 0.6, changeFrequency: Entry["changeFrequency"] = "weekly"): Entry[] {
  // One entry per locale, each carrying hreflang alternates
  const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)]));
  languages["x-default"] = absoluteUrl("de", path);
  return locales.map((l) => ({
    url: absoluteUrl(l, path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency,
    priority: l === "de" ? priority : Math.max(0.1, priority - 0.1),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, apiPages, migrated, articles] = await Promise.all([
    getAllProducts("de").catch(() => []),
    getCollections("de").catch(() => []),
    getAllPageHandles("de").catch(() => []),
    listMigratedPages("de"),
    getAllArticles("de").catch(() => []),
  ]);

  const pageHandles = new Map<string, string>();
  for (const p of apiPages) pageHandles.set(p.handle, p.updatedAt);
  for (const p of migrated) if (!pageHandles.has(p.handle)) pageHandles.set(p.handle, p.updatedAt);

  return [
    ...entry("/", undefined, 1, "daily"),
    ...entry("/collections", undefined, 0.9, "daily"),
    ...products.flatMap((p) => entry(`/products/${p.handle}`, undefined, 0.8, "weekly")),
    ...collections.flatMap((c) => entry(`/collections/${c.handle}`, c.updatedAt, 0.7)),
    ...entry(GUIDE_BASE, undefined, 0.7, "weekly"),
    ...entry(BLOG_BASE, undefined, 0.7, "weekly"),
    ...Object.keys(BLOG_TOPICS)
      .filter((b) => articles.some((a) => a.blog.handle === b))
      .flatMap((b) => entry(blogHref(b), undefined, 0.6, "weekly")),
    ...Array.from(pageHandles.entries())
      .filter(([h]) => h !== "ratgeber" && h !== "gesundheitsblog")
      .flatMap(([h, u]) => entry(guideHref(h), u, isGuidePage(h) ? 0.6 : 0.4, "monthly")),
    ...articles.flatMap((a) => entry(articleHref(a.blog.handle, a.handle), a.publishedAt, 0.6, "monthly")),
  ];
}
