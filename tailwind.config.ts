import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [
        nextui({
            prefix: "drvgo",
            themes: {
                dark: {
                    colors: {
                        background: "hsl(0, 12%, 6%)",
                    },
                },
            },
        }),
    ],
} satisfies Config;
