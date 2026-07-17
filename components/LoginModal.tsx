"use client";

import { useState, useEffect } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { X, Check } from "lucide-react";

const AVATARS = [
  "👩‍💼", "👨‍💼", "👩‍💻", "👨‍💻", "👩‍🏭", "👨‍🏭",
  "🏢", "🏭", "🏪", "🚀", "💡", "💎"
];

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [avatarId, setAvatarId] = useState(0);
  
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounced username check
  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setIsAvailable(data.available);
      } catch (e) {
        console.error(e);
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [username]);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (isAvailable === false) {
      setError("Username is already taken");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role, avatarId }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (e) {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">Welcome to WWB</h2>
          <p className="text-sm text-[var(--muted)]">Enter instantly to explore global leads.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
              Choose a unique username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                placeholder="e.g. deltatex"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-50
                  ${isAvailable === false ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 
                    isAvailable === true ? 'border-green-500 focus:border-green-500 bg-green-50/50' : 
                    'border-gray-200 focus:border-[var(--violet-light)] focus:bg-white'}`}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {isChecking && <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />}
                {!isChecking && isAvailable === true && <Check size={18} className="text-green-500" />}
                {!isChecking && isAvailable === false && <X size={18} className="text-red-500" />}
              </div>
            </div>
          </div>

          {/* Role Toggle */}
          <div>
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
              I want to...
            </label>
            <div className="flex bg-gray-100 rounded-xl p-1 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out`}
                style={{ left: role === 'buyer' ? '4px' : 'calc(50%)' }}
              />
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors ${role === 'buyer' ? 'text-[var(--violet)]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Buy / Hire
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors ${role === 'seller' ? 'text-[var(--amber-dark)]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sell / Manufacture
              </button>
            </div>
            {role === 'seller' && (
              <p className="text-xs text-[var(--amber-dark)] font-medium text-center mt-2 animate-fade-in">
                ✨ Includes 1,000 free bids monthly
              </p>
            )}
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
              Select an Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatarId(index)}
                  className={`aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${
                    avatarId === index 
                      ? 'bg-[var(--violet)] bg-opacity-10 ring-2 ring-[var(--violet)] shadow-sm scale-105' 
                      : 'bg-gray-50 hover:bg-gray-100 grayscale-[0.2]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isAvailable === false || username.length < 3}
            className="w-full bg-[var(--ink)] hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2"
          >
            {isLoading ? "Entering..." : "Enter WWB"}
          </button>
        </form>
      </div>
    </div>
  );
}
