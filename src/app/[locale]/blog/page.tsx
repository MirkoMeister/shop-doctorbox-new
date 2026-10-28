import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { BLOG_BASE, BLOG_TOPICS, blogHref } from "@/lib/content/guides";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ thema?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, BLOG_BASE, {
    title: dict.blog.title,
    description: dict.blog.text,
  });
}

/** Health blog: all Shopify blog articles; single blogs live at /blogs/<blog>. */
export default async function BlogIndex({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const { thema } = await searchParams;
  if (thema && BLOG_TOPICS[thema])
    permanentRedirect(localeHref(locale, blogHref(thema)));
  const articles = await getAllArticles(locale).catch(() => []);
  return (
    <BlogIndexView articles={articles} active={null} locale={locale} dict={dict} />
  );
}
