/** A moustache, the Movember mark, drawn as one stroke. */
export function Moustache({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M100 38c-8-14-20-20-34-16-14 4-20 16-34 14-9-1-17-7-26-14 6 18 22 32 44 32 20 0 34-10 50-24 16 14 30 24 50 24 22 0 38-14 44-32-9 7-17 13-26 14-14 2-20-10-34-14-14-4-26 2-34 16Z" />
    </svg>
  );
}
