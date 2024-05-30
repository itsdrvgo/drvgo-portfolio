import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAbsoluteURL(path: string = "/") {
    if (process.env.VERCEL_URL) return "https://itsdrvgo.me" + path;
    return "http://localhost:" + (process.env.PORT ?? 3000) + path;
}

export function getReadTime(content: string) {
    const words = content.split(/\s+/g).length;
    const minutes = words / 200;

    return Math.ceil(minutes);
}
