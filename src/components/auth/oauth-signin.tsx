"use client";

import { env } from "@/env.mjs";
import useAuthStore from "@/src/lib/store/auth";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useState } from "react";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

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

function OAuth({ className }: DefaultProps) {
    const { toast } = useToast();

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
        } catch (error) {
            setLoading(null);
            console.log(error);

            const unknownError = "Something went wrong, please try again.";

            isClerkAPIResponseError(error)
                ? toast({
                      title: "Oops!",
                      description: error.errors[0]?.longMessage ?? unknownError,
                      variant: "destructive",
                  })
                : toast({
                      title: "Oops!",
                      description: unknownError,
                      variant: "destructive",
                  });
        }
    };

    return (
        <div
            className={cn("flex items-center justify-between gap-2", className)}
        >
            {providers.map((provider, index) => {
                const Icon = Icons[provider.icon];

                return (
                    <Button
                        aria-label={`Sign in with ${provider.name}`}
                        key={provider.provider}
                        variant="outline"
                        className="flex w-full items-center gap-2 bg-background"
                        onClick={() => void handleLogin(provider.provider)}
                        disabled={
                            isAuthLoading || isLoading === provider.provider
                        }
                    >
                        {isLoading === provider.provider ? (
                            <Icons.spinner className="h-4 w-4 animate-spin" />
                        ) : (
                            <Icon className="h-4 w-4" aria-hidden="true" />
                        )}
                        <p>{provider.name}</p>
                    </Button>
                );
            })}
        </div>
    );
}

export default OAuth;
