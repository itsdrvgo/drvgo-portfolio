"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Skeleton } from "@nextui-org/react";

function SidebarSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex h-screen", className)} {...props}>
            <aside className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden border-r border-chat-border bg-chat md:max-w-xs">
                <div className="flex h-[4.5rem] items-center justify-between gap-5 border-b border-chat-border p-5 px-8">
                    <Skeleton className="h-10 w-10 rounded-full" />

                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                </div>

                <div className="px-3">
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>

                <div>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-5">
                            <div className="py-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>

                            <div
                                className={cn(
                                    "flex w-full flex-col gap-[2px] border-t border-chat-hover py-3",
                                    i === 0 && "border-t-0"
                                )}
                            >
                                <Skeleton className="h-5 w-20 rounded-lg" />
                                <Skeleton className="h-4 w-40 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <ChatSectionSkeleton />
        </div>
    );
}

function ChatSectionSkeleton({ className, ...props }: DefaultProps) {
    return (
        <main className={cn("flex-1 overflow-hidden", className)} {...props}>
            <div
                className="relative flex h-screen flex-1 flex-col justify-between"
                style={{
                    backgroundImage: "url(/patterns/chat_bg.png)",
                    backgroundSize: "cover",
                }}
            >
                <header className="flex h-[4.5rem] items-center justify-between border-b border-chat-border bg-chat p-5">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-32 rounded-lg" />
                    </div>

                    <Skeleton className="h-8 w-8 rounded-lg" />
                </header>

                <section className="flex items-center justify-between gap-3 bg-chat px-4 py-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </section>
            </div>
        </main>
    );
}

export { ChatSectionSkeleton, SidebarSkeleton };
