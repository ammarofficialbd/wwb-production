"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";
import { getPosts } from "@/app/actions/blog";


/* --- Types --- */
interface BlogPost {
  id: number;
  image: string;
  tags: string[];
  category: string;
  date: string;
  title: string;
  desc: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
}

/* --- Categories --- */
const CATEGORIES = [
  "All",
  "Finance",
  "Investment",
  "Tax & Legal",
  "Healthcare",
  "Data Privacy",
  "Real Estate",
  "Digital Assets",
  "Artificial Intelligence",
];

/* --- Skeleton Card --- */
function BlogCardSkeleton() {
  return (
    <div className="blog-skeleton-card">
      <div className="blog-skeleton-image" />
      <div className="blog-skeleton-body">
        <div className="blog-skeleton-line blog-skeleton-line--short" />
        <div className="blog-skeleton-line blog-skeleton-line--title" />
        <div className="blog-skeleton-line blog-skeleton-line--title blog-skeleton-line--title-2" />
        <div className="blog-skeleton-line" />
        <div className="blog-skeleton-line blog-skeleton-line--desc" />
        <div className="blog-skeleton-actions">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="blog-skeleton-action-btn" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Single Blog Post Card --- */
function BlogCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(
    post.likes ?? Math.floor(Math.random() * 120) + 10
  );
  const [dislikeCount, setDislikeCount] = useState<number>(
    post.dislikes ?? Math.floor(Math.random() * 20) + 1
  );
  const [commentCount] = useState<number>(
    post.comments ?? Math.floor(Math.random() * 40) + 2
  );
  const [copied, setCopied] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount((c) => c - 1);
      }
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disliked) {
      setDisliked(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDisliked(true);
      setDislikeCount((c) => c + 1);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.origin + "/my-feed/" + (post.slug || post.id)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved((s) => !s);
  };

  return (
    <Link href={`/my-feed/${post.slug || post.id}`} className="blog-card group block">
      <article>
        {/* Image */}
        <div className="blog-card__image-wrap">
          <Image
            src={post.image || post.main_image}
            alt={post.title}
            fill
            className="blog-card__image"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
          <div className="blog-card__tags">
            {post.tags.slice(0, 2).map((tag: string, i: number) => (
              <span key={i} className="blog-card__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="blog-card__body">
          <span className="blog-card__date">{post.date}</span>
          <h3 className="blog-card__title">{post.title}</h3>
          <p className="blog-card__desc">{post.desc}</p>
          <div className="blog-card__divider" />

          {/* Action Bar */}
          <div
            className="blog-card__actions"
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={handleLike}
              className={`blog-card__action-btn ${liked ? "blog-card__action-btn--liked" : ""}`}
              aria-label="Like"
            >
              <ThumbsUp size={14} strokeWidth={2} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`blog-card__action-btn ${disliked ? "blog-card__action-btn--disliked" : ""}`}
              aria-label="Dislike"
            >
              <ThumbsDown size={14} strokeWidth={2} />
              <span>{dislikeCount}</span>
            </button>

            <button
              className="blog-card__action-btn"
              aria-label="Comment"
            >
              <MessageCircle size={14} strokeWidth={2} />
              <span>{commentCount}</span>
            </button>

            <button
              onClick={handleShare}
              className={`blog-card__action-btn ${copied ? "blog-card__action-btn--shared" : ""}`}
              aria-label="Share"
            >
              <Share2 size={14} strokeWidth={2} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>

            <button
              onClick={handleSave}
              className={`blog-card__action-btn blog-card__action-btn--save ${saved ? "blog-card__action-btn--saved" : ""}`}
              aria-label="Save"
            >
              <Bookmark
                size={14}
                strokeWidth={2}
                fill={saved ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* --- Top Stories data --- */
const topStories = [
  { title: "SpaceX IPO mints thousands of new millionaires", time: "12 min ago", readers: "11,071 readers" },
  { title: "DOJ approves Paramount's $110B deal", time: "21 min ago", readers: "4,004 readers" },
  { title: "OpenAI subpoenaed by state AGs", time: "28 min ago", readers: "1,222 readers" },
  { title: "Gen Z enters the boardroom. Not all are ready", time: "1 hour ago", readers: "171 readers" },
];

/* --- Right Sidebar --- */
function TopStoriesSidebar() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? topStories : topStories.slice(0, 4);

  return (
    <aside className="w-full xl:w-[300px] shrink-0 flex flex-col gap-4 xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Top Stories */}
      <div className="bg-white rounded-[24px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-gray-800">Top stories</h3>
        <ul className="flex flex-col gap-4">
          {visible.map((story, i) => (
            <li
              key={i}
              className="flex flex-col gap-0.5 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <p className="text-[12px] font-semibold text-gray-800 leading-snug">
                {story.title}
              </p>
              <span className="text-[10px] font-medium text-gray-400">
                {story.time} - {story.readers}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#5cb85c] hover:underline"
        >
          {showAll ? "Show less" : "Show more"}
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Network card */}
      <div className="bg-gradient-to-br from-[#f0faf0] to-[#e8f5e8] rounded-[24px] p-5 border border-[#c8eac8]/60 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-3">
        <p className="text-[10px] font-bold tracking-widest text-[#3a8f3a]">
          YOUR NETWORK
        </p>
        <p className="text-sm font-extrabold text-gray-800 leading-snug">
          Skip the cold apply
        </p>
        <button className="flex items-center gap-2 bg-[#5cb85c] text-white text-[11px] font-bold px-4 py-2.5 rounded-full hover:bg-[#4cae4c] transition-colors w-fit shadow-sm">
          <Users size={13} strokeWidth={2.5} />
          See who hiring
        </button>
      </div>

      {/* Trending */}
      <div className="bg-white rounded-[24px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-gray-800">
          Trending in Business
        </h3>
        <ul className="flex flex-col gap-3">
          {["#AIStartups", "#ProductLed", "#BootstrapLife", "#B2BSaaS", "#VentureCapital"].map(
            (tag, i) => (
              <li key={tag} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-medium">
                    #{i + 1} trending
                  </span>
                  <span className="text-[12px] font-bold text-gray-700">
                    {tag}
                  </span>
                </div>
                <TrendingUp size={14} className="text-[#f5a623]" strokeWidth={2} />
              </li>
            )
          )}
        </ul>
      </div>
    </aside>
  );
}

/* --- Root Export --- */
export default function BusinessFeed() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const dbPosts = await getPosts();
        const mapped = dbPosts.map((p: any) => {
          const categoryName =
            typeof p.category === "object" && p.category?.name
              ? p.category.name
              : typeof p.category === "string"
              ? p.category
              : "General";

          return {
            ...p,
            image:
              p.image ||
              p.main_image ||
              p.coverImage ||
              "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
            tags: Array.isArray(p.tags) ? p.tags : ["Business"],
            category: categoryName,
            date: new Date(
              p.last_updated ||
                p.lastUpdated ||
                p.published_at ||
                p.created_at ||
                Date.now()
            ).toLocaleDateString(),
            desc:
              p.intro ||
              p.excerpt ||
              p.description ||
              p.content?.slice(0, 200) ||
              "",
            title: p.title || "Untitled",
          };
        });
        setAllPosts(mapped);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = allPosts.filter((p) => {
    const matchCat =
      activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t: string) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Browse by categories
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/30 focus:border-[#5cb85c] w-56 placeholder:text-gray-400 transition-all"
            />
            <Search
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? "bg-[#5cb85c] text-white border-[#5cb85c] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#5cb85c] hover:text-[#5cb85c]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid / Skeleton / Empty */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            {filtered.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
            <Search size={40} strokeWidth={1.5} className="mb-4 opacity-40" />
            <p className="text-base font-semibold">No posts found</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <TopStoriesSidebar />
    </div>
  );
}