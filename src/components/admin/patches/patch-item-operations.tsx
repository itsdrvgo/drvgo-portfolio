"use client";

import { Icons } from "@/src/components/icons/icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/use-toast";
import { Patch } from "@/src/lib/drizzle/schema";
import { addNotification } from "@/src/lib/utils";
import { PatchPatchData } from "@/src/lib/validation/patches";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PageProps extends DefaultProps {
    patch: Patch;
}

function PatchOperations({ patch, className }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [showPublishAlert, setShowPublishAlert] = useState<boolean>(false);
    const [isPublishLoading, setIsPublishLoading] = useState<boolean>(false);

    const deletePatch = async () => {
        setIsDeleteLoading(true);
        toast({
            description: "Deleting patch...",
        });

        axios
            .delete<ResponseData>(`/api/patches/${patch.id}`)
            .then(({ data: resData }) => {
                setIsDeleteLoading(false);
                setShowDeleteAlert(false);

                if (resData.code !== 204)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Patch has been deleted",
                });

                router.refresh();
            })
            .catch((err) => {
                setIsDeleteLoading(false);
                setShowDeleteAlert(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Patch was not deleted, try again later",
                    variant: "destructive",
                });
            });
    };

    const publishPatch = () => {
        setIsPublishLoading(true);
        toast({
            description: patch.published
                ? "Unpublishing patch..."
                : "Publishing patch...",
        });

        const body: PatchPatchData = {
            description: patch.description ?? "",
            major: patch.major,
            minor: patch.minor,
            patch: patch.patch,
            published: !patch.published,
            action: "publish",
        };

        axios
            .patch<ResponseData>(
                `/api/patches/${patch.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                setIsPublishLoading(false);
                setShowPublishAlert(false);

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: patch.published
                        ? "Patch has been unpublished"
                        : "Patch has been published",
                });

                router.refresh();
            })
            .catch((err) => {
                setIsPublishLoading(false);
                setShowPublishAlert(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: patch.published
                        ? "Error unpublishing the patch, try again later"
                        : "patch was not published, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className={className}>
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link
                            href={`/admin/patches/${patch.id}`}
                            className="flex w-full"
                        >
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onSelect={() => setShowPublishAlert(true)}
                    >
                        {patch.published ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this patch?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deletePatch}>
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
                open={showPublishAlert}
                onOpenChange={setShowPublishAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {patch.published
                                ? "Are you sure you want to unpublish this patch?"
                                : "Are you sure you want to publish this patch?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {patch.published
                                ? "People will not be able to see this patch anymore."
                                : "You still will be able to update this patch anytime you want."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={publishPatch}>
                            {isPublishLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.pencil className="mr-2 h-4 w-4" />
                            )}
                            <span>
                                {" "}
                                {patch.published
                                    ? "Unpublish it!"
                                    : "Publish it!"}
                            </span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default PatchOperations;
