import { DRVGOIcon } from "@/src/config/const";
import { siteConfig } from "@/src/config/site";
import { useLockBody } from "@/src/hooks/use-lock-body";
import { cn } from "@/src/lib/utils";
import { DefaultProps, MenuConfig } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "../icons/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface MobileNavProps extends DefaultProps {
    items: MenuConfig;
}

function MobileNav({ items, children }: MobileNavProps) {
    useLockBody();
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-left-80 md:hidden"
            )}
        >
            <div className="relative z-20 grid gap-6 rounded-md border border-border bg-background p-4 text-popover-foreground shadow-md">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src={DRVGOIcon} alt="DRVGO" width={30} height={30} />
                    <span className="font-bold">{siteConfig.name}</span>
                </Link>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {items.mainNav.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex w-full items-center gap-1 rounded-md p-2 text-sm font-semibold",
                                item.disabled && "cursor-not-allowed opacity-60"
                            )}
                        >
                            <p>{item.title}</p>
                            {item.title === "Blog" ? (
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                            ) : null}
                        </Link>
                    ))}

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <div className="flex w-full items-center gap-1 rounded-md p-2 text-sm font-semibold">
                                <p>More</p>
                                <Icons.chevronDown
                                    className={cn(
                                        "h-4 w-4 transition-all ease-in-out",
                                        open && "rotate-180"
                                    )}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            sideOffset={0}
                            className="w-52 rounded-sm bg-background p-2"
                        >
                            <div className="flex flex-col gap-1 text-sm">
                                {items.subNav
                                    .filter(
                                        (item) =>
                                            !["/privacy", "/tos"].includes(
                                                item.href
                                            )
                                    )
                                    .map((item, index) => (
                                        <Link
                                            key={index}
                                            href={
                                                item.disabled ? "#" : item.href
                                            }
                                            className={cn(
                                                "flex items-center gap-1 rounded-sm p-1 px-2 text-sm font-semibold text-popover-foreground",
                                                item.disabled &&
                                                    "cursor-not-allowed opacity-80"
                                            )}
                                        >
                                            <p>{item.title}</p>
                                        </Link>
                                    ))}
                                <Separator />
                                {items.subNav
                                    .filter((item) =>
                                        ["/privacy", "/tos"].includes(item.href)
                                    )
                                    .map((item, index) => (
                                        <Link
                                            key={index}
                                            href={
                                                item.disabled ? "#" : item.href
                                            }
                                            className={cn(
                                                "flex items-center gap-1 rounded-sm p-1 px-2 text-sm font-semibold text-popover-foreground",
                                                item.disabled &&
                                                    "cursor-not-allowed opacity-80"
                                            )}
                                        >
                                            <p>{item.title}</p>
                                        </Link>
                                    ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </nav>
                {children}
            </div>
        </div>
    );
}

export { MobileNav };
