import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '103.74.192.34',
    '103.74.192.34:3001',
    'localhost',
    'localhost:3001'
  ],
};

export default nextConfig;
