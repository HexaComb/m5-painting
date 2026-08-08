import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
