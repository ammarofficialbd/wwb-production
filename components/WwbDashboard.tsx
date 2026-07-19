"use client";

import PostCardsWidget from "./dashboard/PostCardsWidget";
import FinancialStatsWidget from "./dashboard/FinancialStatsWidget";
import TrendingPostsSlider from "./dashboard/TrendingPostsSlider";
import OptimizeBudgetTips from "./dashboard/OptimizeBudgetTips";
import CategoryPostsSection from "./dashboard/CategoryPostsSection";
import MyCardWidget from "./dashboard/MyCardWidget";
import PopularPosts from "./dashboard/PopularPosts";

interface WwbDashboardProps {
  userRole: "seller" | "buyer";
}

export default function WwbDashboard({ userRole }: WwbDashboardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
      {/* ── Main Left & Middle Column ── */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Row 1: Post cards on the left, vertical stats card on the right */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 min-w-0">
            <PostCardsWidget />
          </div>
          <div className="w-full lg:w-[220px] shrink-0 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-transparent select-none tracking-tight">Stats</h2>
            <FinancialStatsWidget />
          </div>
        </div>

        {/* Row 2: Trending posts slider (40%) & Ad (60%) */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="w-full md:w-[40%] shrink-0">
            <TrendingPostsSlider />
          </div>
          <div className="w-full md:flex-1">
            <OptimizeBudgetTips
              ads={[{ src: "/ads2.gif", alt: "Advertisement" }]}
              rotateInterval={0}
            />
          </div>
        </div>

        {/* Row 3: Finance Posts & Investing Posts */}
        <CategoryPostsSection />
      </div>

      {/* ── Right Sidebar Column ── */}
      <aside className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6 xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <MyCardWidget />
        <PopularPosts />
      </aside>
    </div>
  );
}
