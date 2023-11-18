import { currentUser } from "@clerk/nextjs";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { DrizzleError } from "drizzle-orm";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { BitFieldPermissions } from "../config/const";
import { CachedRole } from "../types/cache";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export function formatDate(input: string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export function handleError(err: unknown) {
    console.error(err);
    if (err instanceof ZodError)
        return NextResponse.json({
            code: 422,
            message: err.issues.map((x) => x.message).join(", "),
        });
    else if (err instanceof DrizzleError)
        return NextResponse.json({
            code: 422,
            message: err.message,
        });
    else
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error!",
        });
}

export function convertMsIntoDays(ms: number) {
    const today = new Date();
    const input = new Date(ms);

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const inputYear = input.getFullYear();
    const inputMonth = input.getMonth();
    const inputDate = input.getDate();

    const todayTimestamp = Date.UTC(
        todayYear,
        todayMonth,
        todayDate,
        0,
        0,
        0,
        0
    );

    const inputTimestamp = Date.UTC(
        inputYear,
        inputMonth,
        inputDate,
        0,
        0,
        0,
        0
    );

    const elapsed = todayTimestamp - inputTimestamp;

    if (elapsed < 0) {
        const days = Math.ceil(elapsed / 86400000);
        if (days === -1) return "Tomorrow";
        else return `in ${-days} days`;
    } else if (elapsed === 0) {
        return "today";
    } else {
        const days = Math.floor(elapsed / 86400000);
        if (days === 1) return "yesterday";
        else return `${days} days ago`;
    }
}

export function convertMstoTimeElapsed(input: number) {
    const currentTimestamp = Date.now();
    const elapsed = currentTimestamp - input;

    if (elapsed < 60000) return "just now";
    else if (elapsed < 3600000) {
        const minutes = Math.floor(elapsed / 60000);
        return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    } else if (elapsed < 86400000) {
        const hours = Math.floor(elapsed / 3600000);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        const days = Math.floor(elapsed / 86400000);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }
}

export function shortenNumber(num: number): string {
    const units = ["", "K", "M", "B", "T"];
    let unitIndex = 0;
    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }
    const formattedNum = num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
    return formattedNum + units[unitIndex];
}

export function checkRoleHierarchy(
    userRoles: string[],
    targetRoles: string[],
    roles: CachedRole[]
) {
    const userRolesRaw = userRoles.map((x) => {
        const role = roles.find((r) => r.key === x);
        if (!role) return null;
        return role;
    });
    const targetRolesRaw = targetRoles.map((x) => {
        const role = roles.find((r) => r.key === x);
        if (!role) return null;
        return role;
    });

    const userHighestRole = userRolesRaw.reduce((prev, curr) => {
        if (!prev) return curr;
        if (!curr) return prev;
        return prev.position > curr.position ? curr : prev;
    }, null);

    const targetHighestRole = targetRolesRaw.reduce((prev, curr) => {
        if (!prev) return curr;
        if (!curr) return prev;
        return prev.position > curr.position ? curr : prev;
    }, null);

    if (!userHighestRole || !targetHighestRole) return false;

    return userHighestRole.position < targetHighestRole.position;
}

export async function getAuthorizedUser(permissions: number) {
    const user = await currentUser();
    if (!user) return null;

    if (user.privateMetadata.permissions & BitFieldPermissions.Administrator)
        return user;
    if (user.privateMetadata.permissions & permissions) return user;
    return null;
}

export function hasPermission(
    userPermissions: number,
    requiredPermissions: number
) {
    if (userPermissions & BitFieldPermissions.Administrator) return true;
    return (userPermissions & requiredPermissions) === requiredPermissions;
}

export function toPusherKey(key: string) {
    return key.replace(/:/g, "__");
}

export function chatHrefConstructor(id1: string, id2: string) {
    const sortedIds = [id1, id2].sort();
    return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function chatParamsGenerator(id1: string, id2: string) {
    const sortedIds = [id1, id2].sort();
    return `uId=${sortedIds[0]}&pId=${sortedIds[1]}`;
}

export function reorder<TItem>(
    list: TItem[],
    startIndex: number,
    endIndex: number
): TItem[] {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export const formatTimestampIntoHourMinute = (timestamp: number) => {
    return format(timestamp, "HH:mm");
};

export const formatTimestampIntoDate = (timestamp: number) => {
    return format(timestamp, "dd/MM/yyyy");
};

export function parseJSONToObject<T>(data: string): T {
    return JSON.parse(data) as T;
}

export function absoluteUrl(path: string) {
    if (typeof window !== "undefined") return path;
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}${path}`;
    return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function handleClientError(error: unknown, toastId?: string) {
    if (error instanceof DrizzleError) {
        return toast.error(error.message, {
            id: toastId,
        });
    } else if (error instanceof ZodError) {
        return toast.error(error.issues.map((x) => x.message).join(", "), {
            id: toastId,
        });
    } else if (error instanceof Error) {
        return toast.error(error.message, {
            id: toastId,
        });
    } else {
        console.error(error);
        return toast.error("Something went wrong, try again later!", {
            id: toastId,
        });
    }
}

export async function customFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
}
