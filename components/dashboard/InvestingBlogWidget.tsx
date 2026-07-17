import Image from "next/image";

export default function InvestingBlogWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Investing & Markets</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 group cursor-pointer">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=160&fit=crop" 
              alt="Market trends" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              Macroscopic Economic Trends Affecting B2B
            </h3>
            <p className="text-xs text-gray-400 mt-1">12 min read</p>
          </div>
        </div>
        
        <div className="flex gap-3 group cursor-pointer">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&h=160&fit=crop" 
              alt="Stock analysis" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              Key Market Metrics to Watch This Quarter
            </h3>
            <p className="text-xs text-gray-400 mt-1">7 min read</p>
          </div>
        </div>
      </div>
    </div>
  );
}
