import { Roboto, Slackey } from "next/font/google";

export const slackey = Slackey({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-slackey",
});

export const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    display: "swap",
    variable: "--font-roboto",
});
