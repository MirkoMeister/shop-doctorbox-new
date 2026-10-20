import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatDate, shopifyImage, stripHtml, truncate } from "@/lib/format";
import type { Article, Collection } from "@/lib/shopify/types";
import { ArrowRight, LabIcon, PhoneIcon, PinIcon, ShieldIcon, SparkIcon } from "@/components/ui/Icons";
import { BLOG_TOPICS } from "@/lib/content/guides";
import { Highlight } from "@/components/ui/Highlight";

export function SectionHeading({
  title,
  text,
  action,
  as: Tag = "h2",
}: {
  title: string;
  text?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Tag className="h2 text-balance">
          <Highlight text={title} />
        </Tag>
        {text && <p className="mt-2 max-w-xl text-ink-muted">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-tertiary -ml-3 self-start sm:ml-0 sm:self-auto">
          {action.label} <ArrowRight width={16} height={16} />
        </Link>
      )}
    </div>
  );
}

/* Lind field with the thematic collections ------------------------------ */
export function CategoryField({
  collections,
  locale,
  dict,
}: {
  collections: Collection[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:-mt-14 sm:px-6 lg:px-8">
      <div className="rounded-[var(--radius-panel)] bg-lind p-6 text-moss shadow-float sm:p-10">
        <div className="max-w-2xl">
          <h2 className="h3">
            <Highlight text={dict.home.categoriesTitle} />
          </h2>
          <p className="mt-2 text-moss/80">{dict.home.categoriesText}</p>
        </div>
        <ul className="no-scrollbar -mx-6 mt-6 flex gap-2.5 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {collections.map((c) => (
            <li key={c.handle}>
              <Link
                href={localeHref(locale, `/collections/${c.handle}`)}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/70 px-4 py-2.5 text-[0.95rem] font-medium text-moss transition-colors hover:bg-white"
              >
                {c.image && (
                  <span className="relative -ml-1 h-7 w-7 overflow-hidden rounded-full bg-white">
                    <Image src={shopifyImage(c.image.url, 96)} alt="" fill sizes="28px" className="object-cover" />
                  </span>
                )}
                {c.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={localeHref(locale, "/collections")}
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-moss px-4 py-2.5 text-[0.95rem] font-medium text-soft hover:bg-moss-deep"
            >
              {dict.collection.all} <ArrowRight width={16} height={16} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* How it works: a real sequence, so numbers are appropriate --------------- */
export function HowItWorks({ dict, compact = false }: { dict: Dictionary; compact?: boolean }) {
  const icons = [PhoneIcon, SparkIcon, LabIcon, ShieldIcon];
  return (
    <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${compact ? "" : "mt-24"}`}>
      {!compact && <SectionHeading title={dict.home.howTitle} text={dict.home.howText} />}
      <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {dict.home.steps.map((s, i) => {
          const Icon = icons[i];
          return (
            <li key={s.title} className="relative flex gap-4 lg:block">
              <div className="flex shrink-0 items-center gap-3 lg:mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss text-soft">
                  <Icon width={20} height={20} />
                </span>
                <span className="hidden text-sm font-semibold text-green lg:inline">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">
                  <span className="mr-1.5 text-green lg:hidden">{i + 1}.</span>
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{s.text}</p>
              </div>
              {i < 3 && (
                <span aria-hidden className="absolute left-[5.4rem] right-0 top-[1.35rem] hidden h-px bg-line lg:block" />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* Trust band on moss ------------------------------------------------------ */
export function TrustBand({ dict }: { dict: Dictionary }) {
  const icons = [LabIcon, PinIcon, ShieldIcon, SparkIcon];
  return (
    <section className="mt-24 bg-moss text-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="h2 max-w-2xl text-balance">
          <Highlight text={dict.home.trustTitle} tone="dark" />
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {dict.home.trust.map((t, i) => {
            const Icon = icons[i];
            return (
              <li key={t.title}>
                <Icon width={26} height={26} className="text-turquoise" />
                <h3 className="mt-4 font-semibold">{t.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-soft/75">{t.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* Blog teasers ------------------------------------------------------------ */
export function ArticleCard({ article, locale, dict }: { article: Article; locale: Locale; dict: Dictionary }) {
  const href = localeHref(locale, `/ratgeber/${article.handle}`);
  const excerpt = article.excerpt ? stripHtml(article.excerpt) : truncate(stripHtml(article.contentHtml), 150);
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-lind">
        {article.image && (
          <Image
            src={shopifyImage(article.image.url, 800)}
            alt={article.image.altText ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-sm text-ink-muted">
          {BLOG_TOPICS[article.blog.handle]?.[locale] ?? article.blog.title} · {formatDate(article.publishedAt, locale)}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug">
          <Link href={href} className="hover:text-green">
            {article.title}
          </Link>
        </h3>
        {excerpt && <p className="mt-2 line-clamp-3 text-[0.95rem] text-ink-muted">{excerpt}</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green">
          {dict.blog.readMore} <ArrowRight width={14} height={14} />
        </span>
      </div>
    </article>
  );
}

export function BlogTeasers({ articles, locale, dict }: { articles: Article[]; locale: Locale; dict: Dictionary }) {
  if (!articles.length) return null;
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        title={dict.home.blogTitle}
        text={dict.home.blogText}
        action={{ label: dict.home.allArticles, href: localeHref(locale, "/ratgeber") }}
      />
      <ul className="grid gap-8 md:grid-cols-3">
        {articles.map((a) => (
          <li key={a.handle}>
            <ArticleCard article={a} locale={locale} dict={dict} />
          </li>
        ))}
      </ul>
    </section>
  );
}
