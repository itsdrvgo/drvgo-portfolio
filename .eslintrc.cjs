/** @type {import("eslint").Linter.Config} */
const config = {
    plugins: ["tailwindcss", "unused-imports"],
    extends: [
        "next/core-web-vitals",
        "prettier",
        "plugin:tailwindcss/recommended",
    ],
    rules: {
        semi: "error",
        "tailwindcss/no-custom-classname": "off",
        "unused-imports/no-unused-imports": "warn",
        "unused-imports/no-unused-vars": "warn",
    },
    settings: {
        tailwindcss: {
            callees: ["cn"],
            config: "./tailwind.config.ts",
        },
        next: {
            rootDir: ["./src/"],
        },
        ignorePatterns: [
            "node_modules/",
            ".next/",
            "assets/",
            "public/",
            "drizzle/",
        ],
    },
};

module.exports = config;
