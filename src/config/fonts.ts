import { Roboto, Slackey } from "next/font/google";

export const SLACKEY_FONT = Slackey({
    weight: ["400"],
    subsets: ["latin"],
});

export const ROBOTO_FONT = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
});
