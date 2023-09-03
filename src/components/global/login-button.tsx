"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <button
            className={cn(
                "group flex items-center gap-2 rounded-md border border-border bg-accent-foreground px-3 py-2 font-semibold text-background",
                className
            )}
            onClick={() => router.push("/signin")}
        >
            <Icons.podcast className="h-4 w-4 transition-all ease-in-out group-hover:h-0 group-hover:w-0" />
            <p className="uppercase">Login</p>
            <Icons.login className="h-0 w-0 transition-all ease-in-out group-hover:h-4 group-hover:w-4" />
        </button>
    );
}

export default LoginButton;
