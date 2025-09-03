/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 optimizations
  experimental: {
    // Enable scroll restoration
    scrollRestoration: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // If not provided externally, leave empty or point to backend 3004 so api.ts auto-detection/fallback works
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api',
  },
  // Performance optimizations for Next.js 14
  compress: true,
  poweredByHeader: false,
  // Fix potential routing issues
  trailingSlash: false,
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // GitHub Pages için static export
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Disable prerendering for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable static generation for problematic pages
  // generateStaticParams: false, // Bu Next.js 14'te geçerli değil
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
  // Skip error pages during build
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
}

module.exports = nextConfig
