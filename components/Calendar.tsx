"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const columns = [
  { day: "S", date: 13 },
  { day: "M", date: 14 },
  { day: "T", date: 15 },
  { day: "W", date: 16 },
  { day: "T", date: 17 },
  { day: "F", date: 18 },
  { day: "S", date: 19 },
];

const activeIndex = 1; // Monday 14

export default function Calendar() {
  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5f5fa] text-[#5b5d76]">
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-bold text-[15px]">April 2022</h3>
        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5f5fa] text-[#5b5d76]">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {columns.map(({ day, date }, i) => (
          <div
            key={`${day}-${date}`}
            className={`flex flex-col items-center gap-2 py-1.5 rounded-full ${
              i === activeIndex ? "bg-[var(--amber)]/15" : ""
            }`}
          >
            <span className="text-xs font-semibold text-[var(--muted)]">
              {day}
            </span>
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                i === activeIndex
                  ? "bg-[var(--ink)] text-white"
                  : "text-[#5b5d76]"
              }`}
            >
              {date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
