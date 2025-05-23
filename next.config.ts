/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me'], // ✅ Now it's in the right place
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
