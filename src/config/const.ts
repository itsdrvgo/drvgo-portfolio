import drvgositepreview from "@/public/drvgo-website-preview.png";
import DRVGO from "@/public/DRVGO.svg";
import ev0appPreview from "@/public/ev0.jpg";
import ProfileImage from "@/public/no-image.png";
import randomPattern from "@/public/pattern-wood.jpg";
import BlogThumbnail from "@/public/pattern.jpg";
import stripes from "@/public/stripes.svg";
import xarospreview from "@/public/xar-os.png";
import { User } from "../lib/drizzle/schema";

export const defaultUserPFP = ProfileImage;
export const defaultBlogThumbnail = BlogThumbnail;
export const Stripes = stripes;
export const DRVGOIcon = DRVGO;
export const DRVGOSitePreview = drvgositepreview;
export const XAROSPreview = xarospreview;
export const Pattern = randomPattern;
export const EV0AppPreview = ev0appPreview;

export const roleHierarchy: User["role"][] = [
    "user",
    "guest",
    "moderator",
    "admin",
    "owner",
];
