import drvgositepreview from "@/public/drvgo-website-preview.png";
import ev0appPreview from "@/public/ev0.jpg";
import ProfileImage from "@/public/no-image.png";
import randomPattern from "@/public/pattern-wood.jpg";
import BlogThumbnail from "@/public/pattern.jpg";
import stripes from "@/public/stripes.svg";
import xarospreview from "@/public/xar-os.png";

export const DEFAULT_USER_IMAGE = ProfileImage;
export const DEFAULT_BLOG_THUMBNAIL = BlogThumbnail;
export const STRIPES = stripes;
export const DRVGO_SITE_IMAGE = drvgositepreview;
export const XAR_OS_IMAGE = xarospreview;
export const DEFAULT_PATTERN = randomPattern;
export const EV0_APP_IMAGE = ev0appPreview;

export const BitFieldPermissions = {
    ViewPublicPages: 1 << 0, // 1
    ViewPrivatePages: 1 << 1, // 2
    ManageRoles: 1 << 2, // 4
    ManageUsers: 1 << 3, // 8
    ManageBlogs: 1 << 4, // 16
    ManagePages: 1 << 5, // 32
    Administrator: 1 << 6, // 64
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
