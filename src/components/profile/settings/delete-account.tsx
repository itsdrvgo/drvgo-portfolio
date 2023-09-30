"use client";

import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function DeleteAccount({ user, className }: PageProps) {
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);
    const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

    const handleAccountDeletion = () => {
        setLoading(true);

        const toastId = toast.loading("Deleting account");

        axios
            .delete<ResponseData>(`/api/users/${user.id}`)
            .then(({ data: resData }) => {
                if (resData.code !== 204)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                router.push("/");

                toast.success(resData.message, {
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
                setLoading(false);
                onClose();
            });
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center md:justify-end",
                className
            )}
        >
            <Button
                onPress={onOpen}
                color="danger"
                isDisabled={isLoading}
                radius="sm"
                className="bg-danger-300"
                startContent={<Icons.trash className="h-4 w-4" />}
            >
                {isLoading ? <p>Deleting Account</p> : <p>Delete Account</p>}
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={!isLoading}
                hideCloseButton={isLoading}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Are you sure about your account deletion?
                            </ModalHeader>
                            <ModalBody>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    className="font-semibold"
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    className="font-semibold"
                                    onPress={handleAccountDeletion}
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    Yes, I&apos;m sure
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default DeleteAccount;
