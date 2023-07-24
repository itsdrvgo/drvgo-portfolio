import { StaticImageData } from "next/image";
import DRVGOSitePreview from "@/public/drvgo-website-preview.png";
import CodingLaptop from "@/public/coding-laptop.jpg";
import EvoStack from "@/public/evo-stack.jpg";
import Pattern from "@/public/pattern-wood.jpg";

interface Project {
    name: string;
    link: string;
    image: StaticImageData;
}

export const projectsConfig: Project[] = [
    {
        name: "DRVGO Portfolio made using Next.JS v13 (App Router)",
        link: "https://github.com/itsdrvgo/drvgo-website",
        image: DRVGOSitePreview
    },
    {
        name: "EV0 Stack",
        link: "https://github.com/DRVGO/create-ev0-app",
        image: EvoStack
    },
    {
        name: "Next.JS 13 Template (App Router)",
        link: "https://github.com/itsdrvgo/nextjs-13-template",
        image: CodingLaptop
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern
    },
    {
        name: "Coming Soon",
        link: "/",
        image: Pattern
    }
];