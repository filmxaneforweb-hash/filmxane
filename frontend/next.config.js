/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api',
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Production build için
  output: 'standalone',
  // Disable static generation completely
  trailingSlash: false,
  // Skip error pages during build
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Disable static optimization
  experimental: {
    esmExternals: false,
  },
  // Custom error pages
  async rewrites() {
    return [
      {
        source: '/404',
        destination: '/404.html',
      },
      {
        source: '/500',
        destination: '/500.html',
      },
    ]
  },
}

module.exports = nextConfig
