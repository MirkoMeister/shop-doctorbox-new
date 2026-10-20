import { ChevronDown } from "./Icons";

/** Native <details> accordion: accessible, no JS, animated via CSS grid trick. */
export function Accordion({
  items,
  className = "",
}: {
  items: { title: string; content: React.ReactNode; open?: boolean }[];
  className?: string;
}) {
  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item) => (
        <details key={item.title} className="group" open={item.open}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
            {item.title}
            <ChevronDown className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="pb-5 text-[0.98rem] leading-relaxed text-ink/90">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
