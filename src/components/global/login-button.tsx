"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { DefaultProps } from "@/src/types";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <>
            <Button
                variant={"secondary"}
                size={"sm"}
                className={className}
                onClick={() => router.push("/signin")}
            >
                <p className="text-text">Login</p>
            </Button>
        </>
    );
}

export default LoginButton;