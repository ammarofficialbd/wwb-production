"use client";

import { Plus } from "lucide-react";
import Image from "next/image";

export default function GoalTracker() {
  const thisYearGoals = [
    {
      name: "Reserve",
      saved: "$7,000",
      total: "$10,000",
      percentage: 70,
      timeLeft: "Left to save 4 months",
      color: "bg-[#9ee838]",
      emoji: "🏦",
    },
  ];

  const longTermGoals = [
    {
      name: "Travel",
      saved: "$2,500",
      total: "$4,000",
      percentage: 62.5,
      timeLeft: "Left to save 3 months",
      color: "bg-orange-400",
      emoji: "✈️",
    },
    {
      name: "Car",
      saved: "$1,600",
      total: "$20,000",
      percentage: 8,
      timeLeft: "Left to save 3 years 6 months",
      color: "bg-orange-300",
      emoji: "🚗",
    },
    {
      name: "Real estate",
      saved: "$8,300",
      total: "$70,000",
      percentage: 12,
      timeLeft: "Left to save 5 years 8 months",
      color: "bg-orange-300",
      emoji: "🏠",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[280px] w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-gray-800">Goal tracker</h2>
        <button className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100/80 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-all">
          <Plus size={11} />
          <span>Add goals</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {/* This Year */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">This year</h3>
          <div className="flex flex-col gap-2">
            {thisYearGoals.map((goal, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm border border-gray-100 shrink-0">
                  {goal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-gray-800">
                    <span className="truncate">{goal.name}</span>
                    <span>{goal.saved}<span className="text-gray-400 font-semibold text-[9.5px]">/{goal.total}</span></span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden mt-1.5 border border-gray-100/30">
                    <div className={`${goal.color} h-1.5 rounded-full`} style={{ width: `${goal.percentage}%` }}></div>
                  </div>
                  <span className="text-[8.5px] font-semibold text-gray-400 block mt-1">{goal.timeLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Long Term */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Long term</h3>
          <div className="flex flex-col gap-3">
            {longTermGoals.map((goal, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm border border-gray-100 shrink-0">
                  {goal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-gray-800">
                    <span className="truncate">{goal.name}</span>
                    <span>{goal.saved}<span className="text-gray-400 font-semibold text-[9.5px]">/{goal.total}</span></span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden mt-1.5 border border-gray-100/30">
                    <div className={`${goal.color} h-1.5 rounded-full`} style={{ width: `${goal.percentage}%` }}></div>
                  </div>
                  <span className="text-[8.5px] font-semibold text-gray-400 block mt-1">{goal.timeLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
