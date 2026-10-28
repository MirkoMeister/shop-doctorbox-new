import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Analytics } from "@/components/analytics/Analytics";
import { AssistantProvider } from "@/components/assistant/AssistantProvider";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { AssistantTab } from "@/components/assistant/AssistantTab";
import { SUGGESTIONS } from "@/lib/assistant/prompt";
import { isLocale, locales, siteUrl, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCollection, getNavCollections, TOP_PICKS_COLLECTION } from "@/lib/shopify/queries";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const host = Host_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-host",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0E4D2F",
  width: "device-width",
  initialScale: 1,
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "de");
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.defaultTitle, template: `%s | DoctorBox` },
    description: dict.meta.defaultDescription,
    applicationName: dict.meta.siteName,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);
  const [collections, picks] = await Promise.all([
    getNavCollections(locale).catch(() => []),
    getCollection(TOP_PICKS_COLLECTION, locale).catch(() => null),
  ]);
  const top = picks?.products[0];
  const featured = top
    ? { handle: top.handle, title: top.title, image: top.featuredImage?.url ?? null, subtitle: top.targetGroup ?? null }
    : null;

  return (
    <html lang={locale} className={host.variable}>
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
        <CartProvider locale={locale}>
          <AssistantProvider locale={locale} dict={dict}>
          <Header locale={locale} dict={dict} collections={collections} featured={featured} />
          <main id="main" className="flex-1 pt-[72px] lg:pt-[88px]">
            {children}
          </main>
          <Footer locale={locale} dict={dict} collections={collections} />
          <CartDrawer locale={locale} dict={dict} />
          <AssistantPanel locale={locale} dict={dict} suggestions={SUGGESTIONS[locale]} />
          <AssistantTab label={dict.assistant.open} />
          </AssistantProvider>
        </CartProvider>
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
