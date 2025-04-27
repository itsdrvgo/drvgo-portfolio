import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            semi: "error",
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "off",
            "no-unused-vars": ["off", "always"],
            quotes: ["error", "double"],
            eqeqeq: ["error", "always"],
            "comma-spacing": [
                "error",
                {
                    before: false,
                    after: true,
                },
            ],
            "keyword-spacing": [
                "error",
                {
                    before: true,
                    after: true,
                },
            ],
            "object-curly-spacing": ["error", "always"],
            "arrow-parens": ["error", "always"],
            "no-trailing-spaces": ["error", {}],
            "no-multi-spaces": ["error", {}],
            "semi-spacing": [
                "error",
                {
                    before: false,
                    after: true,
                },
            ],
        },
    },
];

export default eslintConfig;
