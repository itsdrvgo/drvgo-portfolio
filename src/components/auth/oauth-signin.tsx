"use client";

import { OAuthData } from "@/src/lib/validation/auth";
import { DefaultProps } from "@/src/types";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Icons } from "../icons/icons";
import { useToast } from "../ui/use-toast";

interface OAuthProviders {
    name: string;
    code: OAuthData["code"];
    icon: keyof typeof Icons;
}

const providers: OAuthProviders[] = [
    {
        name: "Discord",
        code: "discord",
        icon: "discord",
    },
    {
        name: "GitHub",
        code: "github",
        icon: "github",
    },
];

function OAuth({ className }: DefaultProps) {
    const { toast } = useToast();

    const [isLoading, setLoading] = useState(false);

    const handleLogin = (code: OAuthData["code"]) => {
        setLoading(true);

        signIn(code, { callbackUrl: "/profile" })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);

                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className={className}>
            {providers.map((provider, index) => {
                const Icon = Icons[provider.icon];

                return (
                    <button
                        key={index}
                        className="flex w-full cursor-pointer items-center justify-center gap-[6px] rounded border border-gray-600 bg-background py-2 text-xs font-medium md:text-base"
                        onClick={() => handleLogin(provider.code)}
                        disabled={isLoading}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {provider.name}
                    </button>
                );
            })}
        </div>
    );
}

export default OAuth;
