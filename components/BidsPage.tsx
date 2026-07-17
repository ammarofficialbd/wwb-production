"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PostLeadModal from "./PostLeadModal";
import Avatar from "./Avatar";
import { Briefcase, Globe, DollarSign, ShieldAlert, ShieldCheck } from "lucide-react";

export default function BidsPage() {
  const { user, setShowLoginModal, refresh } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const handlePostClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setIsPostModalOpen(true);
    }
  };

  const placeBid = async (leadId: number, orderValue: number) => {
    let cost = 50;
    if (orderValue >= 15000) cost = 150;
    else if (orderValue >= 5000) cost = 80;
    else if (orderValue >= 1000) cost = 60;

    const confirm = window.confirm(`This will cost ${cost} credits. Proceed?`);
    if (!confirm) return;

    try {
      const res = await fetch(`/api/leads/${leadId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Interested in this order!" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Bid placed successfully!");
        refresh(); // Update credits
      } else {
        alert(data.error || "Failed to place bid");
      }
    } catch (e) {
      console.error(e);
      alert("Error placing bid");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <Briefcase size={48} className="text-[var(--violet-light)] mb-4" />
        <h2 className="text-2xl font-bold mb-2">Global Bids Marketplace</h2>
        <p className="text-gray-500 max-w-md mb-6">Log in to view high-value corporate leads, post your own supply requests, and connect globally.</p>
        <button onClick={() => setShowLoginModal(true)} className="bg-[var(--ink)] text-white px-6 py-3 rounded-xl font-bold">
          Enter WWB
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Leads & Bids</h1>
          <p className="text-sm text-gray-500">Discover and bid on active global requirements.</p>
        </div>
        {user.role === 'buyer' && (
          <button 
            onClick={handlePostClick}
            className="bg-[var(--violet)] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-[var(--violet-light)] transition-colors"
          >
            Post a Lead
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No leads posted yet.</div>
        ) : (
          leads.map(lead => (
            <div key={lead.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wider">{lead.category}</span>
                <span className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-[var(--ink)] line-clamp-2">{lead.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-1">{lead.description}</p>
              
              <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center text-sm font-semibold text-green-600">
                  <DollarSign size={16} className="mr-2" />
                  Order Value: ${lead.orderValue.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe size={16} className="mr-2 text-blue-500" />
                  Region: {lead.country}
                </div>
              </div>

              {/* Company Info with Privacy Guard */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Avatar name={lead.author.username} size={36} />
                <div className="flex flex-col flex-1 min-w-0">
                  {user.role === 'seller' ? (
                    // Privacy Guard for Seller
                    <>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900 bg-gray-200 text-transparent blur-sm rounded px-1 select-none">HiddenCompany</span>
                        {lead.isVerified ? <ShieldCheck size={14} className="text-green-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                      </div>
                      <span className="text-xs text-gray-400">Company details hidden until awarded</span>
                    </>
                  ) : (
                    // Full visibility for Buyers/Admin
                    <>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-[var(--ink)] truncate">{lead.companyName || lead.author.username}</span>
                        {lead.isVerified ? <ShieldCheck size={14} className="text-green-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                      </div>
                      <span className="text-xs text-gray-400">{lead.isVerified ? 'Verified Buyer' : 'Unverified Buyer'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {user.role === 'seller' && (
                <button 
                  onClick={() => placeBid(lead.id, lead.orderValue)}
                  className="mt-5 w-full bg-[var(--amber)] hover:bg-[var(--amber-dark)] text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Place Bid (Cost: {lead.orderValue >= 15000 ? 150 : lead.orderValue >= 5000 ? 80 : lead.orderValue >= 1000 ? 60 : 50} CR)
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <PostLeadModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onSuccess={fetchLeads} />
    </div>
  );
}
