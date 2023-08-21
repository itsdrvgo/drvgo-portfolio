"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <Button
            variant={"default"}
            size={"sm"}
            className={cn("font-semibold", className)}
            onClick={() => router.push("/signin")}
        >
            Login
        </Button>
    );
}

export default LoginButton;
