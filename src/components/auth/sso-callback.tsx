"use client";

import { env } from "@/env.mjs";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { Icons } from "../icons/icons";

function SSOCallback({ className, ...props }: DefaultProps) {
    const { handleRedirectCallback } = useClerk();

    useEffect(() => {
        void handleRedirectCallback({
            redirectUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignInUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignUpUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
        });
    }, [handleRedirectCallback]);

    return (
        <div
            className={cn(
                "flex min-h-screen flex-col items-center justify-center gap-4 p-5",
                className
            )}
            {...props}
        >
            <Icons.spinner className="h-10 w-10 animate-spin" />
            <p>Validating, please wait...</p>
        </div>
    );
}

export default SSOCallback;
