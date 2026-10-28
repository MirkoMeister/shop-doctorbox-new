"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ActiveCampaign } from "@/content/campaigns";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { shopifyImage } from "@/lib/format";
import { APP_STORE_URL, PLAY_STORE_URL, REGISTER_TEST_URL, SOCIAL_LINKS } from "@/lib/links";
import type { Collection } from "@/lib/shopify/types";
import { ArrowRight, SearchIcon } from "@/components/ui/Icons";
import { Burger } from "./Burger";

export type FeaturedTeaser = { handle: string; title: string; image: string | null; subtitle?: string | null };

/**
 * Full-screen menu (opened by the burger). Top: search. Left: the primary
 * pages in large type and the service links. Right: topics as image tiles and
 * the running campaign (or one featured test). Bottom: contact, follow, legal,
 * language.
 */
export function MenuDrawer({ locale, dict, collections, featured, campaign = null }: { locale: Locale; dict: Dictionary; collections: Collection[]; featured: FeaturedTeaser | null; campaign?: ActiveCampaign | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<{ path: string; open: boolean }>({ path: pathname, open: false });
  const [query, setQuery] = useState("");
  const open = state.path === pathname && state.open; // closes itself after navigation
  const setOpen = (v: boolean) => setState({ path: pathname, open: v });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setState((s) => ({ ...s, open: false }));
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (p: string) => localeHref(locale, p);
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const isActive = (p: string) => bare === p || (p !== "/" && bare.startsWith(p + "/"));

  const primary = [
    { label: dict.nav.shop, path: "/collections" },
    { label: "Supplements", path: "/collections/nahrungserganzungsmittel" },
    { label: dict.nav.guide, path: "/pages/ratgeber" },
    { label: dict.nav.blog, path: "/blog" },
    { label: dict.nav.about, path: "/pages/uber-uns" },
    { label: dict.nav.faq, path: "/pages/faqs" },
    { label: dict.nav.contact, path: "/pages/kontakt" },
  ];
  const service = [
    { label: dict.nav.tasso, path: "/pages/tasso" },
    { label: dict.nav.pharmacies, path: "/pages/apotheken" },
    { label: dict.nav.builder, path: "/pages/eigener-test" },
  ];
  const topics = collections.filter((c) => c.handle !== "nahrungserganzungsmittel");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`${href("/search")}?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  const label = "text-xs font-medium uppercase tracking-[0.18em] text-ink-muted";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.menu}
        aria-expanded={open}
        aria-controls="menu-drawer"
        className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lind group-data-[tone=dark]:text-soft group-data-[tone=dark]:hover:bg-white/10"
      >
        <Burger open={false} />
      </button>

      <div id="menu-drawer" className={`fixed inset-0 z-[80] overflow-hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.menu}
          className={`absolute inset-0 flex w-full flex-col overflow-y-auto bg-white pt-[var(--promo-h,0px)] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Top row: same grid and height as the header, so the "x" sits where the burger was */}
          <div className="mx-auto grid h-[72px] w-full max-w-7xl shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[88px] lg:px-8">
            <div>
              <button type="button" onClick={() => setOpen(false)} className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-lind" aria-label={dict.nav.close}>
                <Burger open={open} />
              </button>
            </div>
            <Link href={href("/")} className="flex items-center justify-center" aria-label={dict.meta.siteName} onClick={() => setOpen(false)}>
              <Image src="/brand/logo-green.svg" alt="" width={46} height={40} className="h-9 w-auto lg:h-10" />
            </Link>
            <a href={REGISTER_TEST_URL} target="_blank" rel="noopener" className="btn btn-primary btn-sm hidden justify-self-end md:inline-flex">
              {dict.nav.registerTest}
            </a>
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-10 sm:px-6 lg:px-8">
            {/* Search */}
            <form onSubmit={submitSearch} role="search" className="mt-2 lg:mt-4">
              <label className="sr-only" htmlFor="menu-search">
                {dict.menu.searchLabel}
              </label>
              <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-5 focus-within:border-green focus-within:bg-white">
                <SearchIcon width={20} height={20} className="shrink-0 text-green" />
                <input id="menu-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.hero.placeholder} enterKeyHint="search" autoComplete="off" className="h-10 min-w-0 flex-1 bg-transparent text-base placeholder:text-ink-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none" />
                <button type="submit" className="btn btn-primary !h-10 !px-4" aria-label={dict.search.submit}>
                  <SearchIcon width={18} height={18} />
                </button>
              </div>
            </form>

            <div className="mt-8 grid flex-1 gap-10 lg:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              {/* Left: primary pages + service */}
              <div className="flex flex-col gap-10">
                <nav aria-label={dict.nav.menu}>
                  <ul className="space-y-0.5">
                    {primary.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={href(item.path)}
                          aria-current={isActive(item.path) ? "page" : undefined}
                          className={`group inline-flex items-center gap-3 py-1 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] transition-colors hover:text-green sm:text-[2.25rem] lg:text-[2.5rem] ${isActive(item.path) ? "text-green" : "text-ink"}`}
                        >
                          {item.label}
                          <ArrowRight width={22} height={22} className="opacity-0 transition-opacity group-hover:opacity-100 group-aria-[current=page]:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div>
                  <p className={label}>{dict.menu.service}</p>
                  <ul className="mt-3 space-y-1.5 text-[1.0625rem]">
                    {service.map((s) => (
                      <li key={s.path}>
                        <Link href={href(s.path)} className="hover:text-green">
                          {s.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a href={REGISTER_TEST_URL} target="_blank" rel="noopener" className="hover:text-green">
                        {dict.nav.registerTest}
                      </a>
                    </li>
                    <li>
                      <a href={REGISTER_TEST_URL} target="_blank" rel="noopener" className="hover:text-green">
                        {dict.nav.results}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: topics as tiles + campaign or featured test */}
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className={label}>{dict.menu.topics}</p>
                    <Link href={href("/collections")} className="text-sm font-medium text-green hover:underline">
                      {dict.menu.allTopics}
                    </Link>
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {topics.map((c) => (
                      <li key={c.handle}>
                        <Link href={href(`/collections/${c.handle}`)} className="group flex h-full items-center gap-3 rounded-2xl bg-surface p-2 pr-3 transition-colors hover:bg-lind/60">
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">
                            {c.image && <Image src={shopifyImage(c.image.url, 120)} alt="" fill sizes="44px" className="object-cover" />}
                          </span>
                          <span className="min-w-0 text-[0.95rem] font-medium leading-snug">{c.title}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={href("/collections/nahrungserganzungsmittel")} className="group flex h-full items-center gap-3 rounded-2xl bg-surface p-2 pr-3 transition-colors hover:bg-lind/60">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">
                          {collections.find((c) => c.handle === "nahrungserganzungsmittel")?.image && (
                            <Image src={shopifyImage(collections.find((c) => c.handle === "nahrungserganzungsmittel")!.image!.url, 120)} alt="" fill sizes="44px" className="object-cover" />
                          )}
                        </span>
                        <span className="min-w-0 text-[0.95rem] font-medium leading-snug">Supplements</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                {campaign ? (
                  <Link href={href(campaign.page)} className="group relative block overflow-hidden rounded-[var(--radius-card)] bg-moss-deep p-5 text-soft sm:p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-okker">{dict.menu.campaign}</p>
                    <p className="mt-2 max-w-md text-lg font-semibold leading-snug">{campaign.bar}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-okker px-2.5 py-0.5 text-xs font-semibold tracking-[0.08em] text-moss">{campaign.code}</span>
                      <span className="inline-flex items-center gap-1 font-medium underline-offset-4 group-hover:underline">
                        {campaign.barCta} <ArrowRight width={16} height={16} />
                      </span>
                    </p>
                  </Link>
                ) : (
                  featured && (
                    <div>
                      <p className={label}>{dict.menu.featured}</p>
                      <Link href={href(`/products/${featured.handle}`)} className="group relative mt-3 block aspect-[16/7] overflow-hidden rounded-[var(--radius-card)] bg-surface">
                        {featured.image && <Image src={shopifyImage(featured.image, 1200)} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss/80 to-transparent p-5 pt-12 text-soft">
                          <span className="block text-xl font-semibold leading-tight">{featured.title}</span>
                          {featured.subtitle && <span className="mt-1 block text-sm text-soft/80">{featured.subtitle}</span>}
                        </span>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bottom row: contact, follow, legal, language */}
            <div className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3 lg:mt-14">
              <div>
                <p className={label}>{dict.menu.contact}</p>
                <ul className="mt-3 space-y-1.5 text-[1.0625rem]">
                  <li>
                    <a href="mailto:heimtest@doctorbox.eu" className="hover:text-green">
                      heimtest@doctorbox.eu
                    </a>
                  </li>
                  <li>
                    <a href="tel:+493034045468" className="hover:text-green">
                      +49 30 34045468
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className={label}>{dict.menu.follow}</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[1.0625rem]">
                  {SOCIAL_LINKS.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener" className="hover:text-green">
                        {s.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={APP_STORE_URL} target="_blank" rel="noopener" className="hover:text-green">
                      App Store
                    </a>
                  </li>
                  <li>
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="hover:text-green">
                      Google Play
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 text-sm sm:items-end">
                <p className="flex flex-wrap gap-x-2 text-ink-muted">
                  <Link href={href("/policies/privacy-policy")} className="hover:text-ink">
                    {dict.footer.privacy}
                  </Link>
                  <span aria-hidden>|</span>
                  <a href="#iubenda-cs-preferences" className="iubenda-cs-preferences-link hover:text-ink">
                    {dict.footer.cookies}
                  </a>
                </p>
                <p className="text-sm uppercase tracking-[0.18em]">
                  <Link href={localeHref("de", bare)} hrefLang="de" className={locale === "de" ? "font-semibold text-ink" : "text-ink-muted hover:text-ink"}>
                    DE
                  </Link>
                  <span className="mx-2 text-ink-muted">/</span>
                  <Link href={localeHref("en", bare)} hrefLang="en" className={locale === "en" ? "font-semibold text-ink" : "text-ink-muted hover:text-ink"}>
                    EN
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
