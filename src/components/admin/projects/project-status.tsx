"use client";

import { ResponseData } from "@/src/lib/validation/response";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
    projectState: boolean;
}

interface ProjectResponseData {
    state: boolean;
}

function ProjectStatus({ projectState }: PageProps) {
    const router = useRouter();

    const [isActive, setIsActive] = useState(projectState);
    const [isLoading, setIsLoading] = useState(false);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const handleSwitchChange = (value: boolean) => {
        setIsActive(value);
        onOpen();
    };

    const handleUpdateState = () => {
        setIsLoading(true);

        const toastId = toast.loading("Updating status");

        const body = {
            state: isActive,
        };

        axios
            .post<ResponseData>("/api/projects/status", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, { id: toastId });

                const result = JSON.parse(resData.data) as ProjectResponseData;

                toast.success(
                    `${
                        result.state
                            ? "You'll now receive orders"
                            : "You'll no longer receive orders"
                    }`,
                    { id: toastId }
                );
            })
            .catch((err) => {
                setIsActive(projectState);

                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsLoading(false);
                onClose();
                router.refresh();
            });
    };

    return (
        <>
            <Card radius="sm">
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
                                    onPress={handleUpdateState}
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
