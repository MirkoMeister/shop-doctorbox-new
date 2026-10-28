import { Rating } from "@/components/ui/Rating";
import { CheckIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductReview } from "@/lib/reviews/etrusted";

const SHOWN = 3;

/** Verified Trusted Shops product reviews: summary with distribution, then the best-rated reviews first (newest within a rating); the rest behind "more". */
export function ProductReviews({ reviews, locale, dict }: { reviews: ProductReview[]; locale: Locale; dict: Dictionary }) {
  if (!reviews.length) return null;
  const t = dict.product.reviewsBlock;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, n: reviews.filter((r) => Math.round(r.rating) === star).length }));
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating || b.submittedAt.localeCompare(a.submittedAt));
  const shown = sorted.slice(0, SHOWN);
  const rest = sorted.slice(SHOWN);

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="reviews-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <h2 id="reviews-title" className="h2">{t.title}</h2>
          <p className="mt-2 text-ink-muted">{t.source}</p>
          <div className="mt-6 flex items-end gap-4">
            <span className="text-5xl font-semibold tabular-nums leading-none text-moss">{avg.toLocaleString(locale === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 })}</span>
            <div className="pb-1">
              <Rating value={avg} count={reviews.length} dict={dict} compact />
              <p className="mt-1 text-sm text-ink-muted">{reviews.length === 1 ? dict.product.review : fill(t.count, { n: reviews.length })}</p>
            </div>
          </div>
          <ol className="mt-6 grid gap-1.5">
            {dist.map(({ star, n }) => (
              <li key={star} className="flex items-center gap-3 text-sm tabular-nums">
                <span className="w-4 text-right text-ink-muted">{star}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-okker" style={{ width: `${(n / reviews.length) * 100}%` }} />
                </span>
                <span className="w-8 text-right text-ink-muted">{n}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-2 text-xs text-ink-muted">{t.sortNote}</p>
          <ul className="divide-y divide-line/70">
            {shown.map((r) => (
              <li key={r.id} className="py-6 first:pt-0">
                <ReviewItem r={r} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
          {rest.length > 0 && (
            <details className="group mt-2">
              <summary className="btn btn-secondary cursor-pointer list-none [&::-webkit-details-marker]:hidden">{fill(t.more, { n: rest.length })}</summary>
              <ul className="mt-2 divide-y divide-line/70 border-t border-line/70">
                {rest.map((r) => (
                  <li key={r.id} className="py-6">
                    <ReviewItem r={r} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ r, locale, dict }: { r: ProductReview; locale: Locale; dict: Dictionary }) {
  const t = dict.product.reviewsBlock;
  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="stars" style={{ ["--pct" as string]: `${(r.rating / 5) * 100}%` }} aria-label={`${r.rating} / 5`} role="img" />
        <span className="text-sm font-medium">{r.author ?? t.anonymous}</span>
        {r.verified && (
          <span className="inline-flex items-center gap-1 text-xs text-green">
            <CheckIcon width={12} height={12} /> {t.verified}
          </span>
        )}
        <time dateTime={r.submittedAt} className="ml-auto text-xs text-ink-muted">
          {formatDate(r.submittedAt, locale)}
        </time>
      </div>
      {r.title && <p className="mt-2 font-semibold leading-snug">{r.title}</p>}
      {r.comment && <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink/85">{r.comment}</p>}
      {r.reply && (
        <p className="mt-3 rounded-2xl bg-soft px-4 py-3 text-sm leading-relaxed text-ink/80">
          <span className="font-semibold text-moss">{t.reply} </span>
          {r.reply}
        </p>
      )}
    </article>
  );
}
