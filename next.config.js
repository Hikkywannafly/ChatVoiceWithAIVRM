/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.BASE_PATH || "",
  basePath: process.env.BASE_PATH || "",
  trailingSlash: true,
  publicRuntimeConfig: {
    root: process.env.BASE_PATH || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vroid-hub.pximg.net",
      },
    ],
  },
};

module.exports = nextConfig;
