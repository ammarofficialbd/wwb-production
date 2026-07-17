"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  X, MoreHorizontal, Plus, Filter, Clock, UserPlus, FileText, 
  RefreshCw, VolumeX, MailOpen, Archive, Trash2, Send, HelpCircle 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ChatPanel() {
  const { showChatPanel, setShowChatPanel } = useAuth();
  const [activeTab, setActiveTab] = useState<"Active" | "Archived">("Active");
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptionsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chatList = [
    {
      id: 1,
      name: "(207) 555-0119",
      time: "10:14",
      lastMsg: "Hi this is retail store X thanks for contacting us. Stdrd rates apply. te...",
      unread: false,
    },
    {
      id: 2,
      name: "Eleanor Pena",
      time: "09:52",
      lastMsg: "Though this is an automated text, we're fellow humans here at Clerk c...",
      unread: false,
      isMuted: true,
      online: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      active: true,
    },
    {
      id: 3,
      name: "(406) 555-0120",
      time: "09:20",
      lastMsg: "Hi Erik, It was a pleasure to speak!",
      unread: false,
    },
    {
      id: 4,
      name: "(844) 670-2672",
      time: "11.08.22",
      lastMsg: "clerk-chat.slack.com Slack login code: 171416",
      unread: false,
    },
    {
      id: 5,
      name: "Jane Carter",
      time: "09:16",
      lastMsg: "thanks & have a great day!",
      unread: false,
      statusColor: "bg-amber-400",
    },
    {
      id: 6,
      name: "Jane Cooper",
      time: "09:12",
      lastMsg: "Though this is an automated text, we're fellow humans here ...",
      unread: true,
      isMuted: true,
      online: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 7,
      name: "Marvin McKinney",
      time: "08:44",
      lastMsg: "Hi your renewal is due - please pay here to receive shipment: https://...",
      unread: false,
      statusColor: "bg-blue-500",
    },
    {
      id: 8,
      name: "Alicia",
      time: "11.08.22",
      lastMsg: "Gracias !",
      unread: true,
      isMuted: true,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    },
    {
      id: 9,
      name: "Dimitar",
      time: "10.21.22",
      lastMsg: "Use verification code 327178 for Microsoft authentication.",
      unread: false,
    },
  ];

  return (
    <>
      {/* Dark overlay backdrop */}
      <div 
        onClick={() => setShowChatPanel(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          showChatPanel ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in Chat Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-[#fafafa] z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col w-full max-w-[950px] ${
          showChatPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Main Panel Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Close drawer button (Floating / absolute overlay) */}
          <button 
            onClick={() => setShowChatPanel(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full border border-gray-100 shadow-md text-gray-400 hover:text-gray-600 hover:scale-105 transition-all"
            title="Close Panel"
          >
            <X size={18} />
          </button>

          {/* ── LEFT PANEL: Chat Inbox List ── */}
          <div className="w-[320px] shrink-0 border-r border-gray-100 flex flex-col bg-white">
            
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍💻</span>
                <h2 className="text-sm font-extrabold text-gray-800">Best clients</h2>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <MoreHorizontal size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Toggle Filters */}
            <div className="p-3 flex items-center gap-2 border-b border-gray-50">
              <div className="flex bg-gray-50 p-0.5 rounded-lg flex-1">
                <button 
                  onClick={() => setActiveTab("Active")}
                  className={`flex-1 text-center py-1 text-[11px] font-bold rounded-md transition-all ${
                    activeTab === "Active" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setActiveTab("Archived")}
                  className={`flex-1 text-center py-1 text-[11px] font-bold rounded-md transition-all ${
                    activeTab === "Archived" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Archived
                </button>
              </div>
              <button className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100/70 border border-gray-100 shrink-0">
                <Filter size={13} />
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {chatList.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`p-3.5 flex gap-3 cursor-pointer hover:bg-gray-50/60 transition-colors ${
                    chat.active ? "bg-gray-50" : ""
                  }`}
                >
                  {/* Left avatar block */}
                  <div className="relative shrink-0">
                    {chat.avatar ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-100">
                        <Image src={chat.avatar} alt={chat.name} fill className="object-cover" sizes="36px" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">
                        {chat.name.charAt(0) === "(" ? "#" : chat.name.charAt(0)}
                      </div>
                    )}
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold text-gray-800 truncate flex items-center gap-1">
                        {chat.name}
                        {chat.isMuted && <span className="text-[10px] text-gray-400">🔇</span>}
                      </h4>
                      <span className="text-[9px] font-semibold text-gray-400 shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-[10.5px] font-medium text-gray-400 truncate leading-snug">
                      {chat.lastMsg}
                    </p>
                  </div>

                  {/* Status/Unread dots */}
                  {chat.unread && (
                    <div className="flex items-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    </div>
                  )}
                  {chat.statusColor && !chat.unread && (
                    <div className="flex items-center shrink-0">
                      <span className={`w-2 h-2 rounded-full ${chat.statusColor}`}></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL: Conversation Thread ── */}
          <div className="flex-1 flex flex-col bg-white border-l border-gray-50 h-full">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                    alt="Eleanor Pena" 
                    fill 
                    className="object-cover" 
                    sizes="32px"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-850">Eleanor Pena</h3>
                  <span className="text-[9px] font-bold text-green-500 block">Online</span>
                </div>
              </div>

              {/* Actions Header Bar */}
              <div className="flex items-center gap-1.5 pr-14">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" title="Call Logs">
                  <Clock size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" title="Add members">
                  <UserPlus size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" title="Card Info">
                  <FileText size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" title="Reassign">
                  <RefreshCw size={15} />
                </button>

                {/* Dropdown Options */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {showOptionsDropdown && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg w-[140px] z-50 py-1.5 text-[11px] font-bold text-gray-700">
                      <button className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2">
                        <VolumeX size={12} className="text-gray-400" />
                        <span>Unmute</span>
                      </button>
                      <button className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2">
                        <MailOpen size={12} className="text-gray-400" />
                        <span>Mark unread</span>
                      </button>
                      <button className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 flex items-center gap-2">
                        <Archive size={12} className="text-gray-400" />
                        <span>Archive</span>
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 text-red-500 flex items-center gap-2">
                        <Trash2 size={12} className="text-red-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/40">
              
              {/* Date banner */}
              <div className="flex justify-center my-1">
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100/60 px-3 py-1 rounded-full">
                  Today, 6 February
                </span>
              </div>

              {/* Eleanor Message */}
              <div className="flex gap-2 items-start max-w-[80%] self-start">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-150 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                    alt="Eleanor Pena" 
                    fill 
                    className="object-cover" 
                    sizes="28px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5">
                    Eleanor Pena <span className="font-normal text-gray-300">4:58 PM</span>
                  </span>
                  <div className="bg-[#fff7ea] border border-amber-100/40 text-xs font-medium text-gray-700 p-2.5 rounded-2xl rounded-tl-none shadow-sm">
                    Is anyone home? 🧐🧐🧐
                  </div>
                </div>
              </div>

              {/* David Message */}
              <div className="flex gap-2 items-start max-w-[80%] self-end flex-row-reverse">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-150 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" 
                    alt="David Letterman" 
                    fill 
                    className="object-cover" 
                    sizes="28px"
                  />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5 flex-row-reverse">
                    David Letterman <span className="font-normal text-gray-300">5:14 PM</span>
                  </span>
                  <div className="bg-[#eaf5ff] border border-blue-100/40 text-xs font-medium text-gray-700 p-2.5 rounded-2xl rounded-tr-none shadow-sm leading-relaxed">
                    Eleanor, hello! 👋 Thanks for your message. We typically reply back within 2-3 hours during business hours. We&apos;ll be in touch as soon possible!
                  </div>
                </div>
              </div>

              {/* Eleanor Message 2 */}
              <div className="flex gap-2 items-start max-w-[80%] self-start">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-150 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                    alt="Eleanor Pena" 
                    fill 
                    className="object-cover" 
                    sizes="28px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5">
                    Eleanor Pena <span className="font-normal text-gray-300">5:15 PM</span>
                  </span>
                  <div className="bg-[#fff7ea] border border-amber-100/40 text-xs font-medium text-gray-700 p-2.5 rounded-2xl rounded-tl-none shadow-sm leading-relaxed">
                    I saw that Clerk has two subscription plans. Before I continue, I would like to know more about the plans
                  </div>
                </div>
              </div>

              {/* David Message 2 + Calendly Embed */}
              <div className="flex gap-2 items-start max-w-[80%] self-end flex-row-reverse">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-150 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" 
                    alt="David Letterman" 
                    fill 
                    className="object-cover" 
                    sizes="28px"
                  />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5 flex-row-reverse">
                    David Letterman <span className="font-normal text-gray-300">5:23 PM</span>
                  </span>
                  <div className="bg-[#eaf5ff] border border-blue-100/40 text-xs font-medium text-gray-700 p-2.5 rounded-2xl rounded-tr-none shadow-sm leading-relaxed mb-2">
                    Eleanor, do you need help? We could schedule a free call! Take your time and choose a free date — <a href="#" className="text-purple-600 underline font-semibold break-all">https://calendly.com/hc/en-us/requests/new?_ga=2.130074319.1923236466.1668591153</a>
                  </div>

                  {/* Calendly Card Container */}
                  <div className="w-full max-w-[320px] bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-start gap-2 relative">
                    <button className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
                      <X size={12} />
                    </button>
                    <span className="text-xl pt-0.5">🗓️</span>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-blue-500">Calendly.com</h4>
                      <p className="text-[10px] font-bold text-purple-600 mt-0.5">Calendly | Schedule a free call</p>
                      <p className="text-[9px] text-gray-400 font-semibold leading-normal mt-1">
                        Calendly is the modern scheduling platform that makes &ldquo;finding time&rdquo; a breeze. When connecting is easy, your teams can get more done.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Message Input Box Footer */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="border border-purple-400 rounded-xl p-2.5 flex items-center gap-2 bg-[#fdfcff] shadow-sm">
                <button className="p-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-lg shrink-0">
                  <Plus size={16} />
                </button>
                <textarea 
                  className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-gray-700 placeholder-gray-400 resize-none h-[40px] leading-relaxed"
                  defaultValue="Or you can simply get in touch with my colleague @JasonBrant He's our Sales Manager. Jason can tell you more about subscription plans."
                />
                <button className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shrink-0 shadow-md">
                  <Send size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
