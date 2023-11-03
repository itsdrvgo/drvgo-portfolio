import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { Button, Link } from "@nextui-org/react";
import NextLink from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Icons } from "../../icons/icons";
import ProjectStartButton from "../buttons/project-start-button";
import DRVGOLogo from "../svgs/DRVGOLogo";

interface Social {
    name: string;
    icon: keyof typeof Icons;
    href: string;
}

const socials: Social[] = [
    {
        name: "Twitter",
        icon: "twitter",
        href: siteConfig.links.twitter,
    },
    {
        name: "YouTube",
        icon: "youtube",
        href: siteConfig.links.youtube,
    },
    {
        name: "GitHub",
        icon: "github",
        href: siteConfig.links.github,
    },
    {
        name: "Discord",
        icon: "discord",
        href: siteConfig.links.discord,
    },
    {
        name: "Instagram",
        icon: "instagram",
        href: siteConfig.links.instagram,
    },
];

function FooterHome({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <footer
            className={cn(
                "relative flex w-full cursor-default flex-col items-center justify-center space-y-20 border-t border-border bg-default-50 py-10",
                className
            )}
            {...props}
        >
            <div className="absolute top-0 mx-5 grid max-w-4xl -translate-y-1/2 grid-cols-1 items-center gap-5 rounded-lg bg-accent px-8 py-5 text-center md:grid-cols-3  md:px-12 md:py-10">
                <p className="text-2xl font-bold text-background md:text-4xl">
                    Start a Project
                </p>
                <p className="text-sm font-semibold text-background">
                    Interested in working together? We can have a chat, & make
                    something unthinkable!
                </p>
                <div className="flex items-center justify-center md:justify-end">
                    <ProjectStartButton />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-7">
                <DRVGOLogo width={100} height={100} />
                <p className="w-60 text-center">
                    Learning, Coding & Bringing the best out of me.
                </p>
                <div className="flex gap-5">
                    {socials.map((social) => {
                        const Icon = Icons[social.icon];

                        return (
                            <Button
                                isIconOnly
                                as={Link}
                                radius="full"
                                key={social.name}
                                href={social.href}
                                color="primary"
                                className="bg-primary-200"
                                target="_blank"
                            >
                                <Icon className="h-4 w-4" />
                            </Button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1">
                    <Link
                        as={NextLink}
                        href={"/privacy"}
                        color="foreground"
                        size="sm"
                    >
                        Privacy Policy
                    </Link>

                    <p>•</p>

                    <Link
                        as={NextLink}
                        href={"/tos"}
                        color="foreground"
                        size="sm"
                    >
                        Terms of Services
                    </Link>
                </div>

                <p className="text-sm">
                    Copyright © 2023{" "}
                    <Link
                        as={NextLink}
                        href={"/"}
                        underline="always"
                        className="text-sm font-semibold text-accent"
                    >
                        {siteConfig.name}
                    </Link>
                    , All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default FooterHome;
