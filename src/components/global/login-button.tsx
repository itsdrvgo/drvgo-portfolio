"use client";

import { DefaultProps } from "@/src/types";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function LoginButton({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <Button
            variant={"default"}
            size={"sm"}
            className={className}
            onClick={() => router.push("/signin")}
        >
            Login
        </Button>
    );
}

export default LoginButton;
