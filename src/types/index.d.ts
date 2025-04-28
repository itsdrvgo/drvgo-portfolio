import { Icons } from "@/components/icons";
import { StaticImageData } from "next/image";
import { HTMLAttributes, ReactNode } from "react";

export type Skill = {
    name: string;
    description: string;
    image: StaticImageData;
    icon: string;
    href: string;
};

declare global {
    type GenericProps = HTMLAttributes<HTMLElement>;
    type LayoutProps = {
        children: ReactNode;
    };

    type SiteConfig = {
        name: string;
        description: string;
        longDescription?: string;
        category: string;
        og: {
            url: string;
            width: number;
            height: number;
        };
        developer: {
            name: string;
            url: string;
        };
        keywords: string[];
        links?: Partial<Record<keyof typeof Icons, string>>;
        menu: {
            name: string;
            href: string;
            icon: keyof typeof Icons;
            isExternal?: boolean;
            isDisabled?: boolean;
        }[];
    };
}
