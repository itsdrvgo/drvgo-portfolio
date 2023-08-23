import { DRVGOIcon } from "@/src/config/const";
import { siteConfig } from "@/src/config/site";
import { useLockBody } from "@/src/hooks/use-lock-body";
import { cn } from "@/src/lib/utils";
import { DefaultProps, MainNavItem } from "@/src/types";
import Image from "next/image";
import Link from "next/link";

interface MobileNavProps extends DefaultProps {
    items: MainNavItem[];
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
                    <Image src={DRVGOIcon} alt="DRVGO" width={30} height={30} />
                    <span className="font-bold">{siteConfig.name}</span>
                </Link>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex w-full items-center gap-1 rounded-md p-2 text-sm font-semibold hover:underline",
                                item.disabled && "cursor-not-allowed opacity-60"
                            )}
                        >
                            <p>{item.title}</p>
                            {item.title === "Blog" ? (
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                            ) : null}
                        </Link>
                    ))}
                </nav>
                {children}
            </div>
        </div>
    );
}

export { MobileNav };
