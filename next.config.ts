import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The founder story moved from /story to /about.
  async redirects() {
    return [{ source: "/story", destination: "/about", permanent: true }];
  },
  images: {
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
