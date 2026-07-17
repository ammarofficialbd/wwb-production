"use client";

import { Pencil } from "lucide-react";

export default function MonthlySpendingLimit() {
  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[130px] w-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Monthly spending limit</h2>
          <p className="text-[10px] font-semibold text-gray-400">Recipient accounts</p>
        </div>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <Pencil size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {/* Progress Bar */}
        <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100/30">
          <div className="bg-[#9ee838] h-3 rounded-full" style={{ width: "86%" }}></div>
        </div>
        
        {/* Value labels */}
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-700">
          <span>$8,600</span>
          <span className="text-gray-400 font-semibold">$10,000</span>
        </div>
      </div>
    </div>
  );
}
