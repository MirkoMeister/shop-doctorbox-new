import { Fragment } from "react";

/**
 * Brand highlight: key words in a headline sit in a rounded pale-green blob.
 * Mark the words in copy with double brackets: "DoctorBox [[sorgt vor.]] Für deine Gesundheit."
 * `tone="dark"` is for headlines on moss backgrounds.
 * Punctuation right after a blob stays glued to it (the blob is an inline-block and
 * would otherwise leave a lone comma on the next line).
 */
export function Highlight({
  text,
  tone = "light",
}: {
  text: string;
  tone?: "light" | "dark";
}) {
  const parts = text.split(/(\[\[.*?\]\])/g).filter(Boolean);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const m = parts[i].match(/^\[\[(.*?)\]\]$/);
    if (!m) {
      nodes.push(<Fragment key={i}>{parts[i]}</Fragment>);
      continue;
    }
    const mark = (
      <mark key={`m${i}`} className={tone === "dark" ? "hl hl-dark" : "hl"}>
        {m[1]}
      </mark>
    );
    const next = parts[i + 1];
    const punct = next?.match(/^([,.;:!?…»")]+)/);
    if (punct) {
      nodes.push(
        <span key={i} className="whitespace-nowrap">
          {mark}
          {punct[1]}
        </span>,
      );
      parts[i + 1] = next.slice(punct[1].length);
    } else {
      nodes.push(mark);
    }
  }
  return <>{nodes}</>;
}

/** Plain text without the markers (for <title>, aria labels, JSON-LD). */
export function plain(text: string): string {
  return text.replace(/\[\[(.*?)\]\]/g, "$1");
}
