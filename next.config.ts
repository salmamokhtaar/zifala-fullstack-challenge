import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
  eslint: {
    // ✅ Allow build even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
