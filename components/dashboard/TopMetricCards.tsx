import { LucideIcon, TrendingUp, Users, ShoppingCart, Briefcase, Activity } from "lucide-react";

interface TopMetricCardsProps {
  role: 'seller' | 'buyer';
}

function MetricCard({ title, amount, percentage, icon: Icon, color }: { title: string, amount: string, percentage?: string, icon: LucideIcon, color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{amount}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      {percentage && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-500 font-semibold">{percentage}</span>
          <span className="text-gray-400 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
}

function WwbCounterCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">Global Platform Stats</p>
          <h3 className="text-lg font-bold text-gray-800">WWB Counter</h3>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <Activity size={24} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-indigo-500" />
            Total Global Buyers
          </div>
          <span className="font-semibold text-gray-800">14,285</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-emerald-500" />
            Total Active Sellers
          </div>
          <span className="font-semibold text-gray-800">8,492</span>
        </div>
      </div>
    </div>
  );
}

export default function TopMetricCards({ role }: TopMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Revenue/Spending */}
      {role === 'seller' ? (
        <MetricCard 
          title="Total Revenue" 
          amount="$45,280" 
          percentage="12.5%" 
          icon={TrendingUp} 
          color="bg-emerald-50 text-emerald-600" 
        />
      ) : (
        <MetricCard 
          title="Total Spending" 
          amount="$12,450" 
          percentage="5.1%" 
          icon={ShoppingCart} 
          color="bg-violet-50 text-violet-600" 
        />
      )}

      {/* Card 2: WWB Counter (Same for both) */}
      <WwbCounterCard />

      {/* Card 3: Market Demand/Supply */}
      {role === 'seller' ? (
        <MetricCard 
          title="Market Demand (Live Leads)" 
          amount="1,245" 
          percentage="8.2%" 
          icon={Briefcase} 
          color="bg-amber-50 text-amber-600" 
        />
      ) : (
        <MetricCard 
          title="Market Supply (Sellers Gigs)" 
          amount="3,890" 
          percentage="15.4%" 
          icon={Briefcase} 
          color="bg-blue-50 text-blue-600" 
        />
      )}
    </div>
  );
}
