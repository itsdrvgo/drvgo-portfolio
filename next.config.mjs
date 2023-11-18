import "./env.mjs";
import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: "**.discordapp.com" },
            { hostname: "**.scdn.co" },
            { hostname: "uploadthing.com" },
            { hostname: "**.clerk.dev" },
            { hostname: "utfs.io" },
        ],
    },
    reactStrictMode: true,
};

const withBundleAnalyzer = bundleAnalyzer({
    // enabled: true,
    enabled: false,
});

export default withBundleAnalyzer(nextConfig);
