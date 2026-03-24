/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any domain for uploads if configured
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
      }
    ],
  },
};

export default nextConfig;
