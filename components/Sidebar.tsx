"use client";

import {
  Compass,
  ClipboardList,
  Award,
  BarChart2,
  Users,
  LayoutGrid,
  Rss,
  Gavel,
  MessageSquare,
  MessageCircle,
  HelpCircle,
  Settings,
  Layers,
  LogOut,
  UserCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainMenu = [
  { label: "Dashboard", icon: LayoutGrid, requiresAuth: false, href: "/" },
  { label: "My Feed", icon: Rss, requiresAuth: false, href: "/my-feed" },
  { label: "Bids", icon: Gavel, requiresAuth: false, href: "/bids" },
  { label: "Chat", icon: MessageSquare, requiresAuth: true, href: "/chat" },
  { label: "Discussion", icon: MessageCircle, requiresAuth: true, href: "/discussion" },
];

const settingsMenu = [
  { label: "Help Center", icon: HelpCircle },
  { label: "Setting", icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleSidebar, onCloseMobile }: SidebarProps) {
  const { user, setShowLoginModal, logout } = useAuth();
  const pathname = usePathname();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside 
      className={`shrink-0 bg-white p-6 flex flex-col transition-all duration-300 ease-in-out relative overflow-y-auto h-full w-[260px] lg:rounded-3xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
        isCollapsed ? "lg:w-[72px] items-center px-4" : "lg:w-[260px]"
      }`}
    >
      <div className={`flex items-center gap-2 mb-10 ${isCollapsed ? "justify-center" : ""}`}>
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-[var(--ink)] items-center justify-center text-white shrink-0 hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Layers size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={onCloseMobile}
          className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Close Mobile Sidebar"
        >
          <Layers size={18} strokeWidth={2.5} />
        </button>
        {!isCollapsed && <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">WWB</span>}
      </div>

      {!isCollapsed && (
        <p className="text-[11px] font-semibold tracking-widest text-[var(--muted)] mb-3">
          MAIN MENU
        </p>
      )}
      <nav className="flex flex-col gap-1 w-full">
        {mainMenu.map(({ label, icon: Icon, requiresAuth, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={(e) => handleNav(e, requiresAuth)}
              title={isCollapsed ? label : undefined}
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-2.5 rounded-xl text-sm font-medium text-left transition-colors w-full ${
                isActive
                  ? "bg-[var(--amber)] text-white shadow-sm shadow-amber-200"
                  : "text-[#5b5d76] hover:bg-[#f5f5fa]"
              }`}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <p className="text-[11px] font-semibold tracking-widest text-[var(--muted)] mt-8 mb-3">
          SETTINGS
        </p>
      )}
      <nav className={`flex flex-col gap-1 w-full ${isCollapsed ? "mt-8" : ""}`}>
        {settingsMenu.map(({ label, icon: Icon }) => (
          <button
            key={label}
            title={isCollapsed ? label : undefined}
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-2.5 rounded-xl text-sm font-medium text-left text-[#5b5d76] hover:bg-[#f5f5fa] transition-colors w-full`}
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Ads section */}
      <div className={`mt-6 mb-4 w-full transition-all duration-300 ease-in-out ${isCollapsed ? "opacity-0 h-0 hidden" : "opacity-100 flex-1"}`}>
        <a
          href="https://affiliates.investingchallenges.com/Tracking/click/?affid=2276&campaign=1326&product_id=2&t_type=Sub Affiliate&t_lang=EN"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative h-[336px] w-full"
        >
          <img src="/ads(invetsing.com).gif" alt="Investing Challenges" className="w-full h-full object-cover" />
        </a>
      </div>

      {user ? (
        <div className={`mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3 w-full ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"} w-full`}>
            <div className="flex items-center gap-3">
              <Avatar name={user.username} size={36} avatarId={user.avatarId} />
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-bold text-[var(--ink)] truncate">{user.username}</p>
                  <p className="text-xs text-[var(--muted)] capitalize">{user.role}</p>
                </div>
              )}
            </div>
            <button 
              onClick={logout} 
              className={`p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors ${isCollapsed ? "mt-2" : ""}`} 
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
          {!isCollapsed && user.role === 'seller' && (
            <div className="bg-[var(--amber)] bg-opacity-10 rounded-xl p-3 flex justify-between items-center w-full">
              <span className="text-xs font-bold text-[var(--amber-dark)]">Credits</span>
              <span className="text-sm font-bold text-[var(--ink)]">{user.credits} CR</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-auto pt-4 flex-1"></div>
      )}
    </aside>
  );
}

