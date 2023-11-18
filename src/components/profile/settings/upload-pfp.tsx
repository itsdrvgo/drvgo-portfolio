"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, customFetch, handleClientError } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
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
import { useMutation } from "@tanstack/react-query";
import "cropperjs/dist/cropper.css";
import { ResponseData } from "@/src/lib/validation/response";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
}

function UploadPFP({ user }: PageProps) {
    const router = useRouter();
    const cropperRef = useRef<ReactCropperElement>(null);

    const [iconURL, setIconURL] = useState(
        user.imageUrl ?? DEFAULT_USER_IMAGE.src
    );
    const [selectedImage, setSelectedImage] = useState(iconURL);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

    const { mutate: handlePFPUpdate, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating image...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            if (!imageFile) throw new Error("No image selected!");

            const formData = new FormData();
            formData.append("image", imageFile);

            const { data } = await customFetch<ResponseData>(
                `/api/users/${user.id}`,
                {
                    method: "PUT",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return data;
        },
        onSuccess(data, __, ctx) {
            if (data.code !== 200)
                return toast.error(data.message, {
                    id: ctx?.toastId,
                });

            toast.success("Profile picture updated", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
            setIconURL(user.imageUrl ?? DEFAULT_USER_IMAGE.src);
        },
        onSettled() {
            setImageFile(null);
        },
    });

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
                            "flex w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-gray-500 bg-background p-12 text-center md:gap-7",
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
                                base: "h-24 w-24",
                            }}
                        />

                        <input {...getInputProps()} />

                        <p className="text-sm md:text-base">
                            Drag & drop your image here
                        </p>

                        <Button
                            radius="sm"
                            type="button"
                            className="border bg-default-100 font-semibold"
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
                    radius="sm"
                    type="submit"
                    isDisabled={(!isLoading && !imageFile) || isLoading}
                    className="bg-secondary-900 font-semibold"
                    onClick={() => handlePFPUpdate()}
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
