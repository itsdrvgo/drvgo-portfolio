import DRVGOLogo from "@/public/DRVGO.svg";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";

function DashFooter({ className }: DefaultProps) {
    return (
        <footer
            className={cn(
                "relative flex w-full flex-col items-center justify-center border-t border-border bg-background p-5",
                className
            )}
        >
            <div className="flex w-full max-w-[75rem] flex-col items-center justify-between gap-7 md:flex-row">
                <Image src={DRVGOLogo} alt="DRVGO" width={40} height={40} />
                <p className="text-sm">
                    Copyright © 2023{" "}
                    <Link
                        href={siteConfig.url}
                        className="font-semibold text-accent-foreground underline underline-offset-2"
                    >
                        DRVGO
                    </Link>
                    , All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export { DashFooter };
