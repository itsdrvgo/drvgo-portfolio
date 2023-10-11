"use client";

import { ResponseData } from "@/src/lib/validation/response";
import { ExtendedProject } from "@/src/types";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Selection,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
    data: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectPaidModal({
    data,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [isPaying, setIsPaying] = useState(false);

    const handleProjectPaid = () => {
        setIsPaying(true);

        const toastId = toast.loading("Marking project as paid...");

        axios
            .patch<ResponseData>(`/api/projects/${data.id}/paid`)
            .then(({ data }) => {
                if (data.code !== 204)
                    return toast.error(data.message, {
                        id: toastId,
                    });

                toast.success("Project has been marked as paid", {
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
                setIsPaying(false);
                setSelected?.(new Set(["default"]));
                onClose();
                router.refresh();
            });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Mark Project as Paid</ModalHeader>
                        <ModalBody>
                            Are you sure you want to manually mark this project
                            as paid?
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isPaying}
                                onPress={onClose}
                                className="font-semibold"
                            >
                                Close
                            </Button>
                            <Button
                                radius="sm"
                                color="primary"
                                variant="flat"
                                className="font-semibold"
                                isDisabled={isPaying}
                                isLoading={isPaying}
                                onPress={handleProjectPaid}
                            >
                                Complete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProjectPaidModal;
