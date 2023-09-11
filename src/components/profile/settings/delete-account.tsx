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
    Spinner,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function DeleteAccount({ user, className }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);
    const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

    const handleAccountDeletion = () => {
        setLoading(true);

        axios
            .delete<ResponseData>(`/api/users/${user.id}`)
            .then(({ data: resData }) => {
                setLoading(false);
                onClose();

                if (resData.code !== 200) return;
                toast({
                    title: "Oops!",
                    description: resData.message,
                    variant: "destructive",
                });

                router.push("/");
                toast({
                    description: "Account deleted",
                });
            })
            .catch((err) => {
                setLoading(false);
                onClose();

                console.log(err);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
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
                className="bg-destructive"
                isDisabled={isLoading}
                radius="sm"
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
                                    onPress={onClose}
                                    isDisabled={isLoading}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="danger"
                                    className="bg-destructive"
                                    radius="sm"
                                    onPress={handleAccountDeletion}
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
