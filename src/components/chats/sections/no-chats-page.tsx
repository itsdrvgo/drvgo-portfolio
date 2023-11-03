"use client";

import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import DRVGOLogo from "../../global/svgs/DRVGOLogo";

function NoChatsPage({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn(
                "relative flex h-screen flex-1 flex-col justify-between",
                className
            )}
            style={{
                backgroundImage: "url(/patterns/chat_bg.png)",
                backgroundSize: "cover",
            }}
            {...props}
        >
            <section className="flex h-full flex-col items-center justify-center">
                <DRVGOLogo height={300} width={300} className="opacity-80" />

                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-2xl font-semibold">
                        {siteConfig.name}
                    </h1>
                    <p className="text-gray-400">
                        Select a chat to start messaging
                    </p>
                </div>
            </section>
        </div>
    );
}

export default NoChatsPage;
