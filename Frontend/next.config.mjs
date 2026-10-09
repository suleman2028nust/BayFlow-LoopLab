/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // On Windows, webpack sometimes deletes old chunk files before the server
      // has finished loading them, causing MODULE_NOT_FOUND errors.
      // Disabling cache prevents stale chunk references from persisting.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
