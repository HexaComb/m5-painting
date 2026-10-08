import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fleet-cuttlefish-912.convex.cloud",
        pathname: "/api/storage/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/painting-company",
        destination: "/sanger-painting-company",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
