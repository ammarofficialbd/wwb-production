import Image from "next/image";
import { BookOpen } from "lucide-react";

export default function FeaturedGuidesWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Featured Guides</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Guide 1 */}
        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
              How to Safely Export Textiles Globally
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              The definitive guide on compliance, shipping, and quality assurance for cross-border textile trade.
            </p>
          </div>
        </div>

        {/* Guide 2 */}
        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
              The Framework of IT Outsourcing
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              Learn how to vet, hire, and manage top-tier IT talent and agencies from around the world.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
