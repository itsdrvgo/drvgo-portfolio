"use client";

import { OAuthData } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
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
        name: "Google",
        code: "google",
        icon: "google",
    },
    {
        name: "GitHub",
        code: "github",
        icon: "github",
    },
];

function OAuth({ className }: DefaultProps) {
    const { toast } = useToast();

    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const handleLogin = (code: OAuthData["code"]) => {
        const data: OAuthData = {
            code,
        };

        axios
            .post<ResponseData>("/api/users/create/oauth", data)
            .then(({ data: resData }) => {
                setLoading(false);

                switch (resData.code) {
                    case 201:
                        toast({
                            description: "Welcome, " + resData.data + "!",
                        });
                        router.push("/");
                        break;

                    case 409:
                        toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });
                        router.push("/");
                        break;

                    default:
                        toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });
                        break;
                }
            })
            .catch(() => {
                setLoading(false);
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
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded border border-gray-600 bg-background py-2 font-medium"
                        onClick={() => handleLogin(provider.code)}
                    >
                        {isLoading ? (
                            <Icons.spinner
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <Icon className="h-4 w-4" aria-hidden="true" />
                        )}
                        {provider.name}
                    </button>
                );
            })}
        </div>
    );
}

export default OAuth;
