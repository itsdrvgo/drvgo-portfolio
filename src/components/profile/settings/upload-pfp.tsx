"use client";

import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
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

    const [isLoading, setLoading] = useState(false);
    const [iconURL, setIconURL] = useState(user.image ?? defaultUserPFP.src);

    const handlePFPUpdate = async () => {
        toast({
            title: "Oops!",
            description: "Updating profile picture is not yet supported",
            variant: "destructive",
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

                <div className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-500 p-5">
                    <Button
                        variant={"secondary"}
                        className="flex items-center gap-2 border border-gray-500"
                        onClick={() => {
                            toast({
                                title: "Oops!",
                                description:
                                    "Updating profile picture is not yet supported",
                                variant: "destructive",
                            });
                        }}
                    >
                        <Icons.upload className="h-4 w-4" />
                        <p>Upload Image</p>
                    </Button>
                    <p className="text-xs text-gray-600">(2 MB)</p>
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

{
    /* <UploadButton
                        endpoint="profilePicture"
                        onClientUploadComplete={(res) => {
                            if (!res)
                                return toast({
                                    title: "Oops!",
                                    description: "Error uploading your image",
                                    variant: "destructive",
                                });

                            setIconURL(res[0].url);
                            toast({
                                description: "Upload complete",
                            });
                        }}
                        onUploadError={(error) => {
                            console.log(error);
                            toast({
                                title: "Oops!",
                                description: error.message,
                                variant: "destructive",
                            });
                        }}
                    /> */
}
