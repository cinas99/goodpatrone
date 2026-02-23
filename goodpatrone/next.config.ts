import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  images: {
    formats: ['image/avif', 'image/webp'], // serve avif/webp instead of png
    minimumCacheTTL: 31536000,             // cache images 1 year
  },

  // Strong cache headers for static assets
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
