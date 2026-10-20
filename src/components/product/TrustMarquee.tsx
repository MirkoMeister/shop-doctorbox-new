import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ClockIcon, LabIcon, PhoneIcon, PinIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

const ICONS = [LabIcon, TruckIcon, PhoneIcon, ShieldIcon, ClockIcon, PinIcon];

/**
 * Key features as a slow, full-width marquee under the product images.
 * Pure CSS animation; pauses on hover and stands still with reduced motion.
 */
export function TrustMarquee({ dict }: { dict: Dictionary }) {
  const items = dict.product.trust;
  const row = (ariaHidden: boolean) => (
    <ul className="marquee-track flex shrink-0 items-center gap-10 pr-10" aria-hidden={ariaHidden}>
      {items.map((text, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <li key={text} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[0.95rem] font-medium">
            <Icon width={20} height={20} className="shrink-0 text-green" />
            {text}
          </li>
        );
      })}
    </ul>
  );
  return (
    <section className="marquee relative mt-10 overflow-hidden border-y border-line/60 bg-surface py-4" aria-label={dict.product.keyFeatures}>
      <div className="marquee-inner flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
