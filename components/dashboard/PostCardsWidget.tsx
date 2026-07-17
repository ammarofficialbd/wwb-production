"use client";

import Image from "next/image";

export default function PostCardsWidget() {
  const cards = [
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop",
      tags: ["Privacy", "Audio"],
      date: "November 15, 2022",
      title: "Ensure Data Privacy and Compliance with Bulk Audio Redaction Software",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop",
      tags: ["PII", "Audio"],
      date: "November 15, 2022",
      title: "Understanding PII Redaction in Redacted Audio Transcripts",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
    },
    {
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500&h=300&fit=crop",
      tags: ["PII", "Audio"],
      date: "November 15, 2022",
      title: "Redacting Insurance Documents with Redaction Software",
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page from when looking at it layout. The point of using Lorem Ipsum",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-bold text-gray-850 tracking-tight">Featured posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[28px] p-4 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-all duration-300"
          >
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
            <div className="flex flex-col gap-2 flex-1 px-1 pb-2">
              <span className="text-[10px] font-semibold text-gray-400">{card.date}</span>
              <h3 className="text-md font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#5cb85c] transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-normal line-clamp-3">
                {card.desc}
              </p>
              <span className="text-[11px] font-bold text-[#5cb85c] hover:underline mt-auto pt-2 block">
                Read More
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
