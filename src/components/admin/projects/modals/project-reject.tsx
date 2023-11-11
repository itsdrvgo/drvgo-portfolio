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
    Textarea,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
    project: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectRejectModal({
    project,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [rejectedReason, setRejectedReason] = useState(
        project.rejectedReason
    );

    const { mutate: handleProjectReject, isLoading: isRejecting } = useMutation(
        {
            onMutate() {
                const toastId = toast.loading("Rejecting project...");
                return {
                    toastId,
                };
            },
            async mutationFn() {
                await manageProjectStatus({
                    id: project.id,
                    props: {
                        status: "rejected",
                        reason: rejectedReason || "No reason provided",
                    },
                });
            },
            onSuccess(_, __, ctx) {
                toast.success("Project has been rejected", {
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
                        <ModalHeader>Reject Project</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to reject this project?</p>

                            <Textarea
                                variant="bordered"
                                minRows={3}
                                aria-label="Reason for rejection"
                                maxLength={150}
                                minLength={3}
                                placeholder="Enter reason for rejection"
                                onValueChange={setRejectedReason}
                                classNames={{
                                    inputWrapper:
                                        "bg-background border-1 border-border",
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isRejecting}
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
                                isDisabled={isRejecting}
                                isLoading={isRejecting}
                                onPress={() => handleProjectReject()}
                            >
                                Reject
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProjectRejectModal;
