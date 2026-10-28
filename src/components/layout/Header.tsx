import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { REGISTER_TEST_URL } from "@/lib/links";
import type { Collection } from "@/lib/shopify/types";
import { CartButton } from "./CartButton";
import { HeaderShell } from "./HeaderShell";
import { LangSwitch } from "./LangSwitch";
import { MenuDrawer, type FeaturedTeaser } from "./MenuDrawer";
import { SearchIcon } from "@/components/ui/Icons";
import { HeaderSearch } from "@/components/search/HeaderSearch";
import { AssistantHeaderButton } from "@/components/assistant/AssistantButtons";

/** Shared look for the round icon buttons: dark ink normally, cream on the home hero. */
export const headerIconClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lind group-data-[tone=dark]:text-soft group-data-[tone=dark]:hover:bg-white/10";

/**
 * Header: burger (menu drawer) left, logo centred, search / assistant / language / register / cart right.
 * Transparent overlay that scrolls away with the page; see HeaderShell.
 */
export function Header({
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
  const href = (p: string) => localeHref(locale, p);

  return (
    <HeaderShell>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-green focus:px-4 focus:py-2 focus:text-white"
      >
        {dict.nav.skipToContent}
      </a>
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[88px] lg:px-8">
        <div className="flex items-center gap-1">
          <MenuDrawer locale={locale} dict={dict} collections={collections} featured={featured} />
        </div>

        <Link href={href("/")} className="flex items-center justify-center" aria-label={dict.meta.siteName}>
          <Image src="/brand/logo-green.svg" alt="" width={46} height={40} priority className="h-9 w-auto group-data-[tone=dark]:hidden lg:h-10" />
          <Image src="/brand/logo-white.svg" alt="" width={46} height={40} className="hidden h-9 w-auto group-data-[tone=dark]:block lg:h-10" />
          <span className="sr-only">DoctorBox</span>
        </Link>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <HeaderSearch locale={locale} dict={dict} collections={collections}>
            <span className={headerIconClass}>
              <SearchIcon width={22} height={22} />
            </span>
          </HeaderSearch>
          <AssistantHeaderButton label={dict.assistant.open} />
          <a
            href={REGISTER_TEST_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-primary btn-sm hidden group-data-[tone=dark]:bg-soft group-data-[tone=dark]:text-moss group-data-[tone=dark]:hover:bg-white md:inline-flex"
          >
            {dict.nav.registerTest}
          </a>
          <LangSwitch locale={locale} label={dict.nav.language} />
          <CartButton label={dict.nav.cart} />
        </div>
      </div>
    </HeaderShell>
  );
}
