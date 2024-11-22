/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  }
}

module.exports = nextConfig 