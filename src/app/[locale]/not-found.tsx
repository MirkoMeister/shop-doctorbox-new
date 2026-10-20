import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { Highlight } from "@/components/ui/Highlight";

export default async function NotFound() {
  // The locale segment is not available in not-found; infer from the URL
  const h = await headers();
  const url = h.get("x-invoke-path") ?? h.get("referer") ?? "";
  const locale: Locale = /\/en(\/|$)/.test(url) ? "en" : "de";
  const dict = getDictionary(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-green">404</p>
      <h1 className="h1 mt-2">
        <Highlight text={dict.notFound.title} />
      </h1>
      <p className="mt-4 text-lg text-ink-muted">{dict.notFound.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={localeHref(locale, "/collections")} className="btn btn-primary">
          {dict.collection.all}
        </Link>
        <Link href={localeHref(locale, "/")} className="btn btn-secondary">
          {dict.notFound.home}
        </Link>
      </div>
    </div>
  );
}
