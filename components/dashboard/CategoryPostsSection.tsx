"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PostCard {
  image: string;
  tags: string[];
  date: string;
  title: string;
  desc: string;
}

interface PostSectionProps {
  title: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  posts: PostCard[];
}

function PostSection({ title, accentColor, badgeBg, badgeText, posts }: PostSectionProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-5 rounded-full ${accentColor}`} />
          <h2 className="text-base font-extrabold text-gray-800 tracking-tight">{title}</h2>
        </div>
        <button
          className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-full border transition-all hover:shadow-sm active:scale-95 ${badgeBg} ${badgeText}`}
        >
          View All
          <ArrowRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Post Cards Grid — 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {posts.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] p-4 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-3 group cursor-pointer hover:shadow-md transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/9] rounded-[16px] overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Tags */}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {card.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-white/85 backdrop-blur-sm text-[10px] font-bold text-gray-700 px-3 py-1 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5 px-1 pb-1">
              <span className="text-[10px] font-semibold text-gray-400">{card.date}</span>
              <h3
                className={`text-sm font-bold text-gray-800 leading-snug line-clamp-2 transition-colors group-hover:${badgeText}`}
              >
                {card.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-normal line-clamp-2">
                {card.desc}
              </p>
              <span className={`text-[11px] font-bold mt-1 block ${badgeText} hover:underline`}>
                Read More →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const financePosts: PostCard[] = [
  {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop",
    tags: ["Finance", "Budget"],
    date: "July 10, 2025",
    title: "How to Build a 6-Month Emergency Fund Without Sacrificing Your Lifestyle",
    desc: "Discover practical strategies to grow your savings buffer while still enjoying life. A step-by-step guide to financial resilience.",
  },
  {
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=600&h=340&fit=crop",
    tags: ["Tax", "Planning"],
    date: "July 8, 2025",
    title: "Top 5 Tax Deductions Most Freelancers Miss Every Year",
    desc: "Self-employed? You could be leaving thousands on the table. Here are the deductions you should be claiming before filing.",
  },
];

const investingPosts: PostCard[] = [
  {
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop",
    tags: ["Stocks", "Strategy"],
    date: "July 9, 2025",
    title: "Index Funds vs. ETFs: Which One Is Right for Your Portfolio in 2025?",
    desc: "Both are low-cost, diversified options — but they aren't the same. We break down the key differences so you can invest smarter.",
  },
  {
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=340&fit=crop",
    tags: ["Investing", "AI"],
    date: "July 7, 2025",
    title: "How AI-Powered Tools Are Changing the Way Retail Investors Analyze Stocks",
    desc: "From sentiment analysis to earnings prediction, AI is leveling the playing field. Here's what tools to watch in 2025.",
  },
];

export default function CategoryPostsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <PostSection
        title="Finance Posts"
        accentColor="bg-[#5cb85c]"
        badgeBg="bg-[#f0faf0] border-[#c8eac8]"
        badgeText="text-[#3a8f3a]"
        posts={financePosts}
      />
      <PostSection
        title="Investing & Stock Posts"
        accentColor="bg-[#f5a623]"
        badgeBg="bg-amber-50 border-amber-200"
        badgeText="text-amber-700"
        posts={investingPosts}
      />
    </div>
  );
}
