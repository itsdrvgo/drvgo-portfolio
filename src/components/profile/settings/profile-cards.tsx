"use client";

import { cn } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import UsernameForm from "../../forms/username-form";
import DeleteAccount from "./delete-account";
import UploadPFP from "./upload-pfp";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
}

function ProfileCards({ user, className, ...props }: PageProps) {
    return (
        <div className={cn("space-y-5", className)} {...props}>
            <Card
                classNames={{
                    base: "bg-default-50",
                }}
            >
                <CardHeader className="flex flex-col items-start gap-1 p-6 pb-2">
                    <p className="text-xl font-semibold md:text-2xl">
                        Profile Picture
                    </p>
                    <p className="text-xs text-gray-400 md:text-sm">
                        Change your profile picture
                    </p>
                </CardHeader>
                <CardBody>
                    <UploadPFP user={user} />
                </CardBody>
            </Card>

            <Card
                classNames={{
                    base: "bg-default-50",
                }}
            >
                <CardHeader className="flex flex-col items-start gap-1 p-6 pb-2">
                    <p className="text-xl font-semibold md:text-2xl">
                        Username
                    </p>
                    <p className="text-xs text-gray-400 md:text-sm">
                        Update your username. This is the name that will be used
                        to identify you on the site.
                    </p>
                </CardHeader>
                <CardBody>
                    <UsernameForm user={user} />
                </CardBody>
            </Card>

            <Card
                classNames={{
                    base: "bg-default-50",
                }}
            >
                <CardHeader className="flex flex-col items-start gap-1 p-6 pb-2">
                    <p className="text-xl font-semibold md:text-2xl">
                        Danger Zone
                    </p>
                    <p className="text-xs text-gray-400 md:text-sm">
                        Delete your account permanantly
                    </p>
                </CardHeader>
                <CardBody>
                    <DeleteAccount user={user} />
                </CardBody>
            </Card>
        </div>
    );
}

export default ProfileCards;
