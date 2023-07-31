import ProfileImage from "@/public/no-image.png";
import BlogThumbnail from "@/public/pattern.jpg";
import { User } from "../lib/drizzle/schema";

export const defaultUserPFP = ProfileImage;
export const defaultBlogThumbnail = BlogThumbnail;

export const roleHierarchy: User["role"][] = [
    "user",
    "moderator",
    "admin",
    "owner",
];
