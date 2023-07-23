import Link from "next/link";
import { DefaultProps, MainNavItem } from "@/src/types";
import { siteConfig } from "@/src/config/site";
import { cn } from "@/src/lib/utils";
import { useLockBody } from "@/src/hooks/use-lock-body";
import { Icons } from "../icons/icons";

interface MobileNavProps extends DefaultProps {
    items: MainNavItem[]
}

function MobileNav({ items, children }: MobileNavProps) {
    useLockBody();

    return (
        <div
            className={cn(
                "fixed inset-0 top-14 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-left-80 md:hidden"
            )}
        >
            <div className="relative z-20 grid gap-6 rounded-md bg-black p-4 text-popover-foreground shadow-md">
                <Link href="/" className="flex items-center space-x-2">
                    <Icons.music />
                    <span className="font-bold">{siteConfig.name}</span>
                </Link>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex w-full gap-1 items-center rounded-md p-2 text-sm font-medium hover:underline",
                                item.disabled && "cursor-not-allowed opacity-60"
                            )}
                        >
                            <p>{item.title}</p>
                            {item.title === "Blog"
                                ? <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                : null
                            }
                        </Link>
                    ))}
                </nav>
                {children}
            </div>
        </div>
    );
}

export { MobileNav };