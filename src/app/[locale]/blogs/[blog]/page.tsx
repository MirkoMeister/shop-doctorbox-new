import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { BLOG_TOPICS, blogHref } from "@/lib/content/guides";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string; blog: string }> };

export function generateStaticParams() {
  return Object.keys(BLOG_TOPICS).map((blog) => ({ blog }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict, params: p } = await resolveLocale(params);
  const topic = BLOG_TOPICS[p.blog];
  if (!topic) return {};
  return pageMetadata(locale, blogHref(p.blog), {
    title: `${topic[locale]} · ${dict.blog.title}`,
    description: dict.blog.text,
  });
}

/** One Shopify blog at its old URL (/blogs/<blog>) */
export default async function BlogPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  if (!BLOG_TOPICS[p.blog]) notFound();
  const articles = await getAllArticles(locale).catch(() => []);
  return (
    <BlogIndexView articles={articles} active={p.blog} locale={locale} dict={dict} />
  );
}
