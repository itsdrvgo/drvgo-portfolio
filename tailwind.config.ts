import { nextui } from "@nextui-org/react";
import { withUt } from "uploadthing/tw";

export default withUt({
    darkMode: "class",
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--border)",
                text: "var(--text)",
                background: "var(--background)",
                code: "var(--code)",
                accent: "var(--accent)",
                chat: {
                    DEFAULT: "var(--chat)",
                    input: "var(--chat-input)",
                    border: "var(--chat-border)",
                    hover: "var(--chat-hover)",
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        nextui(),
    ],
});
