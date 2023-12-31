import { StaticImageData } from "next/image";
import { DEFAULT_PATTERN, DRVGO_SITE_IMAGE, XAR_OS_IMAGE } from "./const";

interface Project {
    name: string;
    link: string;
    image: StaticImageData;
}

export const projectsConfig: Project[] = [
    {
        name: "DRVGO Portfolio made using Next.JS v13 (App Router)",
        link: "https://github.com/itsdrvgo/drvgo-website",
        image: DRVGO_SITE_IMAGE,
    },
    {
        name: "XAR OS (MacOS Clone made with Next.JS)",
        link: "https://github.com/itsdrvgo/xar-os",
        image: XAR_OS_IMAGE,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: DEFAULT_PATTERN,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: DEFAULT_PATTERN,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: DEFAULT_PATTERN,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: DEFAULT_PATTERN,
    },
];
