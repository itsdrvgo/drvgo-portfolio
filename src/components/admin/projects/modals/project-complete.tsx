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

function ProjectCompleteModal({
    data,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [isCompleting, setIsCompleting] = useState(false);

    const handleProjectComplete = () => {
        setIsCompleting(true);

        const toastId = toast.loading("Marking project as completed");

        axios
            .patch<ResponseData>(`/api/projects/${data.id}/complete`)
            .then(({ data }) => {
                if (data.code !== 204)
                    return toast.error(data.message, {
                        id: toastId,
                    });

                toast.success("Project has been marked as completed", {
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
                setIsCompleting(false);
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
                        <ModalHeader>Mark Project as Completed</ModalHeader>
                        <ModalBody>
                            Are you sure you want to mark this project as
                            completed?
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isCompleting}
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
                                isDisabled={isCompleting}
                                isLoading={isCompleting}
                                onPress={handleProjectComplete}
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

export default ProjectCompleteModal;
