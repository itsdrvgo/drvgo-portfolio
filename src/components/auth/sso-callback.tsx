"use client";

import { env } from "@/env.mjs";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { Icons } from "../icons/icons";

function SSOCallback() {
    const { handleRedirectCallback } = useClerk();

    useEffect(() => {
        void handleRedirectCallback({
            redirectUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignInUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
            afterSignUpUrl: env.NEXT_PUBLIC_APP_URL + "/profile",
        });
    }, [handleRedirectCallback]);

    return (
        <>
            <Icons.spinner className="h-10 w-10 animate-spin" />
            <p>Validating, please wait...</p>
        </>
    );
}

export default SSOCallback;
