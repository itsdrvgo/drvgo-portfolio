"use client";

import { deleteUser } from "@/src/actions/users";
import { cn, handleClientError } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
}

function DeleteAccount({ user, className }: PageProps) {
    const router = useRouter();
    const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

    const { mutate: deleteAccount, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Deleting account...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            await deleteUser({
                id: user.id,
                user,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Account deleted", {
                id: ctx?.toastId,
            });
            router.push("/");
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onClose();
        },
    });

    return (
        <div
            className={cn(
                "flex items-center justify-center md:justify-end",
                className
            )}
        >
            <Button
                onPress={onOpen}
                radius="sm"
                color="danger"
                isDisabled={isLoading}
                className="bg-red-700"
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
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    className="font-semibold"
                                    onPress={() => deleteAccount()}
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
