import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
