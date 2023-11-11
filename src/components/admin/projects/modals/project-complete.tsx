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
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface PageProps {
    project: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectCompleteModal({
    project,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const { mutate: handleProjectComplete, isLoading: isCompleting } =
        useMutation({
            onMutate() {
                const toastId = toast.loading(
                    "Marking project as completed..."
                );
                return {
                    toastId,
                };
            },
            async mutationFn() {
                await manageProjectStatus({
                    id: project.id,
                    props: {
                        status: "completed",
                    },
                });
            },
            onSuccess(_, __, ctx) {
                toast.success("Project has been marked as completed", {
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
                                onPress={() => handleProjectComplete()}
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
