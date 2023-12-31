import drvgositepreview from "@/public/drvgo-website-preview.webp";
import ProfileImage from "@/public/no-image.webp";
import randomPattern from "@/public/pattern-wood.webp";
import BlogThumbnail from "@/public/pattern.webp";
import xarospreview from "@/public/xar-os.webp";

export const DEFAULT_USER_IMAGE = ProfileImage;
export const DEFAULT_BLOG_THUMBNAIL = BlogThumbnail;
export const DRVGO_SITE_IMAGE = drvgositepreview;
export const XAR_OS_IMAGE = xarospreview;
export const DEFAULT_PATTERN = randomPattern;

export const BitFieldPermissions = {
    ViewPublicPages: 1 << 0, // 1
    ViewPrivatePages: 1 << 1, // 2
    SendMessages: 1 << 2, // 4
    ManageRoles: 1 << 3, // 8
    ManageUsers: 1 << 4, // 16
    ManageBlogs: 1 << 5, // 32
    ManagePages: 1 << 6, // 64
    Administrator: 1 << 7, // 128
    // Total = 255
};

export type PermissionKey = keyof typeof BitFieldPermissions;

export const PermissionKeysArray = Object.keys(
    BitFieldPermissions
) as PermissionKey[];

interface Permission {
    name: string;
    key: string;
    bit: number;
    description: string;
}

export const Permissions: Permission[] = [
    {
        name: "View Public Pages",
        key: "ViewPublicPages",
        bit: BitFieldPermissions.ViewPublicPages,
        description:
            "Anyone with this permission will be able to view public pages.",
    },
    {
        name: "View Private Pages",
        key: "ViewPrivatePages",
        bit: BitFieldPermissions.ViewPrivatePages,
        description:
            "Anyone with this permission will be able to view private pages.",
    },
    {
        name: "Send Messages",
        key: "SendMessages",
        bit: BitFieldPermissions.SendMessages,
        description:
            "Anyone with this permission will be able to send messages.",
    },
    {
        name: "Manage Roles",
        key: "ManageRoles",
        bit: BitFieldPermissions.ManageRoles,
        description:
            "Anyone with this permission will be able to manage roles.",
    },
    {
        name: "Manage Users",
        key: "ManageUsers",
        bit: BitFieldPermissions.ManageUsers,
        description:
            "Anyone with this permission will be able to manage users.",
    },
    {
        name: "Manage Blogs",
        key: "ManageBlogs",
        bit: BitFieldPermissions.ManageBlogs,
        description:
            "Anyone with this permission will be able to manage blogs.",
    },
    {
        name: "Manage Pages",
        key: "ManagePages",
        bit: BitFieldPermissions.ManagePages,
        description:
            "Anyone with this permission will be able to manage pages.",
    },
    {
        name: "Administrator",
        key: "Administrator",
        bit: BitFieldPermissions.Administrator,
        description:
            "Anyone with this permission will have full access to the site.",
    },
];
