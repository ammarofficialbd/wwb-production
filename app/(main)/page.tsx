"use client";

import WwbDashboard from "@/components/WwbDashboard";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const userRole = user?.role || "buyer";

  return <WwbDashboard userRole={userRole as "seller" | "buyer"} />;
}
