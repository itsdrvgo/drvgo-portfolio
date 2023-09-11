"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <Button
            className={cn(
                "group flex h-9 items-center gap-2 bg-accent-foreground text-sm font-semibold text-background",
                className
            )}
            radius="sm"
            onClick={() => router.push("/auth")}
        >
            <Icons.podcast className="h-4 w-4 transition-all ease-in-out group-hover:h-0 group-hover:w-0" />
            <p className="uppercase">Login</p>
            <Icons.login className="h-0 w-0 transition-all ease-in-out group-hover:h-4 group-hover:w-4" />
        </Button>
    );
}

export default LoginButton;
