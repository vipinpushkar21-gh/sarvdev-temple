/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 15 enables the App Router by default; keep other settings here.
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
