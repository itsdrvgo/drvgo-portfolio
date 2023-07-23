import { siteConfig } from "@/src/config/site";
import Link from "next/link";
import { Icons } from "../icons/icons";
import DRVGOLogo from "@/public/DRVGO.svg";
import Image from "next/image";
import { DefaultProps } from "@/src/types";
import { Button } from "../ui/button";

function SiteFooter({ className }: DefaultProps) {
    return (
        <footer className={className}>
            <div className="bg-accent mx-5 px-8 md:px-16 py-5 md:py-10 rounded-md max-w-[75rem] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 items-center text-center absolute top-0 -translate-y-1/2">
                <p className="text-background font-bold text-2xl md:text-4xl">Start a Project</p>
                <p className="text-background font-medium text-sm">Interested in working together? We can have a chat, and make something unthinkable!</p>
                <div className="flex items-center justify-center md:justify-end">
                    <Button
                        variant={"secondary"}
                        className="hover:bg-zinc-800 flex gap-1 items-center"
                    >
                        <Icons.sparkles className="h-4 w-4" />
                        <p>Let&apos;s go</p>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-7">
                <Image src={DRVGOLogo} alt="DRVGO" width={100} height={100} />
                <p className="text-center">Learning, Coding & Bringing <br /> the best out of me.</p>
                <div className="flex gap-5">
                    <Link href={siteConfig.links.twitter} className="p-3 rounded-full items-center bg-background">
                        <Icons.twitter className="h-4 w-4" />
                    </Link>
                    <Link href={siteConfig.links.youtube} className="p-3 rounded-full bg-background">
                        <Icons.youtube className="h-4 w-4" />
                    </Link>
                    <Link href={siteConfig.links.github} className="p-3 rounded-full bg-background">
                        <Icons.github className="h-4 w-4" />
                    </Link>
                    <Link href={siteConfig.links.discord} className="p-3 rounded-full bg-background">
                        <Icons.discord className="h-4 w-4" />
                    </Link>
                    <Link href={siteConfig.links.instagram} className="p-3 rounded-full bg-background">
                        <Icons.instagram className="h-4 w-4" />
                    </Link>
                </div>
                <p className="text-sm">Copyright © 2023 <Link href={siteConfig.url} className="text-accent underline underline-offset-2">DRVGO</Link>, All rights reserved.</p>
            </div>
        </footer>
    );
}

export { SiteFooter };