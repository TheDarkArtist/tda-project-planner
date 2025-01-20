import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clean-bear-570.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
