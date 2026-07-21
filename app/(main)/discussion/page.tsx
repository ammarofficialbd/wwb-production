import type { Metadata } from "next";
import DiscussionPage from "@/components/DiscussionPage";

export const metadata: Metadata = {
  title: "Discussion Channels - WWB",
  description: "Join the World Wide Business discussion channels. Connect, chat, and share ideas globally.",
};

export default function DiscussionRoutePage() {
  return <DiscussionPage />;
}
