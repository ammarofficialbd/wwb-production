"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Eye, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { getPosts } from "@/app/actions/blog";

interface PopularPost {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  views: number;
  readTime: string;
  image: string;
  date: string;
}

// Category → accent color map
const CATEGORY_COLORS: Record<string, string> = {
  Finance:       "bg-emerald-600 text-white",
  "Investing & Stock Market": "bg-amber-500 text-white",
  Crypto:        "bg-orange-500 text-white",
  AI:            "bg-indigo-500 text-white",
  "Real Estate": "bg-blue-600 text-white",
  Privacy:       "bg-teal-600 text-white",
  General:       "bg-gray-700 text-white",
};

function initials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<PopularPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const raw = await getPosts();
        const mapped: PopularPost[] = raw.map((p: any) => {
          const categoryName =
            typeof p.category === "object" && p.category?.name
              ? p.category.name
              : typeof p.category === "string"
              ? p.category
              : "General";

          return {
            id: p.id,
            title: p.title || "Untitled",
            slug: p.slug || "",
            category: categoryName,
            views: typeof p.views === "number" ? p.views : 0,
            readTime: p.read_time || p.readTime || "5 min",
            image:
              p.main_image ||
              p.image ||
              p.coverImage ||
              "",
            date: new Date(
              p.last_updated ||
              p.lastUpdated ||
              p.published_at ||
              p.created_at ||
              Date.now()
            ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        });

        // Sort by views descending → most popular first
        mapped.sort((a, b) => b.views - a.views);
        setPosts(mapped);
      } catch (e) {
        console.error("PopularPosts fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatViews = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp size={15} className="text-orange-500" />
          Popular Posts
        </h2>
        <span className="flex items-center gap-1 bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold px-3 py-1.5 rounded-xl">
          <Eye size={11} /> Most Viewed
        </span>
      </div>

      {/* Column labels */}
      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-b border-gray-50 pb-2 uppercase tracking-wider">
        <span>Post</span>
        <span>Views</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          // Skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-32 bg-gray-100 rounded" />
                  <div className="h-2 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-2.5 w-10 bg-gray-100 rounded" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No posts found.</p>
        ) : (
          posts.map((post) => {
            const colorClass = CATEGORY_COLORS[post.category] ?? "bg-gray-700 text-white";
            return (
              <a
                key={post.id}
                href={post.slug ? `/my-feed/${post.slug}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center group cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail or initials */}
                  {post.image ? (
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${colorClass}`}
                    >
                      {initials(post.title)}
                    </div>
                  )}

                  {/* Text */}
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-black transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                        {post.category}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-0.5">
                        <Clock size={8} /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Views + link icon */}
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-extrabold text-gray-800 flex items-center gap-1 justify-end">
                    <Eye size={10} className="text-gray-400" />
                    {formatViews(post.views)}
                  </div>
                  <div className="text-[9px] font-bold mt-0.5 text-gray-400 flex items-center gap-0.5 justify-end">
                    <ExternalLink size={8} /> Read
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}



