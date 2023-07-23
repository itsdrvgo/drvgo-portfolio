"use client";

import { Button } from "../ui/button";
import { DefaultProps } from "@/src/types";

function LoginButton({ className }: DefaultProps) {
    return (
        <Button
            variant={"secondary"}
            size={"sm"}
            className={className}
        >
            <p className="text-text">Login</p>
        </Button>
    );
}

export default LoginButton;