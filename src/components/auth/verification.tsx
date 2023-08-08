"use client";

import { env } from "@/env.mjs";
import { isMagicLinkError, MagicLinkErrorCode, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Header } from "./header";

function Verification() {
    const { toast } = useToast();

    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState("loading");
    const [isOtherDevice, setIsOtherDevice] = useState(false);

    const { handleMagicLinkVerification } = useClerk();

    useEffect(() => {
        const verify = async () => {
            handleMagicLinkVerification({
                redirectUrl: env.NEXT_PUBLIC_APP_URL + "/",
                redirectUrlComplete: env.NEXT_PUBLIC_APP_URL + "/profile",
                onVerifiedOnOtherDevice: () => {
                    setIsOtherDevice(true);
                },
            })
                .then(() => {
                    !isOtherDevice && setVerificationStatus("verified");
                    toast({
                        description:
                            "Welcome to DRVGO! You have successfully signed in.",
                    });
                })
                .catch((err) => {
                    let status = "failed";
                    if (
                        isMagicLinkError(err) &&
                        err.code === MagicLinkErrorCode.Expired
                    ) {
                        status = "expired";
                    }
                    setVerificationStatus(status);
                });
        };
        verify();
    }, [handleMagicLinkVerification, isOtherDevice, toast]);

    let description: string;

    switch (verificationStatus) {
        case "loading":
            description =
                "Please wait while we verify your email. This may take a few seconds.";
            break;
        case "failed":
            description = "Verification failed. Please try again.";
            break;
        case "expired":
            description = "Verification link expired, please try again.";
            break;
        case "verified":
            description =
                "Successfully signed in. Click the button below to go to your profile.";
            break;
        default:
            description =
                "Please verify your email by clicking the link in your inbox.";
            break;
    }

    return (
        <div className="w-full space-y-5 rounded-md border border-white bg-secondary p-6 md:p-10">
            <Header
                title="Verification"
                description={
                    isOtherDevice
                        ? "You have successfully signed in. Check your device from where you signed in initially, to continue."
                        : description
                }
                size="sm"
            />
            {!isOtherDevice && verificationStatus === "verified" && (
                <Button size={"sm"} onClick={() => router.push("/profile")}>
                    Go to Profile
                </Button>
            )}
        </div>
    );
}

export default Verification;
