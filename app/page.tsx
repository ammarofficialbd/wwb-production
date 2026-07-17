"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BusinessFeed from "@/components/BusinessFeed";
import BidsPage from "@/components/BidsPage";
import LoginModal from "@/components/LoginModal";
import WwbDashboard from "@/components/WwbDashboard";
import { useAuth } from "@/context/AuthContext";
import ChatPanel from "@/components/ChatPanel";
import DiscussionPage from "@/components/DiscussionPage";

export default function Home() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  // Default to buyer if no user is logged in for preview purposes
  const userRole = user?.role || 'buyer';

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
            activePage={activePage} 
            onNavigate={(page) => {
              setActivePage(page);
              setIsMobileMenuOpen(false); // Close mobile menu after navigation
            }} 
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

          {activePage === "My Feed" ? (
            <BusinessFeed />
          ) : activePage === "Bids" ? (
            <BidsPage />
          ) : activePage === "Chat" ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center text-gray-500">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Chat & Negotiations</h2>
              <p>Secure messaging between buyers and sellers is coming soon.</p>
            </div>
          ) : activePage === "Discussion" ? (
            <DiscussionPage />
          ) : (
            /* ── Dashboard ── */
            <WwbDashboard userRole={userRole as 'seller' | 'buyer'} />
          )}
        </main>
      </div>
    </div>
  );
}
