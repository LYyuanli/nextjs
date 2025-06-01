import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://closetfrontrecruiting.blob.core.windows.net/**')],
  }
};

export default nextConfig;
