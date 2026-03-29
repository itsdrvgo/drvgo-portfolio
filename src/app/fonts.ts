import { Inter, Space_Grotesk, Syne } from "next/font/google";

export const syne = Syne({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-syne",
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    variable: "--font-space-grotesk",
});

export const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "600", "700", "900"],
    display: "swap",
    variable: "--font-inter",
});
