"use client";

import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import Dropzone from "react-dropzone";
import { Icons } from "../../icons/icons";
import { AlertDescription } from "../../ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";
import "cropperjs/dist/cropper.css";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import axios from "axios";

interface PageProps extends DefaultProps {
    user: User;
}

function UploadPFP({ user }: PageProps) {
    const { toast } = useToast();

    const cropperRef = useRef<ReactCropperElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [iconURL, setIconURL] = useState(user.image ?? defaultUserPFP.src);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(iconURL);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handlePFPUpdate = async () => {
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryString = event.target?.result;
            const base64String = btoa(binaryString as string);

            const jsonData = {
                image: base64String,
            };

            axios
                .put<ResponseData>(`/api/users/${user.id}`, jsonData)
                .then(async ({ data: resData }) => {
                    setLoading(false);
                    if (resData.code !== 200)
                        return toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });

                    toast({
                        description: "Profile picture updated",
                    });
                })
                .catch((err) => {
                    setLoading(false);
                    toast({
                        title: "Oops!",
                        description: err.message,
                        variant: "destructive",
                    });
                });
        };
        reader.readAsDataURL(imageFile!);
    };

    const handleFileUpload = (file: File) => {
        toast({
            description: "Upload complete",
        });

        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setOpen(true);
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        setIconURL(cropper?.getCroppedCanvas().toDataURL()!);
    };

    return (
        <div className="space-y-10">
            <Dropzone
                onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles[0])}
                accept={{
                    "image/png": [".png"],
                    "image/jpeg": [".jpeg"],
                    "image/jpg": [".jpg"],
                }}
                maxFiles={1}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
                onDropAccepted={() => setIsDragActive(false)}
                maxSize={2 * 1024 * 1024}
                onDropRejected={(fileRejections) =>
                    toast({
                        title: "Oops!",
                        description: fileRejections[0].errors[0].message,
                        variant: "destructive",
                    })
                }
            >
                {({ getRootProps, getInputProps }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "flex w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-md border border-dashed border-gray-500 p-12 text-center",
                            isDragActive && "bg-sky-900"
                        )}
                    >
                        <Avatar className="h-36 w-36 border border-gray-700">
                            <AvatarImage src={iconURL} alt={user.username} />
                            <AvatarFallback>
                                {user.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <input {...getInputProps()} />

                        <p>Drag & drop your image here</p>

                        <Button
                            variant={"secondary"}
                            className="flex items-center gap-2 border border-gray-600"
                        >
                            <Icons.upload className="h-4 w-4" />
                            <p>Upload Image</p>
                        </Button>
                    </div>
                )}
            </Dropzone>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Crop Your Image</AlertDialogTitle>
                        <AlertDescription>
                            Crop your image to fit the profile picture
                        </AlertDescription>
                    </AlertDialogHeader>

                    <Cropper
                        src={selectedImage}
                        style={{ height: "100%", width: "100%" }}
                        initialAspectRatio={1 / 1}
                        aspectRatio={1 / 1}
                        guides={true}
                        crop={handleCrop}
                        ref={cropperRef}
                    />

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() =>
                                setIconURL(user.image ?? defaultUserPFP.src)
                            }
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
