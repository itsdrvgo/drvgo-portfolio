"use client";

import { manageProjectStatus } from "@/src/actions/projects";
import { handleClientError } from "@/src/lib/utils";
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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import toast from "react-hot-toast";

interface PageProps {
    project: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    description?: ReactNode | string;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectCancelModal({
    project,
    isOpen,
    onOpenChange,
    onClose,
    description,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const { mutate: handleProjectCancel, isLoading: isCancelling } =
        useMutation({
            onMutate() {
                const toastId = toast.loading("Cancelling project...");
                return {
                    toastId,
                };
            },
            async mutationFn() {
                await manageProjectStatus({
                    id: project.id,
                    props: {
                        status: "cancelled",
                    },
                });
            },
            onSuccess(_, __, ctx) {
                toast.success("Project has been cancelled", {
                    id: ctx?.toastId,
                });
                router.refresh();
            },
            onError(err, _, ctx) {
                handleClientError(err, ctx?.toastId);
            },
            onSettled() {
                setSelected?.(new Set(["default"]));
                onClose();
            },
        });

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
                                isDisabled={isCancelling}
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
                                isDisabled={isCancelling}
                                isLoading={isCancelling}
                                onPress={() => handleProjectCancel()}
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
