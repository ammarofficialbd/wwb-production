import Image from "next/image";

const LATEST_BLOGS = [
  {
    id: 1,
    title: "How Global Tariffs are Shifting in 2026",
    date: "14 Jul 2026",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Top 5 Strategies for B2B Supply Chain Optimization",
    date: "12 Jul 2026",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a30?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Understanding Cross-Border Escrow Payments",
    date: "10 Jul 2026",
    image: "https://images.unsplash.com/photo-1621858728956-6a56e30018a1?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    title: "The Rise of Agri-Tech in Emerging Markets",
    date: "08 Jul 2026",
    image: "https://images.unsplash.com/photo-1592982537443-d1449830db9f?w=100&h=100&fit=crop"
  }
];

export default function LatestBlogsWidget() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">WWB Latest Blogs</h2>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {LATEST_BLOGS.map((blog) => (
          <div key={blog.id} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-300" 
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{blog.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
