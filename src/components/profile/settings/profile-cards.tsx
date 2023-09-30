"use client";

import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import UsernameForm from "../../forms/username-form";
import DeleteAccount from "./delete-account";
import UploadPFP from "./upload-pfp";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function ProfileCards({ className, user }: PageProps) {
    return (
        <>
            <Card>
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

            <Card>
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

            <Card>
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
        </>
    );
}

export default ProfileCards;
