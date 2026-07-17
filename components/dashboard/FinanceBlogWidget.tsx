"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

interface BlogItem {
  id: number;
  image: string;
  alt: string;
  title: string;
  readTime: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function BlogRow({ blog }: { blog: BlogItem }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [dislikes, setDislikes] = useState(blog.dislikes);
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
    <div className="flex flex-col gap-2 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex gap-3 group cursor-pointer">
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={blog.image}
            alt={blog.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="80px"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{blog.readTime}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1">
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
          <span>{blog.comments}</span>
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

const financeBlogs: BlogItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=160&fit=crop",
    alt: "Finance",
    title: "Mastering International Letters of Credit (L/C)",
    readTime: "10 min read",
    likes: 91,
    dislikes: 3,
    comments: 22,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&h=160&fit=crop",
    alt: "Payments",
    title: "Cross-Border Payment Structures: 2026 Guide",
    readTime: "8 min read",
    likes: 68,
    dislikes: 5,
    comments: 14,
  },
];

export default function FinanceBlogWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Finance Category
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {financeBlogs.map((blog) => (
          <BlogRow key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
