"use client";

import { ChevronDown, TrendingUp } from "lucide-react";

export default function FinancialHealth() {
  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[280px] w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Financial health</h2>
          <p className="text-[10px] font-semibold text-gray-400">Current status</p>
        </div>
        <button className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100/80 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-all">
          <span>30d</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Metric */}
      <div className="mt-2">
        <h3 className="text-2xl font-extrabold text-gray-800">$15,780</h3>
        <div className="flex items-center text-[9px] text-green-500 font-bold mt-0.5">
          <TrendingUp size={11} className="mr-0.5" />
          <span>17.5%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>

      {/* Gauge Chart SVG */}
      <div className="relative flex justify-center items-center h-[110px] mt-2 select-none">
        <svg width="140" height="85" viewBox="0 0 100 60" className="overflow-visible">
          {/* Base Gray Arc */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="#f3f4f6" 
            strokeWidth="10" 
            strokeLinecap="round" 
          />
          {/* Active Colored Arc (Green) */}
          <path 
            d="M 10 50 A 40 40 0 0 1 80 25" 
            fill="none" 
            stroke="#9ee838" 
            strokeWidth="10" 
            strokeLinecap="round"
            strokeDasharray="125"
            strokeDashoffset="31"
          />
        </svg>
        {/* Center label */}
        <div className="absolute top-[42px] flex flex-col items-center">
          <span className="text-xl font-extrabold text-gray-800">75%</span>
          <span className="text-[8px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">Of monthly income saved</span>
        </div>
      </div>

      {/* Footer info text */}
      <p className="text-[9px] text-gray-400 font-medium leading-normal mt-auto text-center px-2">
        Based on aggregated transaction metrics over the past 30 days
      </p>
    </div>
  );
}
