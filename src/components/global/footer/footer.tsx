"use client";

import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { Button, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Icons } from "../../icons/icons";
import DRVGO from "../svgs/DRVGO";

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

function Footer({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    const pathname = usePathname();

    return (
        <footer
            className={cn(
                "relative flex w-full cursor-default flex-col items-center justify-center space-y-20 border-t border-white/5",
                pathname === "/" ? "py-10" : "py-2",
                className
            )}
            {...props}
        >
            {pathname === "/" && (
                <div className="absolute top-0 mx-5 flex max-w-4xl -translate-y-1/2 flex-col items-center justify-around gap-5 rounded-lg bg-primary-700 px-8 py-5 text-center md:mx-0 md:flex-row md:p-10">
                    <h3 className="w-full text-2xl font-bold text-background md:text-4xl">
                        Start a Project
                    </h3>

                    <p className="w-full text-balance text-sm font-semibold text-background">
                        Interested in working together? We can have a chat, &
                        make something unthinkable!
                    </p>

                    <div className="flex w-full items-center justify-center md:justify-end">
                        <Button
                            as={Link}
                            href="/support"
                            radius="full"
                            isExternal
                            startContent={<Icons.sparkles className="size-4" />}
                        >
                            Let&apos;s go
                        </Button>
                    </div>
                </div>
            )}

            {pathname === "/" ? (
                <div className="flex flex-col items-center justify-center gap-7">
                    <DRVGO width={100} height={100} />
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
                                    <Icon className="size-4" />
                                </Button>
                            );
                        })}
                    </div>

                    <p className="text-sm">
                        © {new Date().getFullYear()}{" "}
                        <Link
                            href={"/"}
                            underline="always"
                            className="text-sm font-semibold text-primary-700"
                        >
                            DRVGO
                        </Link>
                        . All rights reserved.
                    </p>
                </div>
            ) : (
                <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-2 md:flex-row md:gap-7 2xl:max-w-6xl">
                    <DRVGO height={40} width={40} />
                    <p className="text-sm">
                        © {new Date().getFullYear()}{" "}
                        <Link
                            href={"/"}
                            underline="always"
                            className="text-sm font-semibold text-primary-700"
                        >
                            DRVGO
                        </Link>
                        . All rights reserved.
                    </p>
                </div>
            )}
        </footer>
    );
}

export default Footer;
