const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Prevent ESLint from breaking the production build
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Fix for modules that don't work in Webpack (like canvas, encoding)
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

module.exports = withPWA(nextConfig);
