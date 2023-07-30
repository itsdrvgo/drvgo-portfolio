"use client";

import useSidebarStore from "@/src/lib/store/sideBar";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

function SideBar({ className, children }: DefaultProps) {
    const router = useRouter();

    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

    const triggerSideBar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div
            className={cn(
                "container flex gap-5 px-0 md:max-w-[80rem] md:px-8",
                className
            )}
        >
            <aside
                className={cn(
                    "flex flex-col gap-1 overflow-x-hidden text-sm transition-all ease-in-out",
                    isSidebarOpen ? "w-52 translate-x-0" : "w-0 -translate-x-52"
                )}
            >
                <button
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 px-4 transition-all ease-in-out hover:bg-accent"
                    onClick={() => router.push("/profile/courses")}
                >
                    <Icons.bookopencheck className="h-5 w-5" />
                    <p>Courses</p>
                </button>
                <button
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 px-4 transition-all ease-in-out hover:bg-accent"
                    onClick={() => router.push("/profile/billing")}
                >
                    <Icons.billing className="h-5 w-5" />
                    <p>Billing</p>
                </button>
                <button
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 px-4 transition-all ease-in-out hover:bg-accent"
                    onClick={() => router.push("/profile/settings")}
                >
                    <Icons.settings className="h-5 w-5" />
                    <p>Settings</p>
                </button>
            </aside>
            {children}
        </div>
    );
}

export default SideBar;
