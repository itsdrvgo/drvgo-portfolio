"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { DRVGO } from "../../svgs";

interface Social {
    name: string;
    icon: keyof typeof Icons;
    href: string;
}

const socials: Social[] = [
    {
        name: "Twitter",
        icon: "x",
        href: siteConfig.links?.x!,
    },
    {
        name: "YouTube",
        icon: "youtube",
        href: siteConfig.links?.youtube!,
    },
    {
        name: "GitHub",
        icon: "github",
        href: siteConfig.links?.github!,
    },
    {
        name: "Discord",
        icon: "discord",
        href: siteConfig.links?.discord!,
    },
    {
        name: "Instagram",
        icon: "instagram",
        href: siteConfig.links?.instagram!,
    },
];

export function Footer({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center gap-20 bg-primary py-20 text-primary-foreground selection:bg-background selection:text-foreground",
                className
            )}
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
            {...props}
        >
            <div className="flex flex-col items-center justify-center gap-7">
                <DRVGO width={100} height={100} />
                <p className="w-60 text-center">
                    Learning, Coding & Bringing the best out of me.
                </p>
                <div className="flex gap-5">
                    {socials.map((social) => {
                        const Icon = Icons[social.icon];

                        return (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="rounded-full border border-primary/20 bg-background p-2 text-foreground transition-all ease-in-out hover:bg-background/70"
                                target="_blank"
                            >
                                <Icon className="size-4" />
                            </Link>
                        );
                    })}
                </div>

                <p className="text-sm">
                    © {new Date().getFullYear()}{" "}
                    <Link
                        href="/"
                        className="text-sm font-semibold text-accent underline"
                    >
                        DRVGO
                    </Link>
                    . All rights reserved.
                </p>
            </div>
        </footer>
    );
}
