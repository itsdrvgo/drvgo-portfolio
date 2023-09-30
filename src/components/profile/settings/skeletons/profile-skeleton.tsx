"use client";

import { DefaultProps } from "@/src/types";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Skeleton,
} from "@nextui-org/react";

function ProfileSkeleton({ className }: DefaultProps) {
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
                    <div className="flex w-full flex-col items-center justify-center gap-7 rounded-md border border-dashed border-gray-500 p-12">
                        <Skeleton className="h-40 w-40 rounded-full" />
                        <p>Drag & drop your image here</p>
                        <Skeleton className="h-9 w-36 rounded-md" />
                    </div>
                </CardBody>
                <CardFooter className="p-6 pt-2">
                    <Skeleton className="h-10 w-28 rounded-md" />
                </CardFooter>
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
                    <Skeleton className="h-11 w-full rounded-md md:w-2/5" />
                </CardBody>
                <CardFooter className="p-6 pt-2">
                    <Skeleton className="h-10 w-28 rounded-md" />
                </CardFooter>
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
                <CardFooter className="justify-end p-6 pt-2">
                    <Skeleton className="h-10 w-36 rounded-md" />
                </CardFooter>
            </Card>
        </>
    );
}

export default ProfileSkeleton;
