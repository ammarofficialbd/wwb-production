"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, BookOpen } from "lucide-react";

interface GuideItem {
  id: number;
  icon: "blue" | "purple";
  title: string;
  desc: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function GuideCard({ guide }: { guide: GuideItem }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(guide.likes);
  const [dislikes, setDislikes] = useState(guide.dislikes);
  const [copied, setCopied] = useState(false);

  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", hover: "group-hover:text-blue-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", hover: "group-hover:text-purple-600" },
  };
  const color = colorMap[guide.icon];

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
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
      {/* Guide content */}
      <div className="flex items-start gap-4 cursor-pointer group">
        <div className={`p-3 ${color.bg} ${color.text} rounded-xl group-hover:scale-110 transition-transform shrink-0`}>
          <BookOpen size={24} />
        </div>
        <div>
          <h3 className={`font-bold text-gray-800 mb-1 ${color.hover} transition-colors`}>
            {guide.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{guide.desc}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

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
          <span>{guide.comments}</span>
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

const guides: GuideItem[] = [
  {
    id: 1,
    icon: "blue",
    title: "How to Safely Export Textiles Globally",
    desc: "The definitive guide on compliance, shipping, and quality assurance for cross-border textile trade.",
    likes: 104,
    dislikes: 6,
    comments: 31,
  },
  {
    id: 2,
    icon: "purple",
    title: "The Framework of IT Outsourcing",
    desc: "Learn how to vet, hire, and manage top-tier IT talent and agencies from around the world.",
    likes: 87,
    dislikes: 4,
    comments: 25,
  },
];

export default function FeaturedGuidesWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Featured Guides
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}
