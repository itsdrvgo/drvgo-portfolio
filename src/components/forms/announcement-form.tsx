"use client";

import { addNotification, cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { useAuth } from "@clerk/nextjs";
import { Button, Image, Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import NextImage from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { z } from "zod";
import { Icons } from "../icons/icons";

const uploadDataParser = z.object({
    url: z.string(),
    key: z.string(),
    name: z.string(),
    size: z.number(),
});

function NotificationForm({ className, ...props }: DefaultProps) {
    const { userId } = useAuth();

    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleSend = () => {
        setIsLoading(true);

        const toastId = toast.loading("Sending notification");

        addNotification({
            title: "New Announcement!",
            content:
                "You just received a new announcement from the admin! Check it out!",
            notifierId: userId!,
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

    const handleFileUpload = (file: File) => {
        setIsImageUploading(true);

        const toastId = toast.loading("Uploading image");

        const formData = new FormData();
        formData.append("file", file);

        axios
            .post<ResponseData>("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                const { url } = uploadDataParser.parse(resData.data);
                setImageUrl(url);

                toast.success("Image uploaded", {
                    id: toastId,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message, {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsImageUploading(false);
            });
    };

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
                    onDrop={(acceptedFiles) =>
                        handleFileUpload(acceptedFiles[0])
                    }
                    accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpeg"],
                        "image/jpg": [".jpg"],
                    }}
                    disabled={isLoading || isImageUploading}
                    maxFiles={1}
                    onDragEnter={() => setIsDragActive(true)}
                    onDragLeave={() => setIsDragActive(false)}
                    onDropAccepted={() => setIsDragActive(false)}
                    maxSize={2 * 1024 * 1024}
                    onDropRejected={(fileRejections) =>
                        toast.error(fileRejections[0].errors[0].message)
                    }
                >
                    {({ getRootProps, getInputProps, open }) => (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex min-h-[25rem] w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-md border border-dashed border-gray-500 bg-background p-3 text-center md:p-12",
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

                            <p>Drag & drop your image here</p>

                            <Button
                                type="button"
                                className="border font-semibold"
                                radius="sm"
                                startContent={
                                    !isImageUploading && (
                                        <Icons.upload className="h-4 w-4" />
                                    )
                                }
                                onPress={open}
                                isDisabled={isLoading || isImageUploading}
                                isLoading={isImageUploading}
                            >
                                Upload Image
                            </Button>
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
                >
                    Send
                </Button>
            </div>
        </div>
    );
}

export default NotificationForm;
