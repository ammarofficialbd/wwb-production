"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function useAnimatedCounter(initial: number, incrementPerTick = 1, intervalMs = 2000) {
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);

  useEffect(() => {
    const id = setInterval(() => {
      ref.current += Math.floor(Math.random() * 3) + incrementPerTick;
      setValue(ref.current);
    }, intervalMs);
    return () => clearInterval(id);
  }, [incrementPerTick, intervalMs]);

  return value;
}

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

export default function FinancialStatsWidget() {
  const totalUsers = useAnimatedCounter(715000, 2, 2500);

  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full w-full min-h-[300px]">
      {/* Total income */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1 tabular-nums transition-all duration-300">
          {formatNumber(totalUsers)}
          <span className="ml-1 inline-block w-[6px] h-[6px] rounded-full bg-green-500 align-middle animate-ping" />
        </div>
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
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Buyer</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">6,700</div>
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
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total seller</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">8,300</div>
        <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
          <TrendingUp size={12} className="mr-0.5" />
          <span>20.7%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>

        {/* Divider */}
      <div className="w-full h-[1px] bg-gray-100/80 my-4"></div>

        {/* Saved balance */}
      <div className="flex flex-col">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Bids</p>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">1500</div>
        <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
          <TrendingUp size={12} className="mr-0.5" />
          <span>20.7%</span>
          <span className="text-gray-400 font-medium ml-1">from last month</span>
        </div>
      </div>
    </div>

    
  );
}
