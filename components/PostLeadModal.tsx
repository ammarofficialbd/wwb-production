"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, UploadCloud } from "lucide-react";

export default function PostLeadModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const { user, refresh } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [category, setCategory] = useState("General");
  const [country, setCountry] = useState("");
  
  // Profile State
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [contactInfo, setContactInfo] = useState("");
  const [certNumber, setCertNumber] = useState(user?.certNumber || "");
  
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const submitLead = async (skipProfile = false) => {
    setIsLoading(true);
    try {
      const payload = {
        title,
        description,
        orderValue,
        category,
        country,
        companyName: skipProfile ? null : companyName,
        contactInfo: skipProfile ? null : contactInfo,
        certNumber: skipProfile ? null : certNumber,
        isVerified: !skipProfile
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refresh();
        onSuccess();
        onClose();
        // Reset state
        setStep(1);
        setTitle(""); setDescription(""); setOrderValue(""); setCountry("");
      } else {
        alert("Failed to post lead");
      }
    } catch (e) {
      console.error(e);
      alert("Error posting lead");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-[var(--ink)] mb-6">
          {step === 1 ? "Post a Supply / Call / Lead" : "Business Profiling"}
        </h2>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="e.g. Need 50,000 Cotton T-Shirts" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-xl" placeholder="Detailed requirements..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Estimated Value (USD)</label>
                <input type="number" value={orderValue} onChange={e => setOrderValue(e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="e.g. 15000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Country / Region</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-2 border rounded-xl" placeholder="e.g. USA" />
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!title || !description || !orderValue || !country}
              className="w-full bg-[var(--violet)] text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50"
            >
              Continue to Profile
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-gray-500 mb-4">Complete your corporate data to build trust with sellers, or skip to post anonymously.</p>
            
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Contact Email / Phone</label>
              <input type="text" value={contactInfo} onChange={e => setContactInfo(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1">Business Certificate / Tax ID</label>
              <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                <UploadCloud size={24} className="mb-2 text-[var(--violet-light)]" />
                <span className="text-xs">For now, enter Registration No. below</span>
              </div>
              <input type="text" value={certNumber} onChange={e => setCertNumber(e.target.value)} className="w-full px-4 py-2 border rounded-xl mt-2" placeholder="e.g. REG-12345678" />
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => submitLead(true)}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 py-3 rounded-xl font-bold transition-colors"
              >
                Skip & Post Live
              </button>
              <button 
                onClick={() => submitLead(false)}
                disabled={isLoading || !companyName || !certNumber}
                className="flex-1 bg-[var(--ink)] text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {isLoading ? "Posting..." : "Post Verified Lead"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
