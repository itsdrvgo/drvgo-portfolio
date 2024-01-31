import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getReadTime(content: string) {
    const words = content.split(/\s+/g).length;
    const minutes = words / 200;

    return Math.ceil(minutes);
}
