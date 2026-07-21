import type { Metadata } from "next";
import BidsPage from "@/components/BidsPage";

export const metadata: Metadata = {
  title: "Bids & Opportunities - WWB",
  description: "Explore the latest business bids and opportunities. Connect with buyers and sellers worldwide.",
};

export default function BidsRoutePage() {
  return <BidsPage />;
}
