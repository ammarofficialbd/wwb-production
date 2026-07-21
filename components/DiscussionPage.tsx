"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Hash,
  Globe,
  Plus,
  Users,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  Smile,
  Loader2,
  MessageCircle,
  Info,
  MoreHorizontal,
  AtSign,
  Zap,
  Paperclip,
  Mic,
  Bookmark,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import { AVATAR_URLS } from "@/lib/avatars";
import { sortedKeywords } from "@/lib/businessKeywords";
import Link from "next/link";

// ─── Article type ─────────────────────────────────────────────────────────────
interface Article {
  id: string;
  title: string;
  slug: string;
  intro: string;
  main_image: string;
  category_name: string;
  published_at: string;
}

// ─── Keyword Popup ────────────────────────────────────────────────────────────
function KeywordChip({ word, isOwn }: { word: string; isOwn: boolean }) {
  const [show, setShow] = useState(false);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(async () => {
      setShow(true);
      if (articles === null) {
        setLoading(true);
        try {
          const res = await fetch(`/api/articles/search?keyword=${encodeURIComponent(word)}`);
          const data = await res.json();
          setArticles(data.articles || []);
        } catch {
          setArticles([]);
        } finally {
          setLoading(false);
        }
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShow(false);
  };

  return (
    <span className="relative inline-block" ref={chipRef}>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`font-bold px-1.5 py-0.5 rounded mx-0.5 inline-block cursor-pointer underline decoration-dotted underline-offset-2 transition-all
          ${isOwn
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-[rgba(15,222,117,0.15)] text-[#0abf62] hover:bg-[rgba(15,222,117,0.28)]"
          }`}
      >
        {word}
      </span>
      {show && (
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={handleMouseLeave}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ minWidth: 260 }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-50 bg-gradient-to-r from-[#f0fdf4] to-white">
            <p className="text-xs font-bold text-[#0abf62] uppercase tracking-wide">📰 Related Articles</p>
            <p className="text-[11px] text-gray-400 mt-0.5">on &quot;{word}&quot;</p>
          </div>
          <div className="p-2 flex flex-col gap-2">
            {loading ? (
              // Skeleton
              [1,2].map(i => (
                <div key={i} className="flex gap-2 p-2 animate-pulse">
                  <div className="w-12 h-10 rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5 justify-center">
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                    <div className="h-2 bg-gray-100 rounded w-3/5" />
                  </div>
                </div>
              ))
            ) : articles && articles.length > 0 ? (
              articles.map(a => (
                <Link
                  key={a.id}
                  href={`/my-feed/${a.slug}`}
                  target="_blank"
                  className="flex gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  {a.main_image && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={a.main_image} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#0abf62] transition-colors">{a.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{a.category_name}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-3">No articles found for this keyword.</p>
            )}
          </div>
        </div>
      )}
    </span>
  );
}

// ─── Tokenize message text into segments (plain text vs keyword) ───────────────
function tokenizeMessage(text: string): Array<{ type: "text" | "keyword"; value: string }> {
  const tokens: Array<{ type: "text" | "keyword"; value: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;
    for (const kw of sortedKeywords) {
      const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
      if (idx === -1) continue;

      // Check word boundaries (simple: char before/after must not be alpha)
      const before = idx === 0 ? " " : remaining[idx - 1];
      const after = idx + kw.length >= remaining.length ? " " : remaining[idx + kw.length];
      const isBoundaryBefore = /[^a-zA-Z0-9]/.test(before);
      const isBoundaryAfter = /[^a-zA-Z0-9]/.test(after);

      if (!isBoundaryBefore || !isBoundaryAfter) continue;

      // Add preceding plain text
      if (idx > 0) {
        tokens.push({ type: "text", value: remaining.slice(0, idx) });
      }
      tokens.push({ type: "keyword", value: remaining.slice(idx, idx + kw.length) });
      remaining = remaining.slice(idx + kw.length);
      matched = true;
      break;
    }
    if (!matched) {
      tokens.push({ type: "text", value: remaining });
      remaining = "";
    }
  }
  return tokens;
}

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
  _optimistic?: boolean; // local only flag
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarColors = [
  "#ff751f", "#0FDE75", "#6366f1", "#ec4899", "#14b8a6",
  "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#10b981",
];

function UserAvatar({ username, avatarId, size = 8 }: { username: string; avatarId?: number; size?: number }) {
  const url = avatarId !== undefined && avatarId >= 0 && avatarId < AVATAR_URLS.length ? AVATAR_URLS[avatarId] : null;

  if (url) {
    return (
      <div 
        className="rounded-full overflow-hidden relative shrink-0" 
        style={{ width: size * 4, height: size * 4 }}
      >
        <Image src={url} alt={username} fill className="object-cover" unoptimized />
      </div>
    );
  }

  const color = avatarColors[(avatarId || 0) % avatarColors.length];
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
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

  const [messageInput, setMessageInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState("Info");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [creatingChannel, setCreatingChannel] = useState(false);
  
  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPos, setEmojiPickerPos] = useState({ top: 0, left: 0 });
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sseRef = useRef<EventSource | null>(null);
  const activeChannelRef = useRef<Channel | null>(null);

  // Keep ref in sync
  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Load channels ────────────────────────────────────────────────────────────
  const loadChannels = useCallback(async () => {
    if (!user) return;
    setChannelsLoading(true);
    try {
      const res = await fetch("/api/discussion/channels");
      if (res.ok) {
        const data = await res.json();
        const loadedGlobal =
          data.globalChannel ||
          ({ id: "global", name: "Global", type: "global", createdBy: "", createdAt: new Date().toISOString() } as Channel);
        setGlobalChannel(loadedGlobal);
        setPrivateChannels(data.privateChannels || []);
        setOwnedCount(data.ownedCount || 0);
        // Auto-select global on first load
        if (!activeChannelRef.current) {
          setActiveChannel(loadedGlobal);
        }
      }
    } catch {}
    setChannelsLoading(false);
  }, [user]);

  useEffect(() => { loadChannels(); }, [user]);

  // ── Load messages ────────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (channelId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/discussion/channels/${channelId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
    setMessagesLoading(false);
  }, []);

  // ── Load members ────────────────────────────────────────────────────────────
  const loadMembers = useCallback(async (channelId: string) => {
    setMembersLoading(true);
    try {
      const res = await fetch(`/api/discussion/channels/${channelId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch {}
    setMembersLoading(false);
  }, []);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
      loadMembers(activeChannel.id);
    }
  }, [activeChannel, loadMessages, loadMembers]);

  // ── SSE Real-time connection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!activeChannel) return;

    // Close existing SSE
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }

    const channelId = activeChannel.id;
    const es = new EventSource(`/api/discussion/channels/${channelId}/stream`);
    sseRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "message" && payload.message) {
          const newMsg: Message = payload.message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            // Replace any matching optimistic message
            const withoutOptimistic = prev.filter(
              (m) => !(m._optimistic && m.content === newMsg.content && m.userId === newMsg.userId)
            );
            return [...withoutOptimistic, newMsg];
          });
        }
      } catch {}
    };

    es.onerror = () => {
      // SSE will auto-reconnect; no action needed
    };

    return () => {
      es.close();
      sseRef.current = null;
    };
  }, [activeChannel]);

  // ── Switch channel ────────────────────────────────────────────────────────────
  const switchChannel = (channel: Channel) => {
    setActiveChannel(channel);
    setMessages([]);
    setMembers([]);
    setSendError(null);
  };

  // ── Create Channel ────────────────────────────────────────────────────────────
  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || creatingChannel) return;
    setCreatingChannel(true);
    try {
      const res = await fetch("/api/discussion/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChannelName, description: newChannelDesc }),
      });
      const data = await res.json();
      if (res.ok && data.channel) {
        setIsCreateModalOpen(false);
        setNewChannelName("");
        setNewChannelDesc("");
        await loadChannels();
        switchChannel(data.channel);
      } else {
        alert(data.error || "Failed to create channel");
      }
    } catch {
      alert("Network error creating channel");
    } finally {
      setCreatingChannel(false);
    }
  };

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChannel || sendingMsg) return;

    const content = messageInput.trim();
    setSendError(null);
    setMessageInput("");

    // Optimistic: add message immediately
    const optimisticId = `opt-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      channelId: activeChannel.id,
      userId: String(user!.id),
      username: user!.username,
      avatarId: user!.avatarId || 0,
      content,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setSendingMsg(true);

    try {
      const res = await fetch(`/api/discussion/channels/${activeChannel.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // Roll back optimistic message
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setMessageInput(content);
        setSendError(data.error || "Failed to send message. Please try again.");
      }
      // If ok: SSE will replace the optimistic message with the real one
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setMessageInput(content);
      setSendError("Network error. Please check your connection.");
    } finally {
      setSendingMsg(false);
      inputRef.current?.focus();
    }
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

  // Calculate emoji picker position from button
  const openEmojiPicker = () => {
    if (emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      setEmojiPickerPos({
        top: rect.top - 410,
        left: Math.min(rect.left, window.innerWidth - 330),
      });
    }
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 text-[#191B1C] font-sans relative">

      {/* ── MOBILE OVERLAY ─────────────────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR ───────────────────────────────────────────────────────── */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full z-40 md:z-auto
          w-72 md:w-64 shrink-0 flex flex-col bg-white border-r border-gray-100
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

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
            <button
              onClick={() => {
                if (ownedCount >= 2) {
                  alert("You can only create up to 2 private channels.");
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="text-gray-400 hover:text-gray-800 transition-colors"
              title="Create channel"
            >
              <Plus size={14} />
            </button>
          </div>

          {channelsOpen && (
            <div className="space-y-0.5 mt-1">
              {channelsLoading ? (
                <div className="px-3 py-2 flex flex-col gap-2.5 animate-pulse">
                  {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[15px] h-[15px] rounded shimmer" />
                  <div className="h-3 rounded shimmer" style={{ width: `${70 - i * 15}%` }} />
                </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Global Channel — always visible */}
                  <button
                    onClick={() => switchChannel(globalChannel || { id: "global", name: "Global", type: "global", createdBy: "", createdAt: new Date().toISOString() })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeChannel?.type === "global"
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Globe size={15} style={{ color: "#0FDE75" }} />
                    <span className="font-semibold">Global</span>
                  </button>

                  {/* Private Channels */}
                  {privateChannels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => switchChannel(ch)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeChannel?.id === ch.id
                          ? "bg-gray-100 text-gray-900 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Hash size={15} /> {ch.name}
                      {activeChannel?.id === ch.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#0FDE75" }} />
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── MAIN CHAT ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white border-r border-gray-100 min-w-0 overflow-hidden">
        {/* Channel header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger menu (mobile) */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open channels"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              {activeChannel?.type === "global" ? (
                <Globe size={18} style={{ color: "#0FDE75" }} />
              ) : (
                <Hash size={18} className="text-gray-400" />
              )}
              {activeChannel?.type === "global" ? "Global" : activeChannel?.name || "Select a channel"}
            </h2>
            {activeChannel?.type === "global" && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(15,222,117,0.15)", color: "#0abf62" }}>
                Everyone
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-gray-400">
            <span className="hidden sm:inline text-xs text-gray-400">{members.length > 0 ? `${members.length} members` : ""}</span>
            <button className="hover:text-gray-600"><Users size={18} /></button>
            <button className="hover:text-gray-600"><MoreHorizontal size={18} /></button>
            <button className="hover:text-gray-600"><Info size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {!activeChannel ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
              <Globe size={40} className="text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm">Select a channel to start chatting</p>
            </div>
          ) : messagesLoading ? (
            <div className="flex flex-col gap-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full shimmer shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-24 rounded shimmer" />
                      <div className="h-2.5 w-12 rounded shimmer" />
                    </div>
                    <div className="h-3.5 rounded shimmer" style={{ width: `${85 - (i % 3) * 18}%` }} />
                    {i % 2 === 0 && <div className="h-3.5 rounded shimmer" style={{ width: `${55 - (i % 2) * 10}%` }} />}
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-50 border border-gray-100">
                {activeChannel.type === "global" ? (
                  <Globe size={28} style={{ color: "#0FDE75" }} />
                ) : (
                  <Hash size={28} className="text-gray-300" />
                )}
              </div>
              <p className="font-bold text-gray-800 text-lg mb-1">
                Welcome to {activeChannel.type === "global" ? "Global" : `#${activeChannel.name}`}!
              </p>
              <p className="text-gray-500 text-sm max-w-xs">
                {activeChannel.type === "global"
                  ? "This is the global discussion space. Everyone can chat here!"
                  : "This is the beginning of the channel. Start the conversation!"}
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const isOwn = String(user?.id) === msg.userId;
                const showHeader =
                  !prevMsg ||
                  prevMsg.userId !== msg.userId ||
                  new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60000;



                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 group ${!showHeader ? "-mt-2" : ""} ${msg._optimistic ? "opacity-60" : ""} ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {showHeader ? (
                      <UserAvatar username={msg.username} avatarId={msg.avatarId} size={10} />
                    ) : (
                      <div className="shrink-0" style={{ width: 40 }} />
                    )}
                    <div className={`flex-1 min-w-0 flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                      {showHeader && (
                        <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <span className="font-bold text-gray-900 text-sm">{msg.username}</span>
                          <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                          {msg._optimistic && (
                            <span className="text-xs text-gray-400 italic">sending...</span>
                          )}
                        </div>
                      )}
                      <div className={`text-[15px] leading-relaxed break-words px-4 py-3 rounded-2xl shadow-sm max-w-[85%] 
                        ${isOwn 
                          ? "bg-[#06715b] text-white rounded-tr-sm text-right" 
                          : "bg-white text-gray-700 rounded-tl-sm text-left border border-gray-50"
                        }`}
                      >
                        {tokenizeMessage(msg.content).map((token, ti) =>
                          token.type === "keyword" ? (
                            <KeywordChip key={ti} word={token.value} isOwn={isOwn} />
                          ) : (
                            <span key={ti}>{token.value}</span>
                          )
                        )}
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
        <div className="px-3 md:px-6 py-4 pb-4 md:pb-6 bg-white shrink-0">
          {sendError && (
            <div className="mb-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {sendError}
              <button onClick={() => setSendError(null)} className="ml-auto text-red-400 hover:text-red-600">
                <X size={12} />
              </button>
            </div>
          )}
          <div className={`flex flex-col bg-white rounded-xl border shadow-sm transition-colors overflow-hidden ${sendError ? "border-red-200" : "border-gray-200 focus-within:border-[#0FDE75]"}`}>
            <textarea
              ref={inputRef}
              rows={2}
              disabled={!activeChannel}
              className="w-full bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none resize-none p-4 min-h-[80px] disabled:cursor-not-allowed"
              placeholder={
                activeChannel
                  ? `Message ${activeChannel.type === "global" ? "Global" : `#${activeChannel.name}`}... (Enter to send)`
                  : "Select a channel to start chatting"
              }
              value={messageInput}
              onChange={(e) => { setMessageInput(e.target.value); setSendError(null); }}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50/50 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><AtSign size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Zap size={18} /></button>
                <button
                  ref={emojiButtonRef}
                  onClick={openEmojiPicker}
                  className={`p-2 rounded-lg transition-colors ${showEmojiPicker ? "text-gray-600 bg-gray-100" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                >
                  <Smile size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Paperclip size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Mic size={18} /></button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMessageInput(""); setSendError(null); }}
                  className="px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sendingMsg || !activeChannel}
                  className="px-5 py-1.5 text-sm font-semibold text-gray-900 rounded-lg transition-all disabled:opacity-40 shadow-sm flex items-center gap-2"
                  style={{ background: "#0FDE75" }}
                >
                  {sendingMsg ? <Loader2 size={16} className="animate-spin" /> : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EMOJI PICKER PORTAL ────────────────────────────────────────────────── */}
      {showEmojiPicker && typeof window !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowEmojiPicker(false)}
          />
          <div
            className="fixed z-[9999] shadow-2xl rounded-xl overflow-hidden"
            style={{
              top: emojiPickerPos.top,
              left: emojiPickerPos.left,
              width: 320,
            }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessageInput((prev) => prev + emojiData.emoji);
                setShowEmojiPicker(false);
                inputRef.current?.focus();
              }}
              width={320}
              height={400}
            />
          </div>
        </>,
        document.body
      )}

      {/* ── RIGHT PANEL (Info) ─────────────────────────────────────────────────── */}
      <div className="hidden xl:flex flex-col w-80 shrink-0 bg-white">
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-gray-100">
          {["Info", "Members"].map((tab) => (
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
          {activeRightTab === "Info" && (
            <>
              {/* Main Info */}
              <div>
                <h3 className="font-bold text-gray-900 text-[15px] mb-4">Channel Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {activeChannel?.type || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium text-gray-900">
                      {activeChannel ? formatDate(activeChannel.createdAt) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(15,222,117,0.15)", color: "#0abf62" }}>
                      • Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Messages</span>
                    <span className="font-medium text-gray-900">{messages.filter(m => !m._optimistic).length}</span>
                  </div>
                </div>
              </div>

              {/* Live indicator */}
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(15,222,117,0.08)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#0FDE75" }} />
                <span className="text-sm font-medium text-gray-700">Live discussion active</span>
              </div>
            </>
          )}

          {activeRightTab === "Members" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-[15px]">
                  Members <span className="text-gray-400 font-normal">{members.length}</span>
                </h3>
              </div>
              <div className="space-y-4">
                {membersLoading ? (
                  <div className="flex flex-col gap-4 animate-pulse">
                    {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full shimmer shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="h-3 rounded shimmer" style={{ width: `${60 - i * 8}%` }} />
                        <div className="h-2.5 rounded shimmer w-16" />
                      </div>
                    </div>
                    ))}
                  </div>
                ) : members.length > 0 ? (
                  members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <UserAvatar username={m.username} avatarId={m.avatarId} size={8} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{m.username}</p>
                      <p className="text-xs text-gray-400 capitalize">{m.role}</p>
                    </div>
                    {m.role === "admin" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-gray-600 bg-gray-100">Admin</span>
                    )}
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No members to show</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE CHANNEL MODAL ───────────────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Create Channel</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="mb-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
              You can create up to <strong>2 private channels</strong>. ({ownedCount}/2 used)
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. Marketing"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0FDE75]"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateChannel()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  placeholder="What's this channel about?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0FDE75]"
                />
              </div>
              <button
                onClick={handleCreateChannel}
                disabled={creatingChannel || !newChannelName.trim()}
                className="w-full py-2 rounded-lg font-semibold text-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "#0FDE75" }}
              >
                {creatingChannel ? <Loader2 size={16} className="animate-spin" /> : "Create Channel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
