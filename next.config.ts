import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "recharts"],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/mirror", destination: "/advisor", permanent: true },
      { source: "/mirror/:id", destination: "/advisor/:id", permanent: true },
    ];
  },
};

export default nextConfig;
