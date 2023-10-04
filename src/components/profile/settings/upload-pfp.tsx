"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import {
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function UploadPFP({ user }: PageProps) {
    const router = useRouter();
    const cropperRef = useRef<ReactCropperElement>(null);

    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [iconURL, setIconURL] = useState(
        user.imageUrl ?? DEFAULT_USER_IMAGE.src
    );
    const [selectedImage, setSelectedImage] = useState(iconURL);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setIsDisabled(!isLoading && !imageFile);
    }, [imageFile, isLoading]);

    const {
        isOpen: isCropOpen,
        onOpen: onCropOpen,
        onOpenChange: onCropOpenChange,
        onClose: onCropClose,
    } = useDisclosure();

    const handleFileUpload = (file: File) => {
        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        onCropOpen();

        toast.success("Upload complete");
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return toast.error("No image selected!");

        const croppedImage = cropper.getCroppedCanvas().toDataURL();

        const byteString = atob(croppedImage.split(",")[1]);
        const mimeString = croppedImage
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const croppedImageBlob = new Blob([ab], { type: mimeString });

        const file = new File([croppedImageBlob], "cropped-image", {
            type: mimeString,
        });

        setImageFile(file);
        setIconURL(croppedImage);
    };

    const handlePFPUpdate = () => {
        setLoading(true);

        const toastId = toast.loading("Updating image");

        if (!imageFile)
            return toast.error("No image selected!", {
                id: toastId,
            });

        const formData = new FormData();
        formData.append("image", imageFile);

        axios
            .put<ResponseData>(`/api/users/${user.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("Profile picture updated", {
                    id: toastId,
                });
            })
            .catch((err) => {
                toast.error(err.message, {
                    id: toastId,
                });
            })
            .finally(() => {
                setLoading(false);
                setImageFile(null);
                router.refresh();
            });
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
                    toast.error(fileRejections[0].errors[0].message)
                }
            >
                {({ getRootProps, getInputProps, open }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "flex w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-md border border-dashed border-gray-500 bg-background p-12 text-center",
                            isDragActive && "bg-sky-900"
                        )}
                    >
                        <Avatar
                            showFallback
                            src={iconURL}
                            alt={user.username!}
                            size="lg"
                            isBordered
                            color="primary"
                            classNames={{
                                base: "h-36 w-36",
                            }}
                        />

                        <input {...getInputProps()} />

                        <p>Drag & drop your image here</p>

                        <Button
                            type="button"
                            className="border font-semibold"
                            radius="sm"
                            startContent={<Icons.upload className="h-4 w-4" />}
                            onPress={open}
                        >
                            Upload Image
                        </Button>
                    </div>
                )}
            </Dropzone>

            <Modal
                isOpen={isCropOpen}
                onOpenChange={onCropOpenChange}
                onClose={onCropClose}
                radius="sm"
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                hideCloseButton={true}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p className="text-xl font-semibold">
                                    Crop Your Image
                                </p>
                                <p className="text-sm text-gray-400">
                                    Crop your image to fit the profile picture
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <Cropper
                                    src={selectedImage}
                                    style={{ height: "100%", width: "100%" }}
                                    initialAspectRatio={1 / 1}
                                    aspectRatio={1 / 1}
                                    guides={true}
                                    crop={handleCrop}
                                    ref={cropperRef}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setImageFile(null);
                                        setIconURL(
                                            user.imageUrl ??
                                                DEFAULT_USER_IMAGE.src
                                        );
                                    }}
                                    className="font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    className="font-semibold"
                                    onPress={() => {
                                        onClose();
                                    }}
                                >
                                    Continue
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex w-full items-center justify-center md:justify-start">
                <Button
                    type="submit"
                    isDisabled={isDisabled || isLoading}
                    className="bg-secondary-900 font-semibold"
                    onClick={handlePFPUpdate}
                    radius="sm"
                    color="success"
                    isLoading={isLoading}
                >
                    {isLoading ? "Updating" : "Update"}
                </Button>
            </div>
        </div>
    );
}

export default UploadPFP;
