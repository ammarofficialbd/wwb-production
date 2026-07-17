import Image from "next/image";

export default function FinanceBlogWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Finance Category</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 group cursor-pointer">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=160&fit=crop" 
              alt="Finance" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
              Mastering International Letters of Credit (L/C)
            </h3>
            <p className="text-xs text-gray-400 mt-1">10 min read</p>
          </div>
        </div>
        
        <div className="flex gap-3 group cursor-pointer">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&h=160&fit=crop" 
              alt="Payments" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
              Cross-Border Payment Structures: 2026 Guide
            </h3>
            <p className="text-xs text-gray-400 mt-1">8 min read</p>
          </div>
        </div>
      </div>
    </div>
  );
}
