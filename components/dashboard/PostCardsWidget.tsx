"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Eye } from "lucide-react";
import { getPosts } from "@/app/actions/blog";
import Link from "next/link";

interface CardData {
  id: string | number;
  slug: string;
  image: string;
  tags: string[];
  date: string;
  title: string;
  desc: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function PostCardSkeleton({ isFirst }: { isFirst: boolean }) {
  return (
    <div
      className={`bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.02)] w-full h-full flex p-4 animate-pulse
        ${isFirst ? "flex-col" : "flex-col lg:flex-row lg:items-center gap-4"}
      `}
    >
      <div
        className={`bg-gray-200 rounded-[18px] shrink-0
          ${isFirst 
            ? "w-full aspect-[16/10] mb-3" 
            : "w-full aspect-[16/10] lg:w-[140px] lg:h-[180px] lg:aspect-auto"
          }`}
      ></div>
      <div className="flex flex-col flex-1 justify-between h-full w-full py-1">
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="mt-4 w-full">
          <div className="h-px bg-gray-100/80 mb-3" />
          <div className="flex items-center gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16 ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ card, isFirst }: { card: CardData; isFirst: boolean }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(card.likes);
  const [dislikes, setDislikes] = useState(card.dislikes);
  const [copied, setCopied] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) {
      setLiked(false);
      setLikes((n) => n - 1);
    } else {
      setLiked(true);
      setLikes((n) => n + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes((n) => n - 1);
      }
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disliked) {
      setDisliked(false);
      setDislikes((n) => n - 1);
    } else {
      setDisliked(true);
      setDislikes((n) => n + 1);
      if (liked) {
        setLiked(false);
        setLikes((n) => n - 1);
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.origin + "/my-feed/" + card.slug).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/my-feed/${card.slug}`} className="block w-full h-full">
      <article
        className={`bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 w-full h-full flex group cursor-pointer p-4
          ${isFirst ? "flex-col" : "flex-col sm:flex-row lg:flex-row lg:items-center gap-4"}
        `}
      >
        <div
          className={`relative rounded-[18px] overflow-hidden shrink-0 transition-all duration-300
            ${isFirst 
              ? "w-full aspect-[16/10] mb-3" 
              : "w-full aspect-[16/9] sm:w-[180px] sm:h-[140px] sm:aspect-auto lg:w-[160px] lg:h-[180px] lg:aspect-auto"
            }`}
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 33vw"
            unoptimized
          />
          {card.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
              {card.tags.slice(0, 2).map((tag, tagIdx) => (
                <span key={tagIdx} className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-700 px-3 py-1 rounded-full shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between h-full w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-400">{card.date}</span>
            
            <h3 className={`font-bold text-gray-850 leading-snug line-clamp-2 group-hover:text-[#5cb85c] transition-colors
              ${isFirst ? "text-[16px] sm:text-[18px]" : "text-[14px]"}
            `}>
              {card.title}
            </h3>
            
            <p className="text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-2 mt-1">
              {card.desc}
            </p>
          </div>

          <div className="mt-3 w-full">
            <div className="h-px bg-gray-100/80 mb-2" />
            
            <div className="flex items-center gap-1 w-full" onClick={(e) => e.preventDefault()}>
              <button onClick={handleLike} className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full transition-all ${liked ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"}`}>
                <ThumbsUp size={12} strokeWidth={2.5} />
                <span>{likes}</span>
              </button>
              <button onClick={handleDislike} className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full transition-all ${disliked ? "bg-red-50 text-red-500" : "text-gray-400 hover:text-red-400 hover:bg-red-50"}`}>
                <ThumbsDown size={12} strokeWidth={2.5} />
                <span>{dislikes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all">
                <MessageCircle size={12} strokeWidth={2.5} />
                <span>{card.comments}</span>
              </button>
              <button onClick={handleShare} className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full transition-all ml-auto ${copied ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-green-500 hover:bg-green-50"}`}>
                <Share2 size={12} strokeWidth={2.5} />
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function PostCardsWidget() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getPosts();
        const mapped = posts.slice(0, 3).map((p: any) => ({
          id: p.id,
          slug: (p.slug || p.id).toString(),
          image: p.image || p.main_image || p.coverImage || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
          tags: Array.isArray(p.tags) ? p.tags : ["Business"],
          date: new Date(p.created_at || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
          title: p.title || "Untitled",
          desc: p.intro || p.excerpt || p.description || p.content?.slice(0, 150) || "Read more about this topic...",
          likes: p.likes ?? Math.floor(Math.random() * 100) + 10,
          dislikes: p.dislikes ?? Math.floor(Math.random() * 10),
          comments: p.comments ?? Math.floor(Math.random() * 30),
        }));
        setCards(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-bold text-gray-850 tracking-tight">Featured posts</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full xl:auto-rows-fr">
        {loading ? (
          <>
            <div className="xl:col-span-1 xl:row-span-2 h-full">
              <PostCardSkeleton isFirst={true} />
            </div>
            <div className="xl:col-span-1 xl:row-span-1 h-full">
              <PostCardSkeleton isFirst={false} />
            </div>
            <div className="xl:col-span-1 xl:row-span-1 h-full">
              <PostCardSkeleton isFirst={false} />
            </div>
          </>
        ) : cards.length > 0 ? (
          <>
            <div className="xl:col-span-1 xl:row-span-2 h-full">
              <PostCard card={cards[0]} isFirst={true} />
            </div>

            {cards[1] && (
              <div className="xl:col-span-1 xl:row-span-1 h-full">
                <PostCard card={cards[1]} isFirst={false} />
              </div>
            )}

            {cards[2] && (
              <div className="xl:col-span-1 xl:row-span-1 h-full">
                <PostCard card={cards[2]} isFirst={false} />
              </div>
            )}
          </>
        ) : (
          <div className="col-span-1 xl:col-span-2 text-center py-10 text-gray-400">
            No featured posts available.
          </div>
        )}
      </div>
    </div>
  );
}