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
  env: {
    PRIVATE_KEY:
      "0xc7d50a10aa9a6b0cde8de0aa6841c762f33c3bdade3e149db0002df97d13eac8",
    PROJECT_ID: "1cc10f5c7a6f4180a7485ea6a0221be0",
  },
};

module.exports = nextConfig;
