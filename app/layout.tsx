import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillUp Dashboard",
  description: "Learning dashboard for SkillUp",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
