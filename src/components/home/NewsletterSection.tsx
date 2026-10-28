import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon } from "@/components/ui/Icons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Home newsletter block: what subscribers get, the sign-up, double opt-in note. */
export function NewsletterSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  if (!process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID) return null;
  const t = dict.home.newsletter;
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="newsletter-title">
      <div className="grid gap-8 rounded-[var(--radius-panel)] bg-soft p-6 sm:p-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
        <div>
          <p className="text-sm font-medium text-green">{t.kicker}</p>
          <h2 id="newsletter-title" className="h2 mt-2 text-balance">
            <Highlight text={t.title} />
          </h2>
          <p className="mt-3 max-w-xl text-lg text-ink-muted">{t.text}</p>
        </div>
        <div>
          <ul className="grid gap-2 text-[0.95rem]">
            {t.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-green" />
                {p}
              </li>
            ))}
          </ul>
          <NewsletterForm dict={dict} locale={locale} tone="light" source="Startseite" />
        </div>
      </div>
    </section>
  );
}
