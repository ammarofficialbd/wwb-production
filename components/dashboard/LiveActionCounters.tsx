import { Target, MessageSquare, Briefcase, Link as LinkIcon } from "lucide-react";

interface LiveActionCountersProps {
  role: 'seller' | 'buyer';
}

export default function LiveActionCounters({ role }: LiveActionCountersProps) {
  if (role === 'seller') {
    return (
      <div className="flex flex-col gap-4">
        {/* Available Bids */}
        <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Target size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-50 text-sm font-medium mb-1">Available Bids</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">850</h3>
              <span className="text-emerald-100 font-medium">/ 1000</span>
            </div>
            <div className="mt-4 w-full bg-black/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-sm font-semibold backdrop-blur-sm">
              Upgrade Package
            </button>
          </div>
        </div>

        {/* Responses on Your Bids */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Responses on Your Bids</p>
            <h3 className="text-2xl font-bold text-gray-800">124</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
            <MessageSquare size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active Leads Posted */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Briefcase size={64} />
        </div>
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-medium mb-1">Active Leads Posted</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">12</h3>
            <span className="text-violet-200 font-medium">Live</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-violet-100">Total Views: 1,420</span>
          </div>
          <button className="mt-4 w-full bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-sm font-semibold backdrop-blur-sm">
            Post New Lead
          </button>
        </div>
      </div>

      {/* Connected Sellers */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">Connected Sellers</p>
          <h3 className="text-2xl font-bold text-gray-800">48</h3>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-blue-500">
          <LinkIcon size={24} />
        </div>
      </div>
    </div>
  );
}
