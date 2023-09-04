import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import axios, { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { roleHierarchy } from "../config/const";
import { Notification } from "../types/notification";
import { Blog } from "./drizzle/schema";
import { UserUpdateData } from "./validation/auth";
import { ResponseData } from "./validation/response";

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
    console.log(err);
    if (err instanceof ZodError)
        return NextResponse.json({
            code: 422,
            message: err.issues.map((x) => x.message).join(", "),
        });
    else if (err instanceof AxiosError)
        return NextResponse.json({
            code: err.code,
            message: err.message,
        });
    else
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error",
        });
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

export function checkRoleHierarchy(user: User, target: User) {
    const userRoleIndex = roleHierarchy.indexOf(user.privateMetadata.role);
    const targetRoleIndex = roleHierarchy.indexOf(target.privateMetadata.role);

    if (userRoleIndex === -1 || targetRoleIndex === -1) {
        return false;
    }

    if (user.privateMetadata.role === "owner") {
        if (target.privateMetadata.role === "owner") return false;
        return true;
    }

    return (
        userRoleIndex > targetRoleIndex && userRoleIndex - targetRoleIndex > 1
    );
}

export function manageRole(
    role: User["privateMetadata"]["role"],
    action: string
): UserUpdateData["role"] {
    const roleIndex = roleHierarchy.indexOf(role);

    if (roleIndex === -1) {
        return undefined;
    }

    if (action === "promote") {
        const nextRoleIndex = roleIndex + 1;
        if (nextRoleIndex < roleHierarchy.length) {
            return roleHierarchy[nextRoleIndex];
        } else {
            return undefined;
        }
    } else if (action === "demote") {
        const prevRoleIndex = roleIndex - 1;
        if (prevRoleIndex >= 0) {
            return roleHierarchy[prevRoleIndex];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export function updateBlogViews(blogId: string) {
    axios
        .patch<ResponseData>(`/api/blogs/views/${blogId}`)
        .then(({ data: resData }) => {
            if (resData.code !== 200) return console.log(resData.message);
            console.log("Updated view");
        })
        .catch((err) => {
            console.log(err);
            console.log("Couldn't update view");
        });
}

export async function addNotification(
    notification: Omit<Notification, "id" | "read" | "createdAt">
) {
    try {
        let url: string;

        if (notification.userId)
            url = `/api/users/${notification.userId}/notifications`;
        else url = `/api/notifications`;

        const { data } = await axios.post<ResponseData>(
            url,
            JSON.stringify(notification)
        );

        if (data.code !== 201) {
            console.log(data.message);
            return false;
        }

        console.log("Added notification");
        return true;
    } catch (err) {
        console.log(err);
        console.log("Couldn't add notification");
        return false;
    }
}

export async function markNotificationAsRead({
    userId,
    notificationId,
}: {
    userId: string;
    notificationId?: string;
}) {
    try {
        let url: string;

        if (notificationId)
            url = `/api/users/${userId}/notifications/${notificationId}`;
        else url = `/api/users/${userId}/notifications`;

        const { data } = await axios.patch<ResponseData>(url);

        if (data.code !== 200) {
            console.log(data.message);
            return false;
        }

        console.log("Marked notification as read");
        return true;
    } catch (err) {
        console.log(err);
        console.log("Couldn't mark notification as read");
        return false;
    }
}

export async function getBlog(blogId: string) {
    try {
        const { data } = await axios.get<ResponseData>(`/api/blogs/${blogId}`);

        if (data.code !== 200) {
            console.log(data.message);
            return null;
        }

        return data.data as Blog;
    } catch (err) {
        console.log(err);
        console.log("Couldn't get blog");
        return null;
    }
}

export async function getAuthorizedUser() {
    const user = await currentUser();

    if (!user || !["owner", "admin"].includes(user.privateMetadata.role))
        return null;
    return user;
}
