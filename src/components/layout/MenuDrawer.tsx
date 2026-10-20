"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { shopifyImage } from "@/lib/format";
import { APP_STORE_URL, PLAY_STORE_URL, REGISTER_TEST_URL, SOCIAL_LINKS } from "@/lib/links";
import type { Collection } from "@/lib/shopify/types";
import { Burger } from "./Burger";

export type FeaturedTeaser = { handle: string; title: string; image: string | null; subtitle?: string | null };

/**
 * Full-screen menu that slides in from the left (opened by the burger in the header).
 * Left: the five primary destinations in large type and how to reach us.
 * Right: topics (collections), one featured test, follow links, legal, language.
 */
export function MenuDrawer({
  locale,
  dict,
  collections,
  featured,
}: {
  locale: Locale;
  dict: Dictionary;
  collections: Collection[];
  featured: FeaturedTeaser | null;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<{ path: string; open: boolean }>({ path: pathname, open: false });
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
  const other: Locale = locale === "de" ? "en" : "de";
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  const primary = [
    { label: dict.nav.shop, href: href("/collections") },
    { label: dict.nav.blog, href: href("/blog") },
    { label: dict.nav.about, href: href("/pages/uber-uns") },
    { label: dict.nav.faq, href: href("/pages/faqs") },
    { label: dict.nav.contact, href: href("/pages/kontakt") },
  ];

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

      <div id="menu-drawer" className={`fixed inset-0 overflow-hidden z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          type="button"
          tabIndex={-1}
          aria-label={dict.nav.close}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-moss/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          hidden
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.menu}
          className={`absolute inset-0 flex w-full flex-col overflow-y-auto bg-white transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top row: same grid and height as the header, so the "x" sits where the burger was */}
          <div className="mx-auto grid h-[72px] w-full max-w-7xl shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[88px] lg:px-8">
            <div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-lind"
                aria-label={dict.nav.close}
              >
                <Burger open={open} />
              </button>
            </div>
            <Link href={href("/")} className="flex items-center justify-center" aria-label={dict.meta.siteName}>
              <Image src="/brand/logo-green.svg" alt="" width={46} height={40} className="h-9 w-auto lg:h-10" />
            </Link>
            <span className="justify-self-end text-sm font-medium text-ink-muted">{dict.meta.siteName}</span>
          </div>
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-10 sm:px-8 lg:px-12">

            <div className="mt-8 grid flex-1 gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              {/* Left: primary destinations + contact */}
              <div className="flex flex-col justify-between gap-12">
                <nav aria-label={dict.nav.menu}>
                  <ul className="space-y-1">
                    {primary.map((item, i) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group inline-flex items-baseline gap-4 py-1.5 text-[2rem] font-semibold leading-none tracking-[-0.02em] text-ink transition-colors hover:text-green sm:text-[2.75rem] lg:text-[3.25rem]"
                        >
                          <span className="hidden text-sm font-medium tabular-nums text-ink-muted/70 sm:inline">0{i + 1}</span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <a href={REGISTER_TEST_URL} target="_blank" rel="noopener" className="btn btn-primary mt-8">
                    {dict.nav.registerTest}
                  </a>
                </nav>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{dict.menu.contact}</p>
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
              </div>

              {/* Right: topics, featured, follow, legal, language */}
              <div className="flex flex-col gap-10">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{dict.menu.topics}</p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-2">
                    {collections.map((c) => (
                      <li key={c.handle}>
                        <Link href={href(`/collections/${c.handle}`)} className="block py-1 text-[1.0625rem] leading-snug hover:text-green">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {featured && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{dict.menu.featured}</p>
                    <Link
                      href={href(`/products/${featured.handle}`)}
                      className="group relative mt-3 block aspect-[16/8] overflow-hidden rounded-[var(--radius-card)] bg-surface"
                    >
                      {featured.image && (
                        <Image
                          src={shopifyImage(featured.image, 1200)}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 640px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss/80 to-transparent p-5 pt-12 text-soft">
                        <span className="block text-xl font-semibold leading-tight">{featured.title}</span>
                        {featured.subtitle && <span className="mt-1 block text-sm text-soft/80">{featured.subtitle}</span>}
                      </span>
                    </Link>
                  </div>
                )}

                <div className="mt-auto grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{dict.menu.follow}</p>
                    <ul className="mt-3 space-y-1.5 text-[1.0625rem]">
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
                      <span className="sr-only">{other}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
