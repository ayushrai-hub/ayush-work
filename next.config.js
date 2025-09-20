/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export
  },
  experimental: {
    appDir: true,
  },
  output: 'export', // For static export to work with Netlify/Vercel
  trailingSlash: true, // For static hosting
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
