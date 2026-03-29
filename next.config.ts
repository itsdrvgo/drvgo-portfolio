import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "cdn.jsdelivr.net" },
            { protocol: "https", hostname: "img.youtube.com" },
            {
                protocol: "https",
                hostname: "6kyfi4ef87.ufs.sh",
                pathname: "/f/**",
            },
            { protocol: "https", hostname: "picsum.photos" },
        ],
    },
};

export default nextConfig;
