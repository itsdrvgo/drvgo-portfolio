"use client";

import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <Button
            aria-label="Login to continue"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/signin")}
        >
            Login
        </Button>
    );
}

export default LoginButton;
