import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // CODIQ is content-driven and static-first; next/image optimization is
    // intentionally disabled so the app deploys on any static host.
    unoptimized: true,
  },
};

export default nextConfig;
