"use client";

import { ChevronDown } from "lucide-react";

export default function CostAnalysis() {
  const categories = [
    { name: "Housing", percentage: 18, color: "bg-orange-400" },
    { name: "Debt payments", percentage: 7, color: "bg-orange-300" },
    { name: "Food", percentage: 6, color: "bg-yellow-300" },
    { name: "Transportation", percentage: 9, color: "bg-lime-400" },
    { name: "Healthcare", percentage: 10, color: "bg-green-400" },
    { name: "Investments", percentage: 17, color: "bg-green-600" },
    { name: "Other", percentage: 33, color: "bg-gray-200" },
  ];

  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[280px] w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Cost analysis</h2>
          <p className="text-[10px] font-semibold text-gray-400">Spending overview</p>
        </div>
        <button className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100/80 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-lg transition-all">
          <span>January</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Amount and Progress Block */}
      <div className="my-3">
        <h3 className="text-2xl font-extrabold text-gray-800">$8,450</h3>
        
        {/* Color segments horizontal bar */}
        <div className="flex w-full h-3 rounded-full overflow-hidden mt-3 gap-0.5">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={`${cat.color} h-full`} 
              style={{ width: `${cat.percentage}%` }}
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>
      </div>

      {/* Categories Legend List */}
      <div className="flex flex-col gap-1.5 text-[10px] font-semibold text-gray-600 mt-auto overflow-y-auto max-h-[110px] pr-1">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-sm ${cat.color}`}></span>
              <span className="text-gray-500 font-medium">{cat.name}</span>
            </div>
            <span className="font-bold text-gray-800">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
