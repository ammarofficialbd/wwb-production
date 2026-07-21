import type { Metadata } from "next";
import BusinessFeed from "@/components/BusinessFeed";

export const metadata: Metadata = {
  title: "My Feed - WWB",
  description: "Browse the latest business news, finance tips, and investment opportunities on World Wide Business.",
};

export default function MyFeedPage() {
  return <BusinessFeed />;
}
