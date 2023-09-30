"use client";

import { cn } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function LoginButton({ className, ...props }: ButtonProps) {
    const router = useRouter();

    return (
        <Button
            aria-label="Login to continue"
            variant="faded"
            className={cn("border border-gray-700", className)}
            radius="sm"
            onPress={() => router.push("/auth")}
            {...props}
        >
            Login
        </Button>
    );
}

export default LoginButton;
