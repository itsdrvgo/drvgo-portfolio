import { MenuConfig } from "@/src/types";

export const homeMenuConfig: MenuConfig = {
    mainNav: [
        {
            title: "About",
            href: "/#about",
        },
        {
            title: "Courses",
            href: "/courses",
        },
        {
            title: "Newsletter",
            href: "/#newsletter",
        },
        {
            title: "Blogs",
            href: "/blogs",
        },
    ],
    subNav: [
        {
            title: "Patch Notes",
            href: "/patches",
        },
        {
            title: "Contact Us",
            href: "/contact",
        },
        {
            title: "FAQ",
            href: "/faq",
        },
        {
            title: "Report a Bug",
            href: "/bug",
        },
        {
            title: "Privacy Policy",
            href: "/privacy",
        },
        {
            title: "Terms of Service",
            href: "/tos",
        },
    ],
};
