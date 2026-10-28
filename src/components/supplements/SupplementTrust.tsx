import type { Locale } from "@/lib/i18n/config";

type IconProps = React.SVGProps<SVGSVGElement>;
const base = (p: IconProps) => ({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

const PersonIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="20" cy="13" r="6" />
    <path d="M8 34c1.5-7 6-11 12-11s10.5 4 12 11" />
  </svg>
);
const FlaskIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 5h10M17 5v10L9 30a3 3 0 0 0 2.6 4.5h12.3" />
    <path d="M23 5v10l2.5 4.5" />
    <path d="M30 23v8M26 27h8" />
  </svg>
);
const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M33 7c-14 0-23 7-23 18 0 3 1 5 2 7 7 1 21-3 21-25Z" />
    <path d="M8 34c4-9 10-14 18-18" />
  </svg>
);
const DoctorIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="20" cy="11" r="5.5" />
    <path d="M8 34c1-7 5-11 12-11s11 4 12 11" />
    <path d="M26 24v8M22 28h8" />
  </svg>
);
const HandshakeIcon = (p: IconProps) => (
  <svg {...base(p)} viewBox="0 0 24 24" strokeWidth={1.1}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
);
const NoGmoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 6c0 8 10 8 10 16M22 6c0 8-10 8-10 16M13 9h8M13 19h8M12 22c0 6 6 7 8 10" />
    <rect x="25" y="25" width="9" height="9" rx="1.5" />
    <path d="M29.5 22v3M29.5 34v3M22 29.5h3M34 29.5h3" />
  </svg>
);

const ITEMS = [
  { Icon: PersonIcon, de: "100 % kundenorientiert", en: "100% customer-focused" },
  { Icon: FlaskIcon, de: "Zertifiziert in unabhängigen Laboren", en: "Certified in independent laboratories" },
  { Icon: LeafIcon, de: "Vegan", en: "Vegan" },
  { Icon: DoctorIcon, de: "Entwickelt von Ärzten", en: "Developed by physicians" },
  { Icon: HandshakeIcon, de: "Herstellung mit Verantwortung", en: "Responsible manufacturing" },
  { Icon: NoGmoIcon, de: "Frei von Gentechnik", en: "Free from genetic engineering" },
];

/** Brand promises of the Youngle range, shown on their product pages instead of the test marquee. */
export function SupplementTrust({ locale }: { locale: Locale }) {
  return (
    <section className="mt-10 bg-surface py-10" aria-label={locale === "en" ? "Brand promises" : "Markenversprechen"}>
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
        {ITEMS.map(({ Icon, de, en }) => (
          <li key={de} className="flex flex-col items-center gap-3">
            <Icon className="text-green" />
            <span className="max-w-[11rem] text-[0.95rem] font-medium leading-snug text-ink">{locale === "en" ? en : de}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const isYoungle = (vendor: string) => /youngle/i.test(vendor);
