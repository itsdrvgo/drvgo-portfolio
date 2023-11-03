"use client";

import { cn } from "@/src/lib/utils";
import { Button, Progress } from "@nextui-org/react";
import { JSX, useState } from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import toast from "react-hot-toast";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Icons } from "../icons/icons";

export interface UploadZoneProps extends DropzoneProps {
    isUploading: boolean;
    fileTypes: string[];
    maxFiles?: number;
    maxFileSize?: string;
    isDisabled?: boolean;
    uploadProgress?: number;
    content?: JSX.Element | null;
    className?: string;
}

function UploadZone({
    isUploading,
    fileTypes,
    maxFiles,
    maxFileSize,
    isDisabled,
    uploadProgress,
    content,
    className,
    ...props
}: UploadZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    return (
        <Dropzone
            disabled={isUploading || isDisabled}
            maxFiles={maxFiles || 1}
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
            {...props}
        >
            {({ getRootProps, getInputProps, open }) => (
                <div
                    {...getRootProps()}
                    className={cn(
                        "flex min-h-[25rem] w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-gray-500 bg-background p-3 text-center md:p-12",
                        className,
                        isDragActive && "bg-sky-900"
                    )}
                >
                    <input {...getInputProps()} />

                    {content && <>{content}</>}

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
                                className="border bg-default-100 font-semibold"
                                radius="sm"
                                startContent={
                                    !isUploading && (
                                        <Icons.upload className="h-4 w-4" />
                                    )
                                }
                                onPress={open}
                                isDisabled={isUploading || isDisabled}
                                isLoading={isUploading}
                            >
                                Upload Image
                            </Button>

                            <p className="text-xs text-gray-400">
                                ({maxFileSize || "Loading..."})
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Dropzone>
    );
}

export default UploadZone;
