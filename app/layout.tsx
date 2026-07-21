import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WWB - World Wide Business",
  description:
    "Join WWB, the global business community connecting entrepreneurs, companies, professionals, startups, and investors to network, collaborate, and grow worldwide.",
};

import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
