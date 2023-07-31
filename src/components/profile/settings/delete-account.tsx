"use client";

import { env } from "@/env.mjs";
import { User } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
}

function DeleteAccount({ user, className }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    const handleAccountDeletion = async () => {
        setLoading(true);

        await signOut({ callbackUrl: env.NEXT_PUBLIC_APP_URL + "/" });

        axios
            .delete<ResponseData>(`/api/users/${user.id}`)
            .then(({ data: resData }) => {
                setLoading(false);

                switch (resData.code) {
                    case 200:
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
        <div
            className={cn(
                "flex items-center justify-center md:justify-end",
                className
            )}
        >
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant={"destructive"}
                        className="flex items-center gap-1"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Icons.spinner className="h-4 w-4 animate-spin" />
                                <p>Deleting Account</p>
                            </>
                        ) : (
                            <>
                                <Icons.trash className="h-4 w-4" />
                                <p>Delete Account</p>
                            </>
                        )}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure about your account deletion?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleAccountDeletion}
                        >
                            Yes, I&apos;m sure
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default DeleteAccount;
