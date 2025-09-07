/** @type {import('next').NextConfig} */
const nextConfig = {
  // GoDaddy için optimize edilmiş konfigürasyon
  output: 'export', // Static export için
  trailingSlash: true,
  images: {
    unoptimized: true, // GoDaddy'de image optimization yok
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  // Disable features that don't work on static hosting
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Custom rewrites for API calls
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
