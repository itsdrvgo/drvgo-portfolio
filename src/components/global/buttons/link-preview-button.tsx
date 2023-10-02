"use client";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { HTMLAttributes } from "react";

function LinkPreviewButton({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLSpanElement>) {
    const {
        isOpen: redirectIsOpen,
        onClose: redirectOnClose,
        onOpen: redirectOnOpen,
        onOpenChange: redirectOnOpenChange,
    } = useDisclosure();

    return (
        <>
            <span
                className="font-semibold underline"
                onClick={redirectOnOpen}
                {...props}
            >
                {
                    children
                        ?.toString()
                        .replace(/(https?:\/\/)?(www\.)?/g, "")
                        .split("/")[0]
                }
            </span>

            <Modal
                isOpen={redirectIsOpen}
                onOpenChange={redirectOnOpenChange}
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="uppercase">
                                Hold Up
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    This will take you to{" "}
                                    <span className="break-all font-semibold text-primary-500">
                                        {decodeURIComponent(
                                            children?.toString()!
                                        )}
                                    </span>
                                    . Are you sure you want to continue?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
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
                                    onPress={() =>
                                        window.open(children?.toString())
                                    }
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

export default LinkPreviewButton;
