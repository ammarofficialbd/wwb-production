"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

interface CardData {
  image: string;
  tags: string[];
  date: string;
  title: string;
  desc: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function PostCard({ card }: { card: CardData }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(card.likes);
  const [dislikes, setDislikes] = useState(card.dislikes);
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
    <div className="bg-white rounded-[28px] p-4 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-all duration-300">
      {/* Card Image Container */}
      <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Tag Overlays */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {card.tags.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="bg-white/85 backdrop-blur-sm text-[10px] font-bold text-gray-700 px-3 py-1 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 px-1 pb-1">
        <span className="text-[10px] font-semibold text-gray-400">{card.date}</span>
        <h3 className="text-md font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#5cb85c] transition-colors">
          {card.title}
        </h3>
        <p className="text-[11px] text-gray-400 font-semibold leading-normal line-clamp-3">
          {card.desc}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mt-1" />

        {/* Action bar */}
        <div
          className="flex items-center gap-1"
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
            <span>{card.comments}</span>
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
    </div>
  );
}

export default function PostCardsWidget() {
  const cards: CardData[] = [
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop",
      tags: ["Privacy", "Audio"],
      date: "November 15, 2022",
      title: "Ensure Data Privacy and Compliance with Bulk Audio Redaction Software",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
      likes: 76,
      dislikes: 3,
      comments: 19,
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop",
      tags: ["PII", "Audio"],
      date: "November 15, 2022",
      title: "Understanding PII Redaction in Redacted Audio Transcripts",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
      likes: 53,
      dislikes: 7,
      comments: 11,
    },
    {
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&h=300&fit=crop",
      tags: ["PII", "Audio"],
      date: "November 15, 2022",
      title: "Redacting Insurance Documents with Redaction Software",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
      likes: 41,
      dislikes: 2,
      comments: 7,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-bold text-gray-850 tracking-tight">Featured posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {cards.map((card, idx) => (
          <PostCard key={idx} card={card} />
        ))}
      </div>
    </div>
  );
}
