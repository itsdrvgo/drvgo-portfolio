"use client";

import { env } from "@/env.mjs";
import { useClerk } from "@clerk/nextjs";
import { Spinner, SpinnerProps } from "@nextui-org/react";
import { useEffect } from "react";

function SSOCallback({ ...props }: SpinnerProps) {
    const { handleRedirectCallback } = useClerk();

    useEffect(() => {
        void handleRedirectCallback({
            redirectUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignInUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignUpUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
        });
    }, [handleRedirectCallback]);

    return (
        <Spinner
            size="lg"
            color="white"
            label="Validating, please wait..."
            {...props}
        />
    );
}

export default SSOCallback;
