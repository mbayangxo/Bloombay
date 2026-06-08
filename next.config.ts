import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: "/member/connect",
        destination: "/member/intros",
        permanent: true,
      },
      {
        source: "/member/connect/:path*",
        destination: "/member/intros/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
