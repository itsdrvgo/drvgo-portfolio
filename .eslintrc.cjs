/** @type {import("eslint").Linter.Config} */
const config = {
    plugins: ["tailwindcss"],
    extends: [
        "next/core-web-vitals",
        "prettier",
        "plugin:tailwindcss/recommended",
    ],
    rules: {
        semi: "error",
        "tailwindcss/no-custom-classname": "off",
    },
    settings: {
        tailwindcss: {
            callees: ["cn"],
            config: "./tailwind.config.js",
        },
        next: {
            rootDir: ["./src/"],
        },
    },
};

module.exports = config;
