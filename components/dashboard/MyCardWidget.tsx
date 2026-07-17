"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, CreditCard, Send, ArrowDownLeft, History, MoreHorizontal, Activity } from "lucide-react";

const FAKE_AVATARS = [
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
];

export default function MyCardWidget() {
  const [liveCount, setLiveCount] = useState(52564);
  const [activeAvatars, setActiveAvatars] = useState([
    { id: 1, url: FAKE_AVATARS[0] },
    { id: 2, url: FAKE_AVATARS[1] },
    { id: 3, url: FAKE_AVATARS[2] },
    { id: 4, url: FAKE_AVATARS[3] },
    { id: 5, url: FAKE_AVATARS[4] },
    { id: 6, url: FAKE_AVATARS[5] },
    { id: 7, url: FAKE_AVATARS[6] },
    { id: 8, url: FAKE_AVATARS[7] },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment user count
      setLiveCount((prev) => prev + Math.floor(Math.random() * 5) + 1);

      // Rotate avatars
      setActiveAvatars((prev) => {
        const nextAvatars = [...prev];
        nextAvatars.pop(); // Remove last
        
        // Add a random new one at the beginning
        const randomUrl = FAKE_AVATARS[Math.floor(Math.random() * FAKE_AVATARS.length)];
        nextAvatars.unshift({
          id: Date.now(),
          url: randomUrl,
        });
        
        return nextAvatars;
      });
    }, 2500); // update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: "Top up", icon: CreditCard },
    { label: "Send", icon: Send },
    { label: "Request", icon: ArrowDownLeft },
    { label: "History", icon: History },
    { label: "More", icon: MoreHorizontal },
  ];


  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-100/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-gray-800">Ads</h2>
          <p className="text-[11px] font-semibold text-gray-400">Quick actions</p>
        </div>
        <button className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100/80 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
          <Plus size={14} />
          <span>Add card</span>
        </button>
      </div>

      {/* Cards stack */}
      <div className="relative h-[160px] w-full select-none">
        {/* Underlay Credit Card (Gray) */}
        <div className="absolute right-0 top-2 w-[90%] h-[140px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-4 shadow-sm border border-white/40 flex flex-col justify-between opacity-60 scale-95 translate-x-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-600">Credit card</span>
            <div className="w-8 h-5 bg-gray-400/20 rounded"></div>
          </div>
          <div>
            <div className="text-gray-700 text-xs font-mono tracking-widest mb-1">•••• •••• •••• 1234</div>
            <div className="text-[10px] text-gray-600 font-semibold uppercase">Michael Johnson</div>
          </div>
        </div>

        {/* Foreground Debit Card (Green pattern) */}
        <div className="absolute left-0 top-0 w-[92%] h-[146px] bg-[#9ee838] rounded-2xl p-4 shadow-md flex flex-col justify-between text-gray-900 border border-white/20 overflow-hidden">
          {/* Wave background pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 C30,40 40,60 70,50 C90,40 100,55 100,55 L100,100 L0,100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs font-extrabold tracking-tight text-gray-800">Debit card</span>
            <span className="text-sm font-black italic tracking-wide text-gray-800">VISA</span>
          </div>

          {/* SIM chip representation */}
          <div className="relative z-10 w-8 h-6 bg-yellow-200/90 rounded border border-yellow-300 shadow-sm self-start my-1.5 flex flex-col gap-0.5 p-1 justify-between">
            <div className="h-[2px] bg-yellow-600/30 rounded"></div>
            <div className="h-[2px] bg-yellow-600/30 rounded"></div>
            <div className="h-[2px] bg-yellow-600/30 rounded"></div>
          </div>

          <div className="relative z-10 flex justify-between items-end">
            <div>
              <div className="text-sm font-mono tracking-widest text-gray-900 font-bold">•••• •••• •••• 7890</div>
              <div className="text-[10px] font-bold text-gray-800 mt-1 uppercase">Michael Johnson</div>
            </div>
            <div className="text-[10px] font-bold text-gray-800">03/30</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-5 gap-1.5 text-center mt-1">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button key={idx} className="flex flex-col items-center gap-1.5 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 group-hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-sm transition-all">
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-semibold text-gray-500">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Active Users (Ads section) */}
      <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <h3 className="text-xs font-bold text-gray-800">Live active users</h3>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Activity size={12} className="text-[#5cb85c]" />
            <span className="text-xs font-bold text-gray-700 font-mono">{liveCount.toLocaleString()}+</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-2 overflow-hidden py-1">
          {activeAvatars.map((person, idx) => (
            <div 
              key={person.id} 
              className="flex flex-col items-center gap-1 cursor-pointer group animate-fade-in transition-all duration-500"
              style={{
                animation: idx === 0 ? 'slideInFromLeft 0.5s ease-out forwards' : 'none'
              }}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Image src={person.url} alt="User Avatar" fill className="object-cover" sizes="32px" />
              </div>
            </div>
          ))}
          {/* Custom style for slide animation */}
          <style jsx>{`
            @keyframes slideInFromLeft {
              0% { transform: translateX(-20px) scale(0.5); opacity: 0; }
              100% { transform: translateX(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
