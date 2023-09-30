"use client";

import { ProjectPatchData } from "@/src/lib/validation/project";
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
    Textarea,
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

function ProjectRejectModal({
    data,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectedReason, setRejectedReason] = useState(data.rejectedReason);

    const handleProjectReject = () => {
        setIsRejecting(true);

        const toastId = toast.loading("Rejecting project");

        const body: Pick<ProjectPatchData, "rejectedReason"> = {
            rejectedReason: rejectedReason || "No reason provided",
        };

        axios
            .patch<ResponseData>(
                `/api/projects/${data.id}/reject`,
                JSON.stringify(body)
            )
            .then(({ data }) => {
                if (data.code !== 204)
                    return toast.error(data.message, {
                        id: toastId,
                    });

                toast.success("Project has been rejected", {
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
                setIsRejecting(false);
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
                        <ModalHeader>Reject Project</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to reject this project?</p>

                            <Textarea
                                radius="sm"
                                variant="bordered"
                                minRows={3}
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
                                onPress={handleProjectReject}
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
