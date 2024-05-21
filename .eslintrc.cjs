/** @type {import("eslint").Linter.Config} */
const config = {
    plugins: ["tailwindcss", "unused-imports"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    root: true,
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
        ignorePatterns: ["node_modules/", ".next/", "assets/", "public/"],
    },
};

module.exports = config;
