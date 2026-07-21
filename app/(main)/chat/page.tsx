import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat & Negotiations - WWB",
  description: "Secure messaging and negotiations between buyers and sellers.",
};

export default function ChatRoutePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center text-gray-500">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Chat & Negotiations</h2>
      <p>Secure messaging between buyers and sellers is coming soon.</p>
    </div>
  );
}
