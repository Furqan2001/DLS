/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: false,
  },
  serverless: {
    // Configure the maximum time limit in seconds
    functionInvocationTimeout: 60,
  },
};

module.exports = nextConfig;
