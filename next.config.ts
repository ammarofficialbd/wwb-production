import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'nntnuzodvshtzysaslhd.supabase.co',
        port: '',
      },
    ],
  },
};

export default nextConfig;
