"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdItem {
  src: string;    // e.g. "/ads(invetsing.com).gif"
  alt?: string;
  href?: string;  // optional click-through link
}

export type AdLayout = "banner" | "card" | "square";

interface OptimizeBudgetTipsProps {
  /** Array of ad images / GIFs to rotate through */
  ads?: AdItem[];
  /** Visual layout preset */
  layout?: AdLayout;
  /** Custom height — Tailwind class (e.g. "h-[200px]") or pixel number (e.g. 200) */
  height?: string | number;
  /** Custom width — Tailwind class (e.g. "w-full") or pixel number (e.g. 320) */
  width?: string | number;
  /** Auto-rotate interval in ms. Set 0 to disable. Default: 5000 */
  rotateInterval?: number;
  /** Extra className for the outer wrapper */
  className?: string;
}

// ─── Default ads (all files in /public) ──────────────────────────────────────
const DEFAULT_ADS: AdItem[] = [
  {
    src: "/ads(invetsing.com).gif",
    alt: "Investing Challenges",
    href: "https://affiliates.investingchallenges.com/Tracking/click/?affid=2276&campaign=1326&product_id=2&t_type=Sub Affiliate&t_lang=EN",
  },
  { src: "/ads.png",  alt: "WWB Advertisement" },
  { src: "/ads1.png", alt: "WWB Advertisement" },
];

// ─── Layout height presets ────────────────────────────────────────────────────
const LAYOUT_HEIGHT: Record<AdLayout, string> = {
  banner: "h-[130px]",
  card:   "h-[280px]",
  square: "h-[200px]",
};

// ─── Helper: resolve string|number → className + optional inline style ────────
function resolveDim(
  value: string | number | undefined,
  fallback: string
): { cls: string; style?: React.CSSProperties } {
  if (value === undefined) return { cls: fallback };
  if (typeof value === "number") return { cls: "", style: { height: value, width: value } };
  return { cls: value };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OptimizeBudgetTips({
  ads = DEFAULT_ADS,
  layout = "banner",
  height,
  width,
  rotateInterval = 5000,
  className = "",
}: OptimizeBudgetTipsProps) {
  const [current, setCurrent] = useState(0);

  // Auto-rotate
  useEffect(() => {
    if (ads.length <= 1 || rotateInterval === 0) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % ads.length),
      rotateInterval
    );
    return () => clearInterval(timer);
  }, [ads.length, rotateInterval]);

  const ad = ads[current];

  // Dimension resolution
  const hRes = resolveDim(height, LAYOUT_HEIGHT[layout]);
  const wRes = resolveDim(width, "w-full");
  const inlineStyle: React.CSSProperties = { ...hRes.style, ...wRes.style };

  const wrapperClass = [
    "relative overflow-hidden rounded-[20px] border border-gray-100/80",
    "shadow-[0_2px_16px_rgba(0,0,0,0.04)] group cursor-pointer",
    hRes.cls,
    wRes.cls,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imgEl = (
    <img
      src={ad.src}
      alt={ad.alt ?? "Advertisement"}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );

  return (
    <div
      className={wrapperClass}
      style={Object.keys(inlineStyle).length ? inlineStyle : undefined}
    >
      {/* Ad image — wrapped in <a> if href exists */}
      {ad.href ? (
        <a
          href={ad.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {imgEl}
        </a>
      ) : (
        imgEl
      )}

      {/* Dot navigation — only when multiple ads */}
      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setCurrent(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white scale-125 shadow"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ad ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
