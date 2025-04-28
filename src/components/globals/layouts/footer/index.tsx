"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DRVGO } from "../../svgs";

export function Footer({ className, ...props }: GenericProps) {
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

                {siteConfig.links && (
                    <div className="flex gap-5">
                        {Object.entries(siteConfig.links)?.map(
                            ([key, value], i) => {
                                const Icon = Icons[key as keyof typeof Icons];

                                return (
                                    <Link
                                        key={i}
                                        href={value}
                                        className="rounded-full border border-primary/20 bg-background p-2 text-foreground transition-all ease-in-out hover:bg-background/70"
                                        target="_blank"
                                    >
                                        <Icon className="size-4" />
                                    </Link>
                                );
                            }
                        )}
                    </div>
                )}

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
