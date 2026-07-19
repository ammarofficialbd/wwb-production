"use client";

import { useState, useEffect } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { X, Check, Briefcase, Code, Building, User, Laptop, Globe, Flame, Shield, TrendingUp, Cpu, Gem, Rocket, Eye, EyeOff } from "lucide-react";

// Replace emojis with Lucide React icons
const AVATARS = [
  { icon: Briefcase, color: "text-blue-500" },
  { icon: Code, color: "text-green-500" },
  { icon: Building, color: "text-indigo-500" },
  { icon: User, color: "text-purple-500" },
  { icon: Laptop, color: "text-pink-500" },
  { icon: Globe, color: "text-teal-500" },
  { icon: Flame, color: "text-orange-500" },
  { icon: Shield, color: "text-red-500" },
  { icon: TrendingUp, color: "text-emerald-500" },
  { icon: Cpu, color: "text-cyan-500" },
  { icon: Gem, color: "text-violet-500" },
  { icon: Rocket, color: "text-amber-500" }
];

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [avatarId, setAvatarId] = useState(0);
  
  const [isChecking, setIsChecking] = useState(false);
  // isAvailable: true means new user (register), false means existing user (login), null means invalid/typing
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounced username check
  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      setError("");
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      setError("");
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
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // If available, we register. If not available, we login.
      const endpoint = isAvailable ? "/api/auth/register" : "/api/auth/login";
      
      const payload = isAvailable 
        ? { username, password, role, avatarId } 
        : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (e) {
      setError("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginMode = isAvailable === false;
  const isRegisterMode = isAvailable === true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
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

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                placeholder="e.g. deltatex"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none bg-gray-50
                  ${isLoginMode ? 'border-blue-500 focus:border-blue-500 bg-blue-50/50' : 
                    isRegisterMode ? 'border-green-500 focus:border-green-500 bg-green-50/50' : 
                    'border-gray-200 focus:border-[var(--violet-light)] focus:bg-white'}`}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {isChecking && <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />}
                {!isChecking && isRegisterMode && (
                  <span title="Available to register">
                    <Check size={18} className="text-green-500" />
                  </span>
                )}
                {!isChecking && isLoginMode && <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Login</div>}
              </div>
            </div>
            {!isChecking && isRegisterMode && <p className="text-xs text-green-600 mt-1.5 font-medium">Username available for registration</p>}
            {!isChecking && isLoginMode && <p className="text-xs text-blue-600 mt-1.5 font-medium">Account exists, please log in</p>}
          </div>

          {/* Password Input */}
          <div className={`transition-all duration-300 ${(isLoginMode || isRegisterMode) ? 'opacity-100 h-auto' : 'opacity-50 h-auto'}`}>
            <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--violet-light)] outline-none bg-gray-50 focus:bg-white transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Show Role/Avatar only if Registering */}
          {isRegisterMode && (
            <div className="space-y-5 animate-fade-in">
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
                  {AVATARS.map((avatar, index) => {
                    const Icon = avatar.icon;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatarId(index)}
                        className={`aspect-square flex items-center justify-center rounded-xl transition-all ${
                          avatarId === index 
                            ? 'bg-[var(--violet)] bg-opacity-10 ring-2 ring-[var(--violet)] shadow-sm scale-105' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={22} className={avatarId === index ? avatar.color : 'text-gray-400'} strokeWidth={avatarId === index ? 2.5 : 2} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isAvailable === null || username.length < 3 || password.length < 6}
            className="w-full bg-[var(--ink)] hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 mt-2"
          >
            {isLoading 
              ? "Authenticating..." 
              : isLoginMode 
                ? "Log In to WWB" 
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
