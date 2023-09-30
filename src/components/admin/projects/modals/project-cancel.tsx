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
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
    data: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    description?: ReactNode | string;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectCancelModal({
    data,
    isOpen,
    onOpenChange,
    onClose,
    description,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [isCanceling, setIsCanceling] = useState(false);

    const handleProjectCancel = () => {
        setIsCanceling(true);

        const toastId = toast.loading("Canceling project");

        axios
            .patch<ResponseData>(`/api/projects/${data.id}/cancel`)
            .then(({ data }) => {
                if (data.code !== 204)
                    return toast.error(data.message, {
                        id: toastId,
                    });

                toast.success("Project has been cancelled", {
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
                setIsCanceling(false);
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
                        <ModalHeader>Cancel Project</ModalHeader>
                        <ModalBody>
                            {description ||
                                "Are you sure you want to cancel this project?"}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isCanceling}
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
                                isDisabled={isCanceling}
                                isLoading={isCanceling}
                                onPress={handleProjectCancel}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProjectCancelModal;
