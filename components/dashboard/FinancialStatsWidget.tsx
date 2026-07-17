"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function FinancialStatsWidget() {
  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full w-full min-h-[300px]">
      {/* Total income */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total income</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">$15,000</div>
        <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
          <TrendingUp size={12} className="mr-0.5" />
          <span>5.1%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-100/80 my-4"></div>

      {/* Total expenses */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total expenses</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">$6,700</div>
        <div className="flex items-center text-[10px] text-orange-500 font-bold mt-1.5">
          <TrendingDown size={12} className="mr-0.5" />
          <span>15.5%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-100/80 my-4"></div>

      {/* Saved balance */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Saved balance</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">$8,300</div>
        <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
          <TrendingUp size={12} className="mr-0.5" />
          <span>20.7%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>
    </div>
  );
}
