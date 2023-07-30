"use client";

import useSidebarStore from "@/src/lib/store/sideBar";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Icons } from "../../icons/icons";
import { Button } from "../../ui/button";

function SidebarOperation({ className }: DefaultProps) {
    const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);
    const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

    return (
        <Button
            className={cn("top-24 z-50 flex items-center gap-2", className)}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            variant={"outline"}
        >
            <Icons.sidePanel className="h-4 w-4" />
            <p>{isSidebarOpen ? "Collapse" : "Open"}</p>
        </Button>
    );
}

export default SidebarOperation;
