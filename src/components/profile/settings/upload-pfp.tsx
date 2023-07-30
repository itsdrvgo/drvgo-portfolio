"use client";

import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { UserUpdateData } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadButton } from "../../global/uploadthing";
import { Icons } from "../../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
}

function UploadPFP({ user }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);
    const [iconURL, setIconURL] = useState(user.image ?? defaultUserPFP.src);

    const handlePFPUpdate = () => {
        setLoading(true);

        const data: UserUpdateData = {
            icon: iconURL!,
        };

        axios
            .patch<ResponseData>(`/api/users/${user.id}`, JSON.stringify(data))
            .then(({ data: resData }) => {
                setLoading(false);

                switch (resData.code) {
                    case 200:
                        toast({
                            description: "Profile picture updated",
                        });
                        router.refresh();
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
        <div className="space-y-10">
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-20">
                <Avatar className="h-36 w-36 border border-gray-700">
                    <AvatarImage src={iconURL!} alt={user.name!} />
                    <AvatarFallback>
                        {user.name!.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-gray-400">Upload Icon</p>

                    <UploadButton
                        endpoint="profilePicture"
                        onClientUploadComplete={(res) => {
                            if (!res)
                                return toast({
                                    title: "Oops!",
                                    description: "Error uploading your image",
                                    variant: "destructive",
                                });

                            setIconURL(res[0].fileUrl);
                            toast({
                                description: "Upload complete",
                            });
                        }}
                        onUploadError={(error) => {
                            toast({
                                title: "Oops!",
                                description: error.message,
                                variant: "destructive",
                            });
                        }}
                    />
                </div>
            </div>

            <div className="flex w-full items-center justify-center md:justify-start">
                <Button
                    disabled={
                        isLoading ||
                        iconURL === user.image ||
                        iconURL === defaultUserPFP.src
                    }
                    className="flex w-max items-center gap-2 bg-white hover:bg-gray-200"
                    onClick={handlePFPUpdate}
                >
                    {isLoading ? (
                        <>
                            <Icons.spinner
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                            <p>Updating</p>
                        </>
                    ) : (
                        <p>Update</p>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default UploadPFP;
