"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function LoginButton() {
    const router = useRouter();

    return (
        <Button
            aria-label="Login to continue"
            color="secondary"
            radius="sm"
            className="border border-gray-700"
            onPress={() => router.push("/auth")}
        >
            Login
        </Button>
    );
}

export default LoginButton;
