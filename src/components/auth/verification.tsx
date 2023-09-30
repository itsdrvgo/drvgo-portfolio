"use client";

import { env } from "@/env.mjs";
import { isMagicLinkError, MagicLinkErrorCode, useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EmptyPlaceholder } from "../ui/empty-placeholder";

function Verification() {
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState("loading");
    const [isOtherDevice, setIsOtherDevice] = useState(false);

    const { handleMagicLinkVerification } = useClerk();

    useEffect(() => {
        const verify = () => {
            handleMagicLinkVerification({
                redirectUrl: env.NEXT_PUBLIC_APP_URL + "/",
                redirectUrlComplete: env.NEXT_PUBLIC_APP_URL + "/profile",
                onVerifiedOnOtherDevice: () => {
                    setIsOtherDevice(true);
                },
            })
                .then(() => {
                    !isOtherDevice && setVerificationStatus("verified");
                    toast.success(
                        "Welcome to DRVGO! You have successfully signed in"
                    );
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
    }, [handleMagicLinkVerification, isOtherDevice]);

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
        <EmptyPlaceholder
            icon="warning"
            title="Verification"
            description={
                isOtherDevice
                    ? "You have successfully signed in. Check your device from where you signed in initially, to continue."
                    : description
            }
            className="max-w-md"
            endContent={
                !isOtherDevice &&
                verificationStatus === "verified" && (
                    <Button
                        radius="sm"
                        size="sm"
                        onPress={() => router.push("/profile")}
                    >
                        Go to Profile
                    </Button>
                )
            }
        />
    );
}

export default Verification;
