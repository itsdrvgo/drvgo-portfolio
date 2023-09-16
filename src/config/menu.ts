import { MenuConfig } from "@/src/types";

export const homeMenuConfig: MenuConfig = {
    mainNav: [
        {
            title: "Blogs",
            href: "/blogs",
        },
        {
            title: "Courses",
            href: "/courses",
        },
        {
            title: "Music",
            href: "/music",
        },
        {
            title: "FAQ",
            href: "/faq",
        },
    ],
    subNav: [
        {
            title: "Patch Notes",
            description: "See what's new in the latest update.",
            href: "/patches",
            icon: "page",
        },
        {
            title: "Hire Me",
            description: "Hire me to build your next project.",
            href: "/start-a-project",
            icon: "command",
        },
        {
            title: "Report a Bug",
            description: "Found a bug? Let us know so we can fix it.",
            href: "/bug",
            icon: "bug",
        },
        {
            title: "Privacy Policy",
            description: "Read our privacy policy to learn more.",
            href: "/privacy",
            icon: "lock",
        },
        {
            title: "Terms of Service",
            description: "Read our terms of service before using our service.",
            href: "/tos",
            icon: "application",
        },
    ],
};
