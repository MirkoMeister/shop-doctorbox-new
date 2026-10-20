export function BiomarkerChips({
  values,
  max,
  className = "",
  size = "md",
}: {
  values: string[];
  max?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  if (!values.length) return null;
  const shown = max ? values.slice(0, max) : values;
  const rest = values.length - shown.length;
  const sizeCls = size === "sm" ? "!px-2.5 !py-1 !text-[0.8125rem]" : "";
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {shown.map((v) => (
        <li key={v} className={`chip ${sizeCls}`}>
          {v}
        </li>
      ))}
      {rest > 0 && <li className={`chip chip-outline ${sizeCls}`}>+{rest}</li>}
    </ul>
  );
}

export function Chip({
  children,
  variant = "lind",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "lind" | "outline" | "soft" | "okker" | "moss";
  className?: string;
}) {
  const cls = {
    lind: "chip",
    outline: "chip chip-outline",
    soft: "chip chip-soft",
    okker: "chip !bg-okker !text-moss",
    moss: "chip !bg-moss !text-soft",
  }[variant];
  return <span className={`${cls} ${className}`}>{children}</span>;
}
