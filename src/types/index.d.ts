import { Icons } from "@/components/icons";
import { StaticImageData } from "next/image";
import { HTMLAttributes, ReactNode } from "react";

export type NavItem = {
    title: string;
    href: string;
    isExternal?: boolean;
    icon?: keyof typeof Icons;
};

export type SiteConfig = {
    name: string;
    description: string;
    ogImage: string;
    keywords?: string[];
    links?: {
        [key: string]: string;
    };
};

export type GenericProps = HTMLAttributes<HTMLElement>;
export interface LayoutProps {
    children: ReactNode;
}

export type Skill = {
    name: string;
    description: string;
    image: StaticImageData;
    icon: string;
    href: string;
};
