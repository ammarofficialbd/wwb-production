"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Hash,
  Globe,
  Lock,
  Plus,
  Send,
  Users,
  Bell,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  UserPlus,
  Settings,
  LogOut,
  Smile,
  Loader2,
  MessageCircle,
  Crown,
  Info,
  MoreHorizontal,
  AtSign,
  Zap,
  Paperclip,
  Mic,
  Star,
  Inbox,
  FileText,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase Realtime client (discussions project) ───────────────────────────
const supabaseDiscussion = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Channel {
  id: string;
  name: string;
  description?: string;
  type: "global" | "private";
  createdBy: string;
  createdAt: string;
}

interface Message {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarId: number;
  content: string;
  createdAt: string;
}

interface Member {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarId: number;
  role: "admin" | "member";
  joinedAt: string;
}

interface Invitation {
  id: string;
  channelId: string;
  inviterId: string;
  inviterUsername: string;
  inviteeId: string;
  status: string;
  channel?: { name: string; description?: string };
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarColors = [
  "#ff751f", "#0FDE75", "#6366f1", "#ec4899", "#14b8a6",
  "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#10b981",
];

function UserAvatar({ username, avatarId, size = 8, imgUrl }: { username: string; avatarId?: number; size?: number; imgUrl?: string }) {
  const color = avatarColors[(avatarId || 0) % avatarColors.length];
  
  if (imgUrl) {
    return (
      <img 
        src={imgUrl} 
        alt={username} 
        className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
        style={{ width: size * 4, height: size * 4 }}
      />
    );
  }

  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: color, width: size * 4, height: size * 4, fontSize: size * 1.5 }}
    >
      {username?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

// ─── Time format ──────────────────────────────────────────────────────────────
function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Main DiscussionPage ───────────────────────────────────────────────────────
export default function DiscussionPage() {
  const { user } = useAuth();

  const [globalChannel, setGlobalChannel] = useState<Channel | null>(null);
  const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
  const [ownedCount, setOwnedCount] = useState(0);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [globalMembers, setGlobalMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  
  const [messageInput, setMessageInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState("Info");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Load channels ────────────────────────────────────────────────────────────
  const loadChannels = useCallback(async () => {
    if (!user) return;
    setChannelsLoading(true);
    const res = await fetch("/api/discussion/channels");
    if (res.ok) {
      const data = await res.json();
      setGlobalChannel(data.globalChannel);
      setPrivateChannels(data.privateChannels || []);
      setOwnedCount(data.ownedCount || 0);
      if (!activeChannel && data.globalChannel) {
        setActiveChannel(data.globalChannel);
      }
    }
    setChannelsLoading(false);
  }, [user, activeChannel]);

  useEffect(() => { loadChannels(); }, [user]);

  // ── Load messages ────────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (channelId: string) => {
    setMessagesLoading(true);
    const res = await fetch(`/api/discussion/channels/${channelId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
    setMessagesLoading(false);
  }, []);

  // ── Load members ────────────────────────────────────────────────────────────
  const loadMembers = useCallback(async (channelId: string) => {
    const res = await fetch(`/api/discussion/channels/${channelId}/members`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members || []);
    }
  }, []);

  // ── Load global members for invite ──────────────────────────────────────────
  const loadGlobalMembers = useCallback(async () => {
    if (!globalChannel) return;
    const res = await fetch(`/api/discussion/channels/${globalChannel.id}/members`);
    if (res.ok) {
      const data = await res.json();
      setGlobalMembers(data.members || []);
    }
  }, [globalChannel]);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
      loadMembers(activeChannel.id);
    }
  }, [activeChannel, loadMessages, loadMembers]);

  // ── Real-time subscription ────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeChannel) return;

    const channel = supabaseDiscussion
      .channel(`messages:${activeChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channelId=eq.${activeChannel.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabaseDiscussion.removeChannel(channel);
    };
  }, [activeChannel]);

  // ── Switch channel ────────────────────────────────────────────────────────────
  const switchChannel = (channel: Channel) => {
    setActiveChannel(channel);
    setMessages([]);
    setMembers([]);
  };

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChannel || sendingMsg) return;
    setSendingMsg(true);
    const content = messageInput.trim();
    setMessageInput("");

    await fetch(`/api/discussion/channels/${activeChannel.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSendingMsg(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#f8f9fa]">
        <div className="text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-sm max-w-sm">
          <MessageCircle size={48} className="mx-auto mb-4" style={{ color: "#0FDE75" }} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Join the Discussion</h2>
          <p className="text-gray-500 text-sm">Please log in to access channels and discussions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[600px] w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 text-[#191B1C] font-sans">
      {/* ── LEFT SIDEBAR ───────────────────────────────────────────────────────── */}
      <div className="w-64 shrink-0 flex flex-col bg-white border-r border-gray-100">
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#0FDE75] transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Top Links */}
        <div className="px-3 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Sparkles size={16} />
            Assistant <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-600">NEW</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <FileText size={16} /> Drafts
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Bookmark size={16} /> Saved items
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Inbox size={16} /> Inbox
            <span className="ml-auto text-xs font-semibold text-gray-500">8</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <MessageCircle size={16} /> Direct messages
            <span className="ml-auto text-xs font-semibold text-gray-500">1</span>
          </button>
        </div>

        {/* Favorites */}
        <div className="px-3 mt-6">
          <button
            onClick={() => setFavoritesOpen(!favoritesOpen)}
            className="w-full flex items-center justify-between px-3 py-1 mb-1 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <span className="text-xs font-semibold">Favorites</span>
            {favoritesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {favoritesOpen && (
            <div className="space-y-0.5 mt-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <UserAvatar username="Sophia" size={5} /> Sophia Wilson
                <span className="ml-auto text-xs text-gray-400">2</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <Hash size={15} /> Front-end
                <span className="ml-auto text-xs text-gray-400">4</span>
              </button>
            </div>
          )}
        </div>

        {/* Channels list */}
        <div className="px-3 mt-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between px-3 mb-1">
            <button
              onClick={() => setChannelsOpen(!channelsOpen)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <span className="text-xs font-semibold">Channels</span>
            </button>
            <button className="text-gray-400 hover:text-gray-800"><Plus size={14}/></button>
          </div>

          {channelsOpen && (
            <div className="space-y-0.5 mt-1">
              {/* Global Channel */}
              {globalChannel && (
                <button
                  onClick={() => switchChannel(globalChannel)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeChannel?.id === globalChannel.id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Hash size={15} /> General
                  <span className="ml-auto text-xs text-gray-400">1</span>
                </button>
              )}
              
              {/* Private Channels Loop */}
              {privateChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => switchChannel(ch)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeChannel?.id === ch.id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Hash size={15} /> {ch.name}
                  {activeChannel?.id === ch.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#0FDE75" }} />
                  )}
                </button>
              ))}
              
              {/* Mock sub-channels for visual parity with image */}
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <Hash size={15} /> Website
              </button>
              <div className="ml-6 border-l border-gray-200 pl-2 mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  <span className="text-orange-500">💥</span> v3.0
                </button>
                <div className="ml-4 border-l border-gray-200 pl-2 space-y-0.5">
                  <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                    <span className="w-2 border-t border-gray-300"></span> Wireframe
                  </button>
                  <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                    <span className="w-2 border-t border-gray-300"></span> Design
                  </button>
                  <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium bg-gray-200/50 text-gray-900 transition-colors">
                    <span className="w-2 border-t border-gray-300"></span> UI-kit design
                  </button>
                </div>
                <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                  <Hash size={13} /> v2.0 - actual version
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CHAT ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white border-r border-gray-100">
        {/* Channel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Hash size={18} className="text-gray-400" />
              {activeChannel?.name || "UI-kit design"}
              <span className="text-gray-300 mx-1">/</span>
              <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                <Bookmark size={14} className="text-gray-400"/>
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-gray-600"><Users size={18} /></button>
            <button className="hover:text-gray-600"><MoreHorizontal size={18} /></button>
            <button className="hover:text-gray-600"><Info size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {messagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-gray-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-50 border border-gray-100">
                <Hash size={28} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-800 text-lg mb-1">
                Welcome to #{activeChannel?.name || "General"}!
              </p>
              <p className="text-gray-500 text-sm max-w-xs">
                This is the beginning of the discussion. Start chatting below!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const showHeader = !prevMsg || prevMsg.userId !== msg.userId ||
                  new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60000;

                return (
                  <div key={msg.id} className={`flex gap-4 group ${!showHeader ? "-mt-4" : ""}`}>
                    {showHeader ? (
                      <UserAvatar username={msg.username} avatarId={msg.avatarId} size={10} />
                    ) : (
                      <div className="w-10 shrink-0" />
                    )}
                    <div className="flex-1">
                      {showHeader && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{msg.username}</span>
                          <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                        </div>
                      )}
                      <div className="text-gray-700 text-[15px] leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        <div className="px-6 py-4 pb-6 bg-white">
          <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm focus-within:border-[#0FDE75] transition-colors overflow-hidden">
            <textarea
              ref={inputRef}
              rows={2}
              className="w-full bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none resize-none p-4 min-h-[80px]"
              placeholder={`Message #${activeChannel?.name || "General"}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50/50 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><AtSign size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Zap size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Smile size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Paperclip size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Mic size={18} /></button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setMessageInput("")}
                  className="px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sendingMsg}
                  className="px-5 py-1.5 text-sm font-semibold text-gray-900 rounded-lg transition-all disabled:opacity-50 shadow-sm"
                  style={{ background: "#0FDE75" }}
                >
                  {sendingMsg ? <Loader2 size={16} className="animate-spin inline" /> : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Info) ─────────────────────────────────────────────────── */}
      <div className="hidden xl:flex flex-col w-80 shrink-0 bg-white">
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-gray-100">
          {["Info", "Pins", "Files", "Links"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRightTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeRightTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {activeRightTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ background: "#0FDE75" }} />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden">
          {/* Main Info */}
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-4">Main info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><UserAvatar username="Creator" size={4}/> Creator</span>
                <span className="font-medium text-gray-900 flex items-center gap-2">
                  <UserAvatar username="Andrew M." size={5}/> Andrew M.
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Settings size={14}/> Date of creation</span>
                <span className="font-medium text-gray-900">
                  {activeChannel ? formatDate(activeChannel.createdAt) : "28 May"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Sparkles size={14}/> Status</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(15,222,117,0.15)", color: "#0abf62" }}>
                  • Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Hash size={14}/> Tags</span>
                <span className="font-medium text-gray-400 flex items-center gap-1">13 <ChevronRight size={14}/></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Check size={14}/> Tasks</span>
                <span className="font-medium text-gray-400 flex items-center gap-1">4 <ChevronRight size={14}/></span>
              </div>
            </div>
          </div>

          {/* Linked threads */}
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-3">Linked threads</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Hash size={14}/> Front-end</span>
                <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded font-medium">4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Hash size={14}/> UI-kit design standards</span>
              </div>
            </div>
          </div>

          {/* Thread activity */}
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-3">Thread activity</h3>
            <div className="flex gap-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex-1 h-2 rounded-sm" style={{ background: i < 8 ? "#0FDE75" : "rgba(15,222,117,0.2)", opacity: i > 10 ? 0.3 : 1 }} />
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-[15px]">Members <span className="text-gray-400 font-normal">{members.length || 9}</span></h3>
              <div className="flex gap-2 text-gray-400">
                <button className="hover:text-gray-600"><Plus size={16}/></button>
                <button className="hover:text-gray-600"><Settings size={16}/></button>
              </div>
            </div>
            
            <div className="space-y-4">
              {members.length > 0 ? members.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <UserAvatar username={m.username} avatarId={m.avatarId} size={8}/>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{m.username}</p>
                    <p className="text-xs text-gray-400 capitalize">{m.role}</p>
                  </div>
                  {m.role === "admin" && (
                     <span className="text-[10px] font-bold px-2 py-0.5 rounded text-gray-600 bg-gray-100">Admin</span>
                  )}
                </div>
              )) : (
                <>
                  <div className="flex items-center gap-3">
                    <UserAvatar username="Daniel" size={8}/>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Daniel Anderson</p>
                      <p className="text-xs text-gray-400">Art director</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-green-700 bg-green-100">Design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserAvatar username="Andrew" size={8}/>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Andrew Miller</p>
                      <p className="text-xs text-gray-400">Product owner</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-orange-700 bg-orange-100">Management</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
