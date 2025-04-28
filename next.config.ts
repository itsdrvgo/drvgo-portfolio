import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "cdn.jsdelivr.net" },
            { protocol: "https", hostname: "img.youtube.com" },
        ],
    },
};

export default nextConfig;
