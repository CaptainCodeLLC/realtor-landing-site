import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/administracion",
        permanent: false
      },
      {
        source: "/properties/:path*",
        destination: "/propiedades/:path*",
        permanent: false
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/administracion",
        destination: "/admin"
      },
      {
        source: "/propiedades/:path*",
        destination: "/properties/:path*"
      }
    ];
  }
};

export default nextConfig;
