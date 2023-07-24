"use client";

import { DefaultProps } from "@/src/types";
import { Button } from "../ui/button";

function LoginButton({ className }: DefaultProps) {
    return (
        <Button variant={"secondary"} size={"sm"} className={className}>
            <p className="text-text">Login</p>
        </Button>
    );
}

export default LoginButton;
