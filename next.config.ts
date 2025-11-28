import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // API rewrites
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/:path*` : 'http://localhost:5000/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/:path*` : 'http://localhost:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/uploads/:path*` : 'http://localhost:5000/uploads/:path*',
      },
    ];
  },

  // Image optimization with CDN support
  images: {
    domains: ['localhost', 'dreamhouse-cdn.com', 'cdn.dreamhouse.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'dreamhouse-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dreamhouse.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },


  // Output optimization
  output: 'standalone',
  generateEtags: false, // Let CDN handle etags

  // Build optimization
};

export default nextConfig;
