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

const mainMenu = [
  { label: "Dashboard", icon: LayoutGrid, requiresAuth: false },
  { label: "My Feed", icon: Rss, requiresAuth: false },
  { label: "Bids", icon: Gavel, requiresAuth: false },
  { label: "Chat", icon: MessageSquare, requiresAuth: true },
  { label: "Discussion", icon: MessageCircle, requiresAuth: true },
];

const settingsMenu = [
  { label: "Help Center", icon: HelpCircle },
  { label: "Setting", icon: Settings },
];

interface SidebarProps {
  activePage?: string;
  onNavigate?: (label: string) => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Sidebar({ activePage = "Dashboard", onNavigate, isCollapsed = false, onToggleSidebar }: SidebarProps) {
  const { user, setShowLoginModal, logout } = useAuth();

  const handleNav = (label: string, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      setShowLoginModal(true);
      return;
    }
    onNavigate?.(label);
  };

  return (
    <aside 
      className={`shrink-0 bg-white rounded-3xl p-6 flex flex-col transition-all duration-300 ease-in-out relative overflow-y-auto lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
        isCollapsed ? "w-full lg:w-[72px] items-center px-4" : "w-full lg:w-[260px]"
      }`}
    >
      <div className={`flex items-center gap-2 mb-10 ${isCollapsed ? "justify-center" : ""}`}>
        <button
          onClick={onToggleSidebar}
          className="w-8 h-8 rounded-lg bg-[var(--ink)] flex items-center justify-center text-white shrink-0 hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
          aria-label="Toggle Sidebar"
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
        {mainMenu.map(({ label, icon: Icon, requiresAuth }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              onClick={() => handleNav(label, requiresAuth)}
              title={isCollapsed ? label : undefined}
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-2.5 rounded-xl text-sm font-medium text-left transition-colors w-full ${
                isActive
                  ? "bg-[var(--amber)] text-white shadow-sm shadow-amber-200"
                  : "text-[#5b5d76] hover:bg-[#f5f5fa]"
              }`}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </button>
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
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative h-[240px] w-full">
          <img src="/ads1.png" alt="Google Ads" className="w-full h-full object-cover" />
        </div>
      </div>

      {user ? (
        <div className={`mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3 w-full ${isCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"} w-full`}>
            {!isCollapsed ? (
              <div>
                <p className="text-sm font-bold text-[var(--ink)] truncate">{user.username}</p>
                <p className="text-xs text-[var(--muted)] capitalize">{user.role}</p>
              </div>
            ) : (
              <UserCircle size={24} className="text-gray-400 shrink-0" />
            )}
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

