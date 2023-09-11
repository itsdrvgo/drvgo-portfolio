"use client";

import { env } from "@/env.mjs";
import useAuthStore from "@/src/lib/store/auth";
import { LoginData, loginSchema } from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { EmailLinkFactor, SignInResource } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Icons } from "../icons/icons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function SignInForm() {
    const { toast } = useToast();

    const router = useRouter();

    const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
    const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

    const [expired, setExpired] = useState(false);
    const [verified, setVerified] = useState(false);

    const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
        },
    });

    if (!signInLoaded)
        return (
            <div>
                <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
        );

    const { startMagicLinkFlow, cancelMagicLinkFlow } =
        signIn.createMagicLinkFlow();

    const onSubmit = async (data: LoginData) => {
        setAuthLoading(true);
        setExpired(false);
        setVerified(false);

        let si: SignInResource;

        try {
            si = await signIn.create({ identifier: data.email });

            toast({
                description:
                    "A sign in link has been sent to your email. Please check your inbox.",
            });
        } catch (err) {
            setAuthLoading(false);

            const unknownError = "Something went wrong, please try again.";

            isClerkAPIResponseError(err)
                ? toast({
                      title: "Oops!",
                      description: err.errors[0]?.longMessage ?? unknownError,
                      variant: "destructive",
                  })
                : toast({
                      title: "Oops!",
                      description: unknownError,
                      variant: "destructive",
                  });

            return;
        }

        const siFactor = si.supportedFirstFactors.find(
            (x) =>
                x.strategy === "email_link" && x.safeIdentifier === data.email
        ) as EmailLinkFactor | undefined;

        if (!siFactor || !siFactor.emailAddressId) {
            return toast({
                description:
                    "A sign in link has been sent to your email. Please check your inbox.",
            });
        }

        const res = await startMagicLinkFlow({
            emailAddressId: siFactor.emailAddressId,
            redirectUrl: env.NEXT_PUBLIC_APP_URL + "/verification",
        });

        const verification = res.firstFactorVerification;

        if (verification.verifiedFromTheSameClient()) {
            setVerified(true);
            return;
        } else if (verification.status === "expired") setExpired(true);

        if (res.status === "complete") {
            setAuthLoading(false);
            setActive({ session: res.createdSessionId }).then(() => {
                router.push("/profile");
                toast({
                    description:
                        "Welcome to DRVGO! You have successfully signed in. Please wait while we redirect you to your profile.",
                });
            });
            return;
        }
    };

    if (expired) {
        setAuthLoading(false);
        router.push("/");
        toast({
            description: "Verification link expired, please try again.",
        });
    }
    if (verified) {
        setAuthLoading(false);
        router.push("/profile");
        toast({
            description: "Welcome to DRVGO! You have successfully signed in.",
        });
    }

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) => form.handleSubmit(onSubmit)(...args)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ryomensukuna@jjk.jp"
                                    disabled={isAuthLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="font-semibold"
                    type="submit"
                    color="primary"
                    radius="sm"
                    isDisabled={isAuthLoading}
                    isLoading={isAuthLoading}
                >
                    {isAuthLoading ? <>Signing In</> : <>Sign In</>}
                </Button>
            </form>
        </Form>
    );
}

export { SignInForm };
