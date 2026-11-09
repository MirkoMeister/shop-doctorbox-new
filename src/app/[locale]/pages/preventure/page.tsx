import type { Metadata, Viewport } from "next";
import { PreventureKiosk, type KioskSet } from "@/components/promo/PreventureKiosk";
import { movemberActive } from "@/content/movember";
import { PREVENTURE, preventureCopy } from "@/content/preventure";
import { resolveLocale } from "@/lib/locale-params";
import { getAllProducts, getNavCollections } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

/** Stand slideshow: not indexed, not linked; its own manifest makes it installable as a fullscreen app. */
export const metadata: Metadata = {
  title: preventureCopy.metaTitle,
  robots: { index: false, follow: false },
  manifest: "/preventure.webmanifest",
  appleWebApp: { capable: true, title: "DoctorBox", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#0e4d2f" };

export default async function PreventurePage({ params }: Props) {
  const { locale } = await resolveLocale(params);
  const [all, collections] = await Promise.all([getAllProducts(locale).catch(() => []), getNavCollections(locale).catch(() => [])]);
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  const sets: KioskSet[] = PREVENTURE.sets
    .map((h) => byHandle.get(h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.availableForSale))
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      image: p.featuredImage?.url ?? null,
      values: p.biomarkers.length,
      sample: p.sampleMaterial,
      price: p.priceRange.minVariantPrice,
    }));
  // same photo as the Movember page hero
  const movember = movemberActive() ? { image: collections.find((c) => c.handle === "mannergesundheit")?.image?.url ?? null } : null;
  return <PreventureKiosk sets={sets} movember={movember} />;
}
