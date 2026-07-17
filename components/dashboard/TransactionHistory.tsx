"use client";

import Image from "next/image";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export default function TransactionHistory() {
  const transactions = [
    {
      name: "Dividend payout",
      date: "25 Feb 2025",
      amount: "+ $1,100",
      status: "Completed",
      isPositive: true,
      logoText: "TD",
      bgColor: "bg-emerald-600 text-white",
    },
    {
      name: "Corporate subscriptions",
      date: "25 Feb 2025",
      amount: "- $6,400",
      status: "Declined",
      isPositive: false,
      logoText: "SF",
      bgColor: "bg-blue-600 text-white",
    },
    {
      name: "Investment in ETF",
      date: "21 Feb 2025",
      amount: "- $900",
      status: "Completed",
      isPositive: false,
      logoText: "V",
      bgColor: "bg-gray-900 text-white",
    },
    {
      name: "Consulting services",
      date: "21 Feb 2025",
      amount: "- $2,100",
      status: "Completed",
      isPositive: false,
      logoText: "CNX",
      bgColor: "bg-indigo-950 text-white",
    },
    {
      name: "Equipment purchase",
      date: "20 Feb 2025",
      amount: "- $1,700",
      status: "Completed",
      isPositive: false,
      logoText: "a",
      bgColor: "bg-amber-950 text-yellow-500 font-serif lowercase italic text-lg",
    },
    {
      name: "Elli Harper",
      date: "15 Feb 2025",
      amount: "+ $600",
      status: "Completed",
      isPositive: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      name: "Davis Rowen",
      date: "15 Feb 2025",
      amount: "+ $800",
      status: "Completed",
      isPositive: true,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-gray-800">Transaction history</h2>
        
        <button className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100/80 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
          <span>7d</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Sorting bar / labels */}
      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-b border-gray-50 pb-2">
        <button className="flex items-center gap-1 hover:text-gray-600 transition-colors uppercase tracking-wider">
          <ArrowUpDown size={11} />
          <span>Name</span>
        </button>
        <span className="uppercase tracking-wider">Amount</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-3">
              {/* Logo / Avatar container */}
              {tx.avatar ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-100">
                  <Image src={tx.avatar} alt={tx.name} fill className="object-cover" sizes="36px" />
                </div>
              ) : (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${tx.bgColor}`}>
                  {tx.logoText}
                </div>
              )}

              {/* Text */}
              <div>
                <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-black transition-colors">{tx.name}</h3>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{tx.date}</p>
              </div>
            </div>

            {/* Amount / Status */}
            <div className="text-right">
              <div className={`text-xs font-extrabold ${tx.isPositive ? "text-green-500" : "text-gray-800"}`}>
                {tx.amount}
              </div>
              <div className={`text-[9px] font-bold mt-0.5 ${tx.status === "Declined" ? "text-red-400" : "text-gray-400"}`}>
                {tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
