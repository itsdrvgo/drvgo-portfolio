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
import { useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function UploadPFP({ user }: PageProps) {
    const cropperRef = useRef<ReactCropperElement>(null);
    const [isLoading, setLoading] = useState(false);
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

    const handlePFPUpdate = () => {
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
                .then(({ data: resData }) => {
                    setLoading(false);
                    if (resData.code !== 200)
                        return toast.error(resData.message);

                    toast.success("Profile picture updated");
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err.message);
                });
        };
        reader.readAsDataURL(imageFile!);
    };

    const handleFileUpload = (file: File) => {
        toast.success("Upload complete");

        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        onCropOpen();
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
                onClose={() => {
                    if (
                        selectedImage !== DEFAULT_USER_IMAGE.src ||
                        selectedImage !== user.imageUrl
                    ) {
                        setIconURL(user.imageUrl ?? DEFAULT_USER_IMAGE.src);
                    }
                }}
                radius="sm"
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
                    isDisabled={
                        isLoading ||
                        iconURL === user.imageUrl ||
                        iconURL === DEFAULT_USER_IMAGE.src
                    }
                    className="flex w-max items-center gap-2 bg-secondary-900 font-semibold"
                    onClick={handlePFPUpdate}
                    radius="sm"
                    color="success"
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
