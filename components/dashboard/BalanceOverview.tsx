"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart3, LineChart } from "lucide-react";

export default function BalanceOverview() {
  const [activeTab, setActiveTab] = useState("7d");

  // Representing the bar chart columns from Sunday to Saturday
  const days = [
    { day: "Sun", savings: 4, income: 8, expenses: 3 },
    { day: "Mon", savings: 5, income: 6, expenses: 2 },
    { day: "Tue", savings: 7, income: 9, expenses: 4 },
    { day: "Wed", savings: 6, income: 18, expenses: 5, active: true },
    { day: "Thu", savings: 5, income: 7, expenses: 3 },
    { day: "Fri", savings: 8, income: 10, expenses: 4 },
    { day: "Sat", savings: 9, income: 12, expenses: 5 },
  ];

  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-6 w-full">
      {/* Left side: Main Bar Chart */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">$12,450</h2>
            <p className="text-xs font-medium text-gray-400 mt-1">Balance overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 7d filter */}
            <div className="relative">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-100 text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="all">All</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 border-l border-gray-200 pl-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Toggle chart style */}
            <div className="flex items-center bg-gray-50 border border-gray-100 p-0.5 rounded-lg">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <LineChart size={15} />
              </button>
              <button className="p-1 bg-white text-gray-800 shadow-sm rounded">
                <BarChart3 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-4 text-xs font-semibold text-gray-500 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-300"></span>
            Savings
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#9ee838]"></span>
            Income
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-400"></span>
            Expenses
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-[200px] flex items-end justify-between px-2 pt-6">
          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400 font-medium">
            <div className="w-full border-b border-gray-100 pb-1">30</div>
            <div className="w-full border-b border-gray-100 pb-1">20</div>
            <div className="w-full border-b border-gray-100 pb-1">10</div>
            <div className="w-full border-b border-gray-100 pb-1">0</div>
            <div className="w-full pb-1">-10</div>
          </div>

          {/* Bar Chart Columns */}
          {days.map((dayObj, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group relative z-10 flex-1">
              <div className="w-8 md:w-10 flex flex-col justify-end items-center relative h-[150px]">
                {/* Wednesday Active State Tooltip */}
                {dayObj.active && (
                  <div className="absolute -top-16 bg-white border border-gray-100 shadow-lg rounded-xl p-2.5 z-20 w-[140px] text-[11px]">
                    <div className="text-gray-400 font-bold mb-1">Wednesday, 7 Jan 2025</div>
                    <div className="flex justify-between items-center text-gray-600 font-semibold mb-0.5">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>Savings</span>
                      <span>$240</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 font-semibold mb-0.5">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#9ee838]"></span>Income</span>
                      <span>$700</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 font-semibold">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>Expenses</span>
                      <span>$460</span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-gray-100 rotate-45"></div>
                  </div>
                )}

                {/* The stacked bar */}
                <div className="w-full flex flex-col justify-end rounded-lg overflow-hidden h-full">
                  {/* Gray background helper track */}
                  <div className="flex-1 bg-gray-50/50 rounded-t-lg group-hover:bg-gray-100/40 transition-colors w-full flex flex-col justify-end">
                    {/* Savings (Yellow top segment) */}
                    <div 
                      className={`w-full bg-yellow-300/90 rounded-t-sm transition-all`} 
                      style={{ height: `${dayObj.savings * 4}px` }} 
                    />
                    {/* Income (Green middle segment) */}
                    <div 
                      className={`w-full bg-[#9ee838] transition-all`} 
                      style={{ height: `${dayObj.income * 4}px` }} 
                    />
                    {/* Expenses (Orange/Red striped bottom segment) */}
                    <div 
                      className={`w-full bg-orange-400/90 rounded-b-sm transition-all`} 
                      style={{ height: `${dayObj.expenses * 4}px` }} 
                    />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">{dayObj.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical separator line */}
      <div className="hidden lg:block w-[1px] bg-gray-100/80 my-2"></div>

      {/* Right side: Total Income, Total Expenses, Saved Balance */}
      <div className="w-full lg:w-[180px] shrink-0 flex flex-col justify-between py-2 gap-4 lg:gap-0">
        {/* Total income */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total income</p>
          <div className="text-2xl font-extrabold text-gray-800 mt-1">$15,000</div>
          <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
            <TrendingUp size={12} className="mr-0.5" />
            <span>5.1%</span>
            <span className="text-gray-400 font-medium ml-1">from last month</span>
          </div>
        </div>

        {/* Total expenses */}
        <div className="border-t border-b border-gray-100 lg:border-none py-4 lg:py-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total expenses</p>
          <div className="text-2xl font-extrabold text-gray-800 mt-1">$6,700</div>
          <div className="flex items-center text-[10px] text-orange-500 font-bold mt-1.5">
            <TrendingDown size={12} className="mr-0.5" />
            <span>15.5%</span>
            <span className="text-gray-400 font-medium ml-1">from last month</span>
          </div>
        </div>

        {/* Saved balance */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Saved balance</p>
          <div className="text-2xl font-extrabold text-gray-800 mt-1">$8,300</div>
          <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
            <TrendingUp size={12} className="mr-0.5" />
            <span>20.7%</span>
            <span className="text-gray-400 font-medium ml-1">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
