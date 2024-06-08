/** @type {import("next").NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "**.discordapp.com" },
            { hostname: "**.scdn.co" },
            { hostname: "uploadthing.com" },
            { hostname: "**.clerk.dev" },
            { hostname: "utfs.io" },
            { hostname: "cdn.jsdelivr.net" },
            { hostname: "img.youtube.com" },
        ],
    },
    reactStrictMode: true,
};

export default nextConfig;
