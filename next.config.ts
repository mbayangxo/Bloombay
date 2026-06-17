import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
        destination: "/member/home",
        permanent: false,
      },
      {
        source: "/member/connect/:path*",
        destination: "/member/home",
        permanent: false,
      },
      {
        source: "/member/intros",
        destination: "/member/home",
        permanent: false,
      },
      {
        source: "/member/intros/:path*",
        destination: "/member/home",
        permanent: false,
      },
      {
        source: "/member/match",
        destination: "/member/home",
        permanent: false,
      },
      {
        source: "/member/maps",
        destination: "/member/city",
        permanent: false,
      },
      {
        source: "/member/maps/:path*",
        destination: "/member/city",
        permanent: false,
      },
      {
        source: "/member/discover",
        destination: "/member/happenings",
        permanent: false,
      },
      {
        source: "/member/discover/:path*",
        destination: "/member/happenings",
        permanent: false,
      },
      {
        source: "/member/profile",
        destination: "/member/lounge",
        permanent: false,
      },
      {
        source: "/member/profile/:path*",
        destination: "/member/lounge",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
