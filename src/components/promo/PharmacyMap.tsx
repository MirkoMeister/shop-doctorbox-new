import { DE_MAP, DE_OUTLINE, PHARMACY_HEXES } from "@/content/preventure-map";

/** pointy-top hexagon around (x, y) */
function hexPoints(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 90) * Math.PI) / 180;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/** darker green the more partner pharmacies share a hexagon */
function shade(n: number) {
  if (n >= 6) return { fill: "#0b6b3d", text: "#f7f1e9" };
  if (n >= 4) return { fill: "#0e834b", text: "#f7f1e9" };
  if (n >= 3) return { fill: "#3d9c6c", text: "#f7f1e9" };
  if (n === 2) return { fill: "#7ec3a1", text: "#0a3a23" };
  return { fill: "#cbdfc6", text: "#0a3a23" };
}

/** Germany with hexagons for the partner pharmacies that take samples (data: src/content/preventure-map.ts). */
export function PharmacyMap({ className = "", label }: { className?: string; label: string }) {
  const r = DE_MAP.hexRadius;
  return (
    <svg viewBox={`-14 -14 ${DE_MAP.width + 28} ${DE_MAP.height + 28}`} className={className} role="img" aria-label={label}>
      <path d={DE_OUTLINE} fill="rgba(247,241,233,0.08)" stroke="rgba(247,241,233,0.45)" strokeWidth={1.5} strokeLinejoin="round" />
      {PHARMACY_HEXES.map(([x, y, n]) => {
        const c = shade(n);
        return (
          <g key={`${x}-${y}`}>
            <polygon points={hexPoints(x, y, r)} fill={c.fill} stroke="#0a3a23" strokeWidth={1} />
            {n > 1 && (
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.95} fontWeight={700} fill={c.text}>
                {n}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
