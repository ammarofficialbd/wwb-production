"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

interface FeaturedPost {
  id: number;
  src: string;
  alt: string;
  badge: string;
  badgeColor: string;
  title: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function FeaturedCard({ post }: { post: FeaturedPost }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [copied, setCopied] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false); setLikes((n) => n - 1);
    } else {
      setLiked(true); setLikes((n) => n + 1);
      if (disliked) { setDisliked(false); setDislikes((n) => n - 1); }
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disliked) {
      setDisliked(false); setDislikes((n) => n - 1);
    } else {
      setDisliked(true); setDislikes((n) => n + 1);
      if (liked) { setLiked(false); setLikes((n) => n - 1); }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image area */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={post.src}
          alt={post.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
          <span className={`${post.badgeColor} text-xs font-bold uppercase tracking-wider mb-2`}>
            {post.badge}
          </span>
          <h3 className="text-white text-base font-bold leading-tight mb-3">
            {post.title}
          </h3>
          <button className="flex items-center text-sm text-white font-semibold group/btn w-fit">
            Read More <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Action bar below image */}
      <div
        className="flex items-center gap-1 px-3 py-2 bg-white border-t border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
            liked ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-blue-500 hover:bg-blue-50/60"
          }`}
        >
          <ThumbsUp size={11} strokeWidth={2.5} />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
            disliked ? "bg-red-50 text-red-500" : "text-gray-400 hover:text-red-400 hover:bg-red-50/60"
          }`}
        >
          <ThumbsDown size={11} strokeWidth={2.5} />
          <span>{dislikes}</span>
        </button>
        <button className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full text-gray-400 hover:text-purple-500 hover:bg-purple-50/60 transition-all">
          <MessageCircle size={11} strokeWidth={2.5} />
          <span>{post.comments}</span>
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ml-auto ${
            copied ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-green-500 hover:bg-green-50/60"
          }`}
        >
          <Share2 size={11} strokeWidth={2.5} />
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}

const featuredPosts: FeaturedPost[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop",
    alt: "Logistics",
    badge: "Logistics News",
    badgeColor: "text-blue-400",
    title: "Global Shipping Routes Adjust to New Maritime Regulations",
    likes: 132,
    dislikes: 7,
    comments: 44,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    alt: "Business District",
    badge: "Top Performer",
    badgeColor: "text-amber-400",
    title: "How Top Manufacturers Are Sourcing Raw Materials in 2026",
    likes: 98,
    dislikes: 5,
    comments: 36,
  },
];

export default function FeaturedContentWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Main Featured Content</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredPosts.map((post) => (
          <FeaturedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
