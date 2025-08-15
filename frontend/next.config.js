/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 optimizations
  experimental: {
    // Enable new React 19 features
    reactCompiler: true,
    // Fix scroll restoration issues
    scrollRestoration: true,
    // Optimize CSS loading
    optimizeCss: true,
  },
  // Turbopack configuration for Next.js 15
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    // Updated image configuration for Next.js 15
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'filmxane-videos.s3.amazonaws.com',
      },
    ],
    // Enable new image formats
    formats: ['image/webp', 'image/avif'],
    // Fix image loading issues
    unoptimized: false,
    // Better error handling
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // Performance optimizations for Next.js 15
  compress: true,
  poweredByHeader: false,
  // Fix potential routing issues
  trailingSlash: false,
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Fix CSS loading issues
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS loading
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      }
    }
    return config
  },
}

module.exports = nextConfig
