"use client";

import { addNotification, cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Button, Image, Input, Progress, Textarea } from "@nextui-org/react";
import NextImage from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "../../global/uploadthing";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function AnnouncementForm({ className, user, ...props }: PageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSend = () => {
        setIsLoading(true);

        const toastId = toast.loading("Sending notification");

        addNotification({
            title: "New Announcement!",
            content:
                "You just received a new announcement from the admin! Check it out!",
            notifierId: user.id,
            props: {
                type: "custom",
                title,
                content,
                imageUrl,
            },
            type: "custom",
        })
            .then(() => {
                toast.success("Notification sent", {
                    id: toastId,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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
                    inputWrapper: "border border-gray-700 bg-background",
                    label: "font-semibold text-lg",
                }}
                radius="sm"
                label="Title"
                labelPlacement="outside"
                placeholder="Title of the notification"
                maxLength={200}
                disabled={isLoading}
                onValueChange={setTitle}
                value={title}
            />

            <div className="space-y-2">
                <p className="text-lg font-semibold">Image</p>

                <Dropzone
                    onDrop={(acceptedFiles) => startUpload(acceptedFiles)}
                    disabled={isLoading || isUploading}
                    maxFiles={
                        permittedFileInfo?.config.image?.maxFileCount ?? 1
                    }
                    onDragEnter={() => setIsDragActive(true)}
                    onDragLeave={() => setIsDragActive(false)}
                    onDropAccepted={() => setIsDragActive(false)}
                    onDropRejected={(fileRejections) => {
                        return toast.error(fileRejections[0].errors[0].message);
                    }}
                    accept={
                        fileTypes && fileTypes.length
                            ? generateClientDropzoneAccept(fileTypes)
                            : undefined
                    }
                >
                    {({ getRootProps, getInputProps, open }) => (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex min-h-[25rem] w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-md border border-dashed border-gray-500 bg-background p-3 text-center md:p-12",
                                isDragActive && "bg-sky-900"
                            )}
                        >
                            <input {...getInputProps()} />

                            {imageUrl && (
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
                            )}

                            {isUploading ? (
                                <div className="w-1/2">
                                    <Progress
                                        radius="sm"
                                        showValueLabel
                                        value={uploadProgress}
                                        label="Uploading"
                                    />
                                </div>
                            ) : (
                                <p>Drop your image here</p>
                            )}

                            {!isUploading && (
                                <div className="flex flex-col items-center gap-2">
                                    <Button
                                        type="button"
                                        className="border font-semibold"
                                        radius="sm"
                                        startContent={
                                            !isUploading && (
                                                <Icons.upload className="h-4 w-4" />
                                            )
                                        }
                                        onPress={open}
                                        isDisabled={isLoading || isUploading}
                                        isLoading={isUploading}
                                    >
                                        Upload Image
                                    </Button>

                                    <p className="text-xs text-gray-400">
                                        (
                                        {permittedFileInfo?.config.image
                                            ?.maxFileSize ?? "Loading..."}
                                        )
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
            </div>

            <Textarea
                placeholder="Content of the notification"
                radius="sm"
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
                    className=" font-semibold"
                    color="primary"
                    onPress={handleSend}
                    radius="sm"
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
