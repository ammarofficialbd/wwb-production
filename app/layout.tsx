import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldwidebusiness.live"),
  title: "WWB - World Wide Business",
  description:
    "Join WWB, the global business community connecting entrepreneurs, companies, professionals, startups, and investors to network, collaborate, and grow worldwide.",
  keywords: ["business", "network", "entrepreneurs", "startups", "investors", "professionals", "WWB"],
  openGraph: {
    title: "WWB - World Wide Business",
    description: "Join WWB, the global business community connecting entrepreneurs, companies, professionals, startups, and investors to network, collaborate, and grow worldwide.",
    url: "https://worldwidebusiness.live",
    siteName: "WWB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WWB - World Wide Business",
    description: "Join WWB, the global business community connecting entrepreneurs...",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://worldwidebusiness.live/#website",
      "url": "https://worldwidebusiness.live/",
      "name": "WWB - World Wide Business",
      "description": "Global business community connecting entrepreneurs, companies, professionals, startups, and investors.",
      "publisher": {
        "@id": "https://worldwidebusiness.live/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://worldwidebusiness.live/#organization",
      "name": "World Wide Business (WWB)",
      "url": "https://worldwidebusiness.live",
      "logo": "https://worldwidebusiness.live/favicon.ico"
    }
  ]
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K6MQQ14JWW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K6MQQ14JWW');
          `}
        </Script>
      </head>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
