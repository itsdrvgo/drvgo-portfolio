"use client";

import { addNotificationToAllUsers } from "@/src/actions/notifications";
import { cn, handleClientError } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Button, Image, Input, Textarea } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import NextImage from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useUploadThing } from "../../global/uploadthing";
import UploadZone from "../../ui/uploadzone";

const announcementSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character long")
        .max(200, "Title must be at most 200 characters long"),
    content: z.string().min(1, "Content must be at least 1 character long"),
    imageUrl: z.string().nullable(),
});

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
}

function AnnouncementForm({ className, user, ...props }: PageProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [uploadProgress, setUploadProgress] = useState(0);

    const { mutate: handleSend, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Sending notification...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            announcementSchema.parse({
                title,
                content,
                imageUrl,
            });

            await addNotificationToAllUsers({
                content,
                notifierId: user.id,
                title,
                type: "custom",
                props: {
                    type: "custom",
                    title,
                    content,
                    imageUrl,
                },
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Notification sent", {
                id: ctx?.toastId,
            });
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
        "announcementThumbnail",
        {
            onUploadBegin: () => {
                return toast.success(
                    "Uploading image, this may take a while..."
                );
            },
            onUploadProgress: (p) => {
                setUploadProgress(p);
            },
            onUploadError: (err) => {
                console.error(err);
                return toast.error(err.message);
            },
            onClientUploadComplete: (res) => {
                if (!res) return toast.error("Something went wrong!");
                const upload = res[0];

                if (!upload || !upload.url)
                    return toast.error("Something went wrong!");

                const { url } = upload;
                setImageUrl(url);
                return toast.success("Image uploaded");
            },
        }
    );

    const fileTypes = permittedFileInfo?.config
        ? Object.keys(permittedFileInfo?.config)
        : [];

    return (
        <div className={cn("space-y-5", className)} {...props}>
            <Input
                classNames={{
                    inputWrapper: "bg-background border border-gray-700",
                    label: "font-semibold text-lg",
                }}
                label="Title"
                labelPlacement="outside"
                placeholder="Title of the notification"
                maxLength={200}
                isDisabled={isLoading}
                onValueChange={setTitle}
                value={title}
            />

            <div className="space-y-2">
                <p className="text-lg font-semibold">Image</p>

                <UploadZone
                    isUploading={isUploading}
                    fileTypes={fileTypes}
                    maxFiles={permittedFileInfo?.config.image?.maxFileCount}
                    maxFileSize={permittedFileInfo?.config.image?.maxFileSize}
                    isDisabled={isLoading}
                    uploadProgress={uploadProgress}
                    onDrop={(acceptedFiles) => startUpload(acceptedFiles)}
                    className="rounded-xl border-gray-700"
                    content={
                        imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Notification image"
                                classNames={{
                                    wrapper: "border",
                                }}
                                radius="sm"
                                as={NextImage}
                                className="h-full w-full"
                                width={1000}
                                height={1000}
                            />
                        ) : null
                    }
                />
            </div>

            <Textarea
                placeholder="Content of the notification"
                classNames={{
                    inputWrapper: "border border-gray-700 bg-background",
                    label: "font-semibold text-lg",
                    input: "text-base",
                }}
                label="Content"
                labelPlacement="outside"
                minRows={8}
                maxRows={400}
                isDisabled={isLoading}
                onValueChange={setContent}
                value={content}
            />

            <div className="sticky bottom-10 z-50 flex items-center justify-center">
                <Button
                    className="font-semibold"
                    radius="full"
                    color="primary"
                    onPress={() => handleSend()}
                    isLoading={isLoading}
                    isDisabled={isLoading || (!title && !content && !imageUrl)}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}

export default AnnouncementForm;
