import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FeaturedContentWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Main Featured Content</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Post 1 */}
        <div className="relative rounded-xl overflow-hidden group h-64">
          <Image 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop" 
            alt="Logistics" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Logistics News</span>
            <h3 className="text-white text-lg font-bold leading-tight mb-3">Global Shipping Routes Adjust to New Maritime Regulations</h3>
            <button className="flex items-center text-sm text-white font-semibold group/btn w-fit">
              Read More <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Featured Post 2 */}
        <div className="relative rounded-xl overflow-hidden group h-64">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" 
            alt="Business District" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Top Performer</span>
            <h3 className="text-white text-lg font-bold leading-tight mb-3">How Top Manufacturers Are Sourcing Raw Materials in 2026</h3>
            <button className="flex items-center text-sm text-white font-semibold group/btn w-fit">
              Read More <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
