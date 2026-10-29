"use client";

import Link from "next/link";
import { usePublicPathname } from "@/lib/i18n/use-public-pathname";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { Highlight } from "@/components/ui/Highlight";

type Copy = { title: string; text: string; home: string; all: string };

/**
 * The locale segment is not passed to not-found, and reading request headers there
 * would make every route under [locale] dynamic. The URL is known on the client.
 */
export function NotFoundView({ copy }: { copy: Record<Locale, Copy> }) {
  const pathname = usePublicPathname();
  const locale: Locale = /^\/en(\/|$)/.test(pathname) ? "en" : "de";
  const t = copy[locale];
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-green">404</p>
      <h1 className="h1 mt-2">
        <Highlight text={t.title} />
      </h1>
      <p className="mt-4 text-lg text-ink-muted">{t.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={localeHref(locale, "/collections")} className="btn btn-primary">
          {t.all}
        </Link>
        <Link href={localeHref(locale, "/")} className="btn btn-secondary">
          {t.home}
        </Link>
      </div>
    </div>
  );
}
