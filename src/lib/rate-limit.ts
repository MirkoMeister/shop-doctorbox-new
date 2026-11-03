import "server-only";

/**
 * In-memory sliding-window limits. They live per container (Scalingo runs one process per container),
 * which is enough to stop one visitor or one script; a hard spending cap belongs with the provider.
 */
export function rateLimiter({ windowMs, perKey, global = Infinity }: { windowMs: number; perKey: number; global?: number }) {
  const MAX_TRACKED = 10_000;
  const hits = new Map<string, number[]>();
  let globalHits: number[] = [];

  /** Records the attempt and returns true when it is over a limit (rejected attempts are not counted) */
  return function limited(key: string): boolean {
    const now = Date.now();
    const fresh = (ts: number[]) => ts.filter((t) => now - t < windowMs);
    globalHits = fresh(globalHits);
    if (globalHits.length >= global) return true;
    const arr = fresh(hits.get(key) ?? []);
    const over = arr.length >= perKey;
    if (!over) {
      arr.push(now);
      globalHits.push(now);
    }
    // re-insert so the map stays ordered by last activity; a client that keeps trying stays at the end
    hits.delete(key);
    hits.set(key, arr);
    if (over) return true;
    if (hits.size > MAX_TRACKED) {
      // drop expired keys, then the least recently active ones; never reset everyone's count
      for (const [k, ts] of hits) if (!fresh(ts).length) hits.delete(k);
      for (const k of hits.keys()) {
        if (hits.size <= MAX_TRACKED) break;
        hits.delete(k);
      }
    }
    return false;
  };
}

/**
 * Client address as seen by the Scalingo router. The router adds its own entry to X-Forwarded-For,
 * so the last entry is the one it saw; earlier entries come from the client and can be forged.
 */
export function clientIp(headers: { get(name: string): string | null }): string | null {
  const chain = headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return chain?.[chain.length - 1] ?? null;
}
