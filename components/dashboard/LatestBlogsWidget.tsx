"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

const LATEST_BLOGS = [
  {
    id: 1,
    title: "How Global Tariffs are Shifting in 2026",
    date: "14 Jul 2026",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&h=100&fit=crop",
    likes: 84,
    dislikes: 3,
    comments: 12,
  },
  {
    id: 2,
    title: "Top 5 Strategies for B2B Supply Chain Optimization",
    date: "12 Jul 2026",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a30?w=100&h=100&fit=crop",
    likes: 61,
    dislikes: 2,
    comments: 8,
  },
  {
    id: 3,
    title: "Understanding Cross-Border Escrow Payments",
    date: "10 Jul 2026",
    image: "https://images.unsplash.com/photo-1621858728956-6a56e30018a1?w=100&h=100&fit=crop",
    likes: 47,
    dislikes: 5,
    comments: 6,
  },
  {
    id: 4,
    title: "The Rise of Agri-Tech in Emerging Markets",
    date: "08 Jul 2026",
    image: "https://images.unsplash.com/photo-1592982537443-d1449830db9f?w=100&h=100&fit=crop",
    likes: 39,
    dislikes: 1,
    comments: 4,
  },
];

function BlogRow({ blog }: { blog: (typeof LATEST_BLOGS)[0] }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [dislikes, setDislikes] = useState(blog.dislikes);
  const [copied, setCopied] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    e.stopPropagation();
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
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
      {/* Blog row */}
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="48px"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{blog.date}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1 pl-0.5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
            liked
              ? "bg-blue-50 text-blue-600"
              : "text-gray-400 hover:text-blue-500 hover:bg-blue-50/60"
          }`}
          aria-label="Like"
        >
          <ThumbsUp size={11} strokeWidth={2.5} />
          <span>{likes}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
            disliked
              ? "bg-red-50 text-red-500"
              : "text-gray-400 hover:text-red-400 hover:bg-red-50/60"
          }`}
          aria-label="Dislike"
        >
          <ThumbsDown size={11} strokeWidth={2.5} />
          <span>{dislikes}</span>
        </button>

        <button
          className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full text-gray-400 hover:text-purple-500 hover:bg-purple-50/60 transition-all"
          aria-label="Comments"
        >
          <MessageCircle size={11} strokeWidth={2.5} />
          <span>{blog.comments}</span>
        </button>

        <button
          onClick={handleShare}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ml-auto ${
            copied
              ? "bg-green-50 text-green-600"
              : "text-gray-400 hover:text-green-500 hover:bg-green-50/60"
          }`}
          aria-label="Share"
        >
          <Share2 size={11} strokeWidth={2.5} />
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}

export default function LatestBlogsWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">WWB Latest Blogs</h2>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {LATEST_BLOGS.map((blog) => (
          <BlogRow key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
