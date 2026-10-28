import { notFound, permanentRedirect } from "next/navigation";
import { articleHref } from "@/lib/content/guides";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { getAllArticles } from "@/lib/shopify/queries";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Short article URLs from the first headless preview → the canonical Shopify URL */
export default async function BlogSlugRedirect({ params }: Props) {
  const { locale, params: p } = await resolveLocale(params);
  const articles = await getAllArticles(locale).catch(() => []);
  const hit = articles.find((a) => a.handle === p.slug);
  if (!hit) notFound();
  permanentRedirect(localeHref(locale, articleHref(hit.blog.handle, hit.handle)));
}
