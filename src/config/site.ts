import { getAbsoluteURL } from "@/lib/utils";

export const siteConfig: SiteConfig = {
    name: "DRVGO",
    description: "A personal portfolio website of Sarthak Kundu, a.k.a. DRVGO",
    longDescription:
        "DRVGO is a personal portfolio website of Sarthak Kundu, a.k.a. DRVGO. I am a full-stack web developer, a musician, and a content creator. 😃\n\n" +
        "I am a full-stack web developer with experience in building web applications using React, Next.js, Node.js, Express.js, and MongoDB. I am also a musician and a content creator. I love to create content on YouTube and Instagram.\n\n" +
        "I am currently working on some exciting projects that I will be sharing soon. Stay tuned!",
    keywords: [
        "DRVGO",
        "drago",
        "dragoluca",
        "sarthak kundu",
        "sarthak",
        "itsdrvgo",
    ],
    category: "Portfolio",
    developer: {
        name: "DRVGO",
        url: "https://itsdrvgo.me",
    },
    og: {
        url: getAbsoluteURL("/og.webp"),
        width: 1200,
        height: 630,
    },
    links: {
        Twitter: "https://x.com/itsdrvgo",
        Instagram: "https://www.instagram.com/itsdrvgo",
        Github: "https://github.com/itsdrvgo",
        Youtube: "https://youtube.com/@itsdrvgodev",
        Discord: "https://dsc.gg/drvgo",
    },
    menu: [
        {
            name: "Home",
            href: "/",
            icon: "Home",
        },
        {
            name: "Blogs",
            href: "/blogs",
            icon: "Book",
        },
        {
            name: "Videos",
            href: "/videos",
            icon: "Video",
        },
    ],
};
