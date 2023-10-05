"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Divider, Skeleton } from "@nextui-org/react";

function SidebarSkeleton({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("flex h-screen", className)} {...props}>
            <aside className="flex w-full flex-col gap-4 border-r p-5 md:w-[300px]">
                <h1 className="text-center text-2xl font-bold">Chats</h1>

                <Divider />

                <div className="flex flex-col gap-3 p-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                </div>
            </aside>

            <main className="flex-1 overflow-hidden">
                <div className="relative flex h-screen flex-1 flex-col justify-between bg-stone-950">
                    <header
                        className={cn(
                            "flex items-center justify-between border-b bg-background p-4 md:px-10 md:pl-4",
                            className
                        )}
                    >
                        <div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>

                        <div className="flex gap-5">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </header>

                    <section className="flex items-center justify-between gap-3 px-4 py-2">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </section>
                </div>
            </main>
        </div>
    );
}

function ChatSectionSkeleton({ className, ...props }: DefaultProps) {
    return (
        <main className={cn("flex-1 overflow-hidden", className)} {...props}>
            <div className="relative flex h-screen flex-1 flex-col justify-between bg-stone-950">
                <header
                    className={cn(
                        "flex items-center justify-between border-b bg-background p-4 md:px-10 md:pl-4",
                        className
                    )}
                >
                    <div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>

                    <div className="flex gap-5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </header>

                <section className="flex items-center justify-between gap-3 px-4 py-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </section>
            </div>
        </main>
    );
}

export { SidebarSkeleton, ChatSectionSkeleton };
