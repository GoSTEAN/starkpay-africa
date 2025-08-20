import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your other config options here */

  typescript: {
    // ✅ Bypass type checking errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Bypass ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
