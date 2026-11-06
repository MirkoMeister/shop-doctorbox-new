import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import {
  LockIcon,
  RepeatIcon,
  TruckIcon,
  ClockIcon,
} from "@/components/ui/Icons";
import { SUBSCRIPTION_PAGE, subscriptionCopy } from "@/content/subscription";
import { fill } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/config";
import { SUBSCRIPTION_MANAGE_URL } from "@/lib/links";
import { resolveLocale } from "@/lib/locale-params";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";
import type { Locale } from "@/lib/i18n/config";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

/** Products with a subscription plan, live from Shopify, plus the largest discount among them */
async function subscriptionProducts(locale: Locale) {
  const products = (await getAllProducts(locale).catch(() => [])).filter(
    (p) => p.hasSubscription && p.availableForSale,
  );
  const pct =
    Math.round(
      Math.max(0, ...products.map((p) => p.subscriptionPercent ?? 0)),
    ) || 20;
  return { products, pct: String(pct) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = subscriptionCopy(locale);
  const { pct } = await subscriptionProducts(locale);
  return pageMetadata(locale, SUBSCRIPTION_PAGE, {
    title: t.metaTitle,
    description: fill(t.metaDescription, { pct }),
  });
}

const HERO_IMAGE =
  "https://cdn.shopify.com/s/files/1/0564/6991/3683/files/Sexuelle_Gesundheit_Kits_0cf42336-13da-4c0a-abac-16c0b97ceb93.png?v=1769442006";

const BENEFIT_ICONS = [RepeatIcon, TruckIcon, ClockIcon, LockIcon];

/** Subscription page: how it works, benefits, subscribable tests (live), FAQ. Replaces the imported Shopify page. */
export default async function SubscriptionPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = subscriptionCopy(locale);
  const { products, pct } = await subscriptionProducts(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <JsonLd data={faqJsonLd(t.faq)} />
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: localeHref(locale, "/") },
          { label: t.kicker },
        ]}
        className="mb-5"
      />

      <header className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-green">{t.kicker}</p>
          <h1 className="h1 mt-2 text-balance">
            <Highlight text={fill(t.title, { pct })} />
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{t.lead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#abo-tests" className="btn btn-primary">
              {t.ctaTests}
            </a>
            <a
              href={SUBSCRIPTION_MANAGE_URL}
              className="btn btn-secondary"
              rel="noopener"
            >
              {t.ctaManage}
            </a>
          </div>
        </div>
        {/* kit photo from the old Shopify subscription page */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-moss lg:aspect-square">
          <Image
            src={HERO_IMAGE}
            alt={t.heroAlt}
            fill
            priority
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      {/* a real sequence, so numbered */}
      <section className="mt-14" aria-labelledby="abo-steps">
        <h2 id="abo-steps" className="h2">
          {t.stepsTitle}
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {t.steps.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-surface p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-green text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="abo-benefits">
        <h2 id="abo-benefits" className="h2">
          {t.benefitsTitle}
        </h2>
        <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i];
            return (
              <li key={b.title} className="flex gap-3">
                <Icon
                  width={24}
                  height={24}
                  className="mt-0.5 shrink-0 text-green"
                />
                <div>
                  <h3 className="font-semibold">{fill(b.title, { pct })}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{b.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {products.length > 0 && (
        <section
          id="abo-tests"
          className="mt-16 scroll-mt-32"
          aria-labelledby="abo-tests-title"
        >
          <h2 id="abo-tests-title" className="h2">
            {t.testsTitle}
          </h2>
          <p className="mt-2 text-ink-muted">{t.testsText}</p>
          <div className="mt-6">
            <ProductGrid products={products} locale={locale} dict={dict} />
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="abo-faq">
        <h2 id="abo-faq" className="h2">
          {t.faqTitle}
        </h2>
        <Accordion
          className="mt-6"
          items={t.faq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))}
        />
        <p className="mt-6 text-ink-muted">
          {t.contact}{" "}
          <Link
            href={localeHref(locale, "/pages/kontakt")}
            className="font-medium text-ink underline underline-offset-2"
          >
            {t.contactLink}
          </Link>
        </p>
      </section>
    </div>
  );
}
