import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  transpilePackages: ['@mumble-web/sdk'],
  images: {
    unoptimized: true
  }
}

export default nextConfig
