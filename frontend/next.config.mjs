/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // Disable SWC minification
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig