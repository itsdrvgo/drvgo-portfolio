import CodingLaptop from "@/public/coding-laptop.jpg";
import DRVGOSitePreview from "@/public/drvgo-website-preview.png";
import EvoStack from "@/public/evo-stack.jpg";
import Pattern from "@/public/pattern-wood.jpg";
import XAROS from "@/public/xar-os.png";
import { StaticImageData } from "next/image";

interface Project {
    name: string;
    link: string;
    image: StaticImageData;
}

export const projectsConfig: Project[] = [
    {
        name: "XAR OS (MacOS Clone made with Next.JS)",
        link: "https://github.com/itsdrvgo/xar-os",
        image: XAROS,
    },
    {
        name: "DRVGO Portfolio made using Next.JS v13 (App Router)",
        link: "https://github.com/itsdrvgo/drvgo-website",
        image: DRVGOSitePreview,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern,
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern,
    },
];
