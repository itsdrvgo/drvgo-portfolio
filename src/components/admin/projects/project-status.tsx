"use client";

import { manageProjectState } from "@/src/actions/projects";
import { handleClientError } from "@/src/lib/utils";
import {
    Button,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
    useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
    projectState: boolean;
}

function ProjectStatus({ projectState }: PageProps) {
    const router = useRouter();

    const [isActive, setIsActive] = useState(projectState);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handleSwitchChange = (value: boolean) => {
        setIsActive(value);
        onOpen();
    };

    const { mutate: handleUpdateState, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating status...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const { state } = await manageProjectState({
                state: isActive,
            });

            return {
                state,
            };
        },
        onSuccess({ state }, __, ctx) {
            toast.success(
                `${
                    state
                        ? "You'll now receive orders"
                        : "You'll no longer receive orders"
                }`,
                {
                    id: ctx?.toastId,
                }
            );
            router.refresh();
        },
        onError(err, __, ctx) {
            setIsActive(projectState);
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            onClose();
        },
    });

    return (
        <>
            <Card>
                <CardBody className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xl font-semibold">Status</p>
                        <p className="text-sm text-gray-400">
                            Manage when projects are open for purchase and when
                            they are closed
                        </p>
                    </div>
                    <div>
                        <Switch
                            color="primary"
                            isSelected={isActive}
                            onValueChange={handleSwitchChange}
                        />
                    </div>
                </CardBody>
            </Card>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={() => setIsActive(projectState)}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Update Status</ModalHeader>
                            <ModalBody>
                                <p className="text-gray-400">
                                    Are you sure you want to change the status
                                    to
                                    <span className="font-semibold uppercase">
                                        {isActive ? " active" : " inactive"}
                                    </span>
                                    ?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    isDisabled={isLoading}
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
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    onPress={() => handleUpdateState()}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProjectStatus;
