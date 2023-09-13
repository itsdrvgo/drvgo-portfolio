import "./env.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "cdn.discordapp.com",
            "i.scdn.co",
            "uploadthing.com",
            "images.clerk.dev",
            "utfs.io",
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;
