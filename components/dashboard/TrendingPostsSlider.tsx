"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrendingPost {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  readTime: string;
  views: string;
  image: string;
  href?: string;
}

// ─── Trending posts data ──────────────────────────────────────────────────────
const TRENDING_POSTS: TrendingPost[] = [
  {
    id: 1,
    title: "How AI is Reshaping the Future of B2B Finance",
    category: "AI",
    categoryColor: "#6366f1",
    readTime: "8 min",
    views: "18.4K",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop",
    href: "#",
  },
  {
    id: 2,
    title: "Top 5 Investment Strategies for Bear Markets in 2025",
    category: "Investment",
    categoryColor: "#f59e0b",
    readTime: "6 min",
    views: "12.1K",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop",
    href: "#",
  },
  {
    id: 3,
    title: "GDPR Compliance: What Every Business Must Know",
    category: "Privacy",
    categoryColor: "#10b981",
    readTime: "10 min",
    views: "9.8K",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&h=340&fit=crop",
    href: "#",
  },
  {
    id: 4,
    title: "Bitcoin ETFs and the New Era of Digital Assets",
    category: "Crypto",
    categoryColor: "#f97316",
    readTime: "7 min",
    views: "7.3K",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=340&fit=crop",
    href: "#",
  },
  {
    id: 5,
    title: "Real Estate REITs: A Complete 2025 Guide",
    category: "Real Estate",
    categoryColor: "#3b82f6",
    readTime: "9 min",
    views: "5.2K",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=340&fit=crop",
    href: "#",
  },
];

const SLIDE_INTERVAL = 4000;

// ─── Component ────────────────────────────────────────────────────────────────
export default function TrendingPostsSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Drag state
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);

  const total = TRENDING_POSTS.length;

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((idx + total) % total);
        setIsAnimating(false);
      }, 350);
    },
    [isAnimating, total]
  );

  const next = useCallback(() => goTo(current + 1, "next"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "prev"), [current, goTo]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // ── Drag handlers ────────────────────────────────────────────────────────
  const onDragStart = (clientX: number) => {
    dragStartX.current = clientX;
    dragDelta.current = 0;
    isDragging.current = false;
    setIsPaused(true);
  };

  const onDragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    dragDelta.current = clientX - dragStartX.current;
    if (Math.abs(dragDelta.current) > 5) isDragging.current = true;
  };

  const onDragEnd = () => {
    if (isDragging.current) {
      if (dragDelta.current < -50) next();
      else if (dragDelta.current > 50) prev();
    }
    dragStartX.current = null;
    dragDelta.current = 0;
    isDragging.current = false;
    setIsPaused(false);
  };

  const post = TRENDING_POSTS[current];

  return (
    <div
      className="relative w-full rounded-[24px] overflow-hidden select-none"
      style={{ minHeight: "130px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Mouse drag
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={(e) => { onDragEnd(); setIsPaused(false); }}
      // Touch drag
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={onDragEnd}
    >
      {/* ── Slide ─────────────────────────────────────────────────────────── */}
      <a
        href={post.href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => isDragging.current && e.preventDefault()}
        className="block"
        draggable={false}
      >
        <div
          className="relative w-full overflow-hidden rounded-[24px] cursor-grab active:cursor-grabbing"
          style={{ height: "130px" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url(${post.image})`,
              transform: isAnimating
                ? `translateX(${direction === "next" ? "-6%" : "6%"})`
                : "translateX(0%)",
              opacity: isAnimating ? 0 : 1,
              transition: "transform 350ms cubic-bezier(0.4,0,0.2,1), opacity 350ms ease",
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-[24px]" />

          {/* Content */}
          <div
            className="absolute inset-0 flex flex-col justify-between p-4 rounded-[24px]"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating
                ? `translateY(${direction === "next" ? "8px" : "-8px"})`
                : "translateY(0px)",
              transition: "opacity 300ms ease, transform 300ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: post.categoryColor + "cc" }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-white/80 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                <TrendingUp size={10} />
                Trending
              </span>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2 drop-shadow-sm">
                {post.title}
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-white/70 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {post.readTime} read
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {post.views} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* ── Dot indicators ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
        {TRENDING_POSTS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? "next" : "prev"); }}
            className="pointer-events-auto"
            aria-label={`Go to post ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === current ? "20px" : "6px",
                height: "4px",
                background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Prev / Next arrows (visible on hover) ────────────────────────── */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
        aria-label="Previous"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
        aria-label="Next"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
