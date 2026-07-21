"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import LoginModal from "@/components/LoginModal";
import ChatPanel from "@/components/ChatPanel";
import { useAuth } from "@/context/AuthContext";

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen p-4 lg:p-6 relative">
      <LoginModal />
      <ChatPanel />
      <div className="max-w-[2000px] mx-auto flex flex-col lg:flex-row gap-4 relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Wrapper */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          <TopNav 
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {children}
        </main>
      </div>
    </div>
  );
}
