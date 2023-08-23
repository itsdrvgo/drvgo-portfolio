import { StaticImageData } from "next/image";
import {
    DRVGOSitePreview,
    EV0AppPreview,
    Pattern,
    XAROSPreview,
} from "./const";

interface Project {
    name: string;
    link: string;
    image: StaticImageData;
}

export const projectsConfig: Project[] = [
    {
        name: "Create EV0 App (EV0 Stack)",
        link: "https://github.com/itsdrvgo/create-ev0-app",
        image: EV0AppPreview,
    },
    {
        name: "XAR OS (MacOS Clone made with Next.JS)",
        link: "https://github.com/itsdrvgo/xar-os",
        image: XAROSPreview,
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
];
