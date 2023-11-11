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

function ProjectAcceptModal({
    project,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const { mutate: handleProjectAccept, isLoading: isAccepting } = useMutation(
        {
            onMutate() {
                const toastId = toast.loading("Accepting project...");
                return {
                    toastId,
                };
            },
            async mutationFn() {
                await manageProjectStatus({
                    id: project.id,
                    props: {
                        status: "accepted",
                    },
                });
            },
            onSuccess(_, __, ctx) {
                toast.success("Project has been accepted", {
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
        }
    );

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Accept Project</ModalHeader>
                        <ModalBody>
                            Are you sure you want to accept this project?
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isAccepting}
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
                                isDisabled={isAccepting}
                                isLoading={isAccepting}
                                onPress={() => handleProjectAccept()}
                            >
                                Accept
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProjectAcceptModal;
