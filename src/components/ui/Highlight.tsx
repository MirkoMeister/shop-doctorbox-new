import { Fragment } from "react";

/**
 * Brand highlight: key words in a headline sit in a rounded pale-green box.
 * Mark the words in copy with double brackets: "DoctorBox [[sorgt vor.]] Für deine Gesundheit."
 * `tone="dark"` is for headlines on moss backgrounds.
 */
export function Highlight({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const parts = text.split(/(\[\[.*?\]\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[(.*?)\]\]$/);
        return m ? (
          <mark key={i} className={tone === "dark" ? "hl hl-dark" : "hl"}>
            {m[1]}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}

/** Plain text without the markers (for <title>, aria labels, JSON-LD). */
export function plain(text: string): string {
  return text.replace(/\[\[(.*?)\]\]/g, "$1");
}
