"use client";

import {
  LayoutGrid,
  ArrowLeftRight,
  BarChart2,
  CreditCard,
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Report", icon: BarChart2 },
  { label: "Payment", icon: CreditCard },
];

interface TopNavProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function TopNav({ onToggleSidebar, isSidebarCollapsed }: TopNavProps) {
  const { user, setShowLoginModal, setShowChatPanel } = useAuth();

  return (
    <header className="top-nav flex items-center">
      {/* Nav tabs - left aligned */}
      <nav className="top-nav__tabs">
        {navItems.map(({ label, icon: Icon, active }) =>
          active ? (
            <button key={label} className="top-nav__tab top-nav__tab--active">
              <Icon size={15} strokeWidth={2.5} />
              {label}
            </button>
          ) : (
            <button key={label} className="top-nav__tab top-nav__tab--idle">
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          )
        )}
      </nav>

      {/* Right actions */}
      <div className="top-nav__actions">
        <button className="top-nav__icon-btn" aria-label="Search">
          <Search size={17} strokeWidth={2} />
        </button>
        <button 
          onClick={() => setShowChatPanel(true)} 
          className="top-nav__icon-btn" 
          aria-label="Messages"
        >
          <MessageSquare size={17} strokeWidth={2} />
        </button>
        <button className="top-nav__icon-btn">
          <Bell size={18} strokeWidth={2} />
          <span className="top-nav__badge" />
        </button>

        {user ? (
          <button className="top-nav__user">
            <Avatar name={user.username} size={38} />
            <div className="top-nav__user-info">
              <span className="top-nav__user-name">{user.username}</span>
              <span className="top-nav__user-role capitalize">{user.role}</span>
            </div>
            <ChevronDown size={14} className="top-nav__chevron" strokeWidth={2.5} />
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="ml-2 flex items-center gap-2 bg-[var(--ink)] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            <UserIcon size={16} />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
