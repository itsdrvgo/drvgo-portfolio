"use client";

import { env } from "@/env.mjs";
import useAuthStore from "@/src/lib/store/auth";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../icons/icons";

interface OAuthProviders {
    name: string;
    provider: OAuthStrategy;
    icon: keyof typeof Icons;
}

const providers: OAuthProviders[] = [
    {
        name: "Discord",
        provider: "oauth_discord",
        icon: "discord",
    },
    {
        name: "GitHub",
        provider: "oauth_github",
        icon: "github",
    },
];

function OAuth({ className, ...props }: DefaultProps) {
    const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

    const [isLoading, setLoading] = useState<OAuthStrategy | null>(null);
    const { signIn, isLoaded: signInLoaded } = useSignIn();

    if (!signInLoaded)
        return (
            <div>
                <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
        );

    const handleLogin = async (provider: OAuthStrategy) => {
        try {
            setLoading(provider);
            await signIn.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: env.NEXT_PUBLIC_APP_URL + "/sso-callback",
                redirectUrlComplete: env.NEXT_PUBLIC_APP_URL + "/profile",
            });
        } catch (err) {
            setLoading(null);
            console.error(err);

            const unknownError = "Something went wrong, please try again.";

            isClerkAPIResponseError(err)
                ? toast.error(err.errors[0]?.longMessage ?? unknownError)
                : toast.error(unknownError);
        }
    };

    return (
        <div
            className={cn(
                "flex w-full items-center justify-center gap-2",
                className
            )}
            {...props}
        >
            {providers.map((provider) => {
                const Icon = Icons[provider.icon];

                return (
                    <Button
                        fullWidth
                        aria-label={`Sign in with ${provider.name}`}
                        radius="sm"
                        variant="light"
                        key={provider.provider}
                        className="border border-gray-700"
                        onPress={() => handleLogin(provider.provider)}
                        isDisabled={
                            isAuthLoading || isLoading === provider.provider
                        }
                        startContent={
                            isLoading !== provider.provider && (
                                <Icon className="h-4 w-4" />
                            )
                        }
                        isLoading={isLoading === provider.provider}
                    >
                        {provider.name}
                    </Button>
                );
            })}
        </div>
    );
}

export default OAuth;
