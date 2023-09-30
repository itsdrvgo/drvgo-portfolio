"use client";

import { Icons } from "@/src/components/icons/icons";
import {
    isAcceptable,
    isCancellable,
    isCompletable,
    isPayable,
    isRejectable,
    isUpdatable,
} from "@/src/lib/projects";
import { ExtendedProject } from "@/src/types";
import { useAuth } from "@clerk/nextjs";
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownItemProps,
    DropdownMenu,
    DropdownTrigger,
    Selection,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectAcceptModal from "../../admin/projects/modals/project-accept";
import ProjectCancelModal from "../../admin/projects/modals/project-cancel";
import ProjectCompleteModal from "../../admin/projects/modals/project-complete";
import ProjectPaidModal from "../../admin/projects/modals/project-paid";
import ProjectRejectModal from "../../admin/projects/modals/project-reject";
import ProjectUpdateModal from "../../admin/projects/modals/project-update";

interface DropDownOption {
    key: string;
    label: string;
    icon: keyof typeof Icons;
    color: DropdownItemProps["color"];
}

const dropDownOptions: DropDownOption[] = [
    {
        key: "accept",
        label: "Accept Project",
        icon: "check",
        color: "success",
    },
    {
        key: "reject",
        label: "Reject Project",
        icon: "close",
        color: "danger",
    },
    {
        key: "message",
        label: "Message Client",
        icon: "send",
        color: "primary",
    },
    {
        key: "paid",
        label: "Mark as Paid",
        icon: "dollar",
        color: "warning",
    },
    {
        key: "complete",
        label: "Mark as Complete",
        icon: "checkcircle",
        color: "success",
    },
    {
        key: "update",
        label: "Update Project",
        icon: "pencil",
        color: "primary",
    },
    {
        key: "cancel",
        label: "Cancel Project",
        icon: "trash",
        color: "danger",
    },
];

interface PageProps {
    project: ExtendedProject;
}

function ProjectOperations({ project }: PageProps) {
    const router = useRouter();
    const { userId } = useAuth();

    const [selected, setSelected] = useState<Selection>(new Set(["default"]));
    const selectedOptionValue = Array.from(selected)[0];

    const {
        isOpen: isAcceptOpen,
        onOpen: onAcceptOpen,
        onClose: onAcceptClose,
        onOpenChange: onAcceptOpenChange,
    } = useDisclosure();

    const {
        isOpen: isRejectOpen,
        onOpen: onRejectOpen,
        onClose: onRejectClose,
        onOpenChange: onRejectOpenChange,
    } = useDisclosure();

    const {
        isOpen: isCompleteOpen,
        onOpen: onCompleteOpen,
        onClose: onCompleteClose,
        onOpenChange: onCompleteOpenChange,
    } = useDisclosure();

    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
        onOpenChange: onUpdateOpenChange,
    } = useDisclosure();

    const {
        isOpen: isCancelOpen,
        onOpen: onCancelOpen,
        onClose: onCancelClose,
        onOpenChange: onCancelOpenChange,
    } = useDisclosure();

    const {
        isOpen: isPaidOpen,
        onOpen: onPaidOpen,
        onClose: onPaidClose,
        onOpenChange: onPaidOpenChange,
    } = useDisclosure();

    return (
        <>
            <ButtonGroup
                variant="flat"
                className="sticky bottom-10 z-50 backdrop-blur-sm"
            >
                <Button
                    onPress={() => {
                        switch (selectedOptionValue) {
                            case "accept":
                                onAcceptOpen();
                                break;
                            case "reject":
                                onRejectOpen();
                                break;
                            case "complete":
                                onCompleteOpen();
                                break;
                            case "update":
                                onUpdateOpen();
                                break;
                            case "cancel":
                                onCancelOpen();
                                break;
                            case "paid":
                                onPaidOpen();
                                break;
                            case "message":
                                router.push(
                                    `/chats/${project.purchaser.id}--${userId}`
                                );
                                break;
                        }
                    }}
                >
                    {dropDownOptions.find(
                        (option) => option.key === selectedOptionValue
                    )?.label ?? "Select an action"}
                </Button>

                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Button isIconOnly>
                            <Icons.chevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Project Actions"
                        selectedKeys={selected}
                        selectionMode="single"
                        onSelectionChange={setSelected}
                        className="max-w-[300px]"
                        itemClasses={{
                            title: "font-semibold",
                        }}
                        disabledKeys={[
                            ...(isAcceptable(project.status) ? [] : ["accept"]),
                            ...(isRejectable(project.status) ? [] : ["reject"]),
                            ...(isCompletable({
                                status: project.status,
                                price: project.price,
                                deadline: project.deadline,
                            })
                                ? []
                                : ["complete"]),
                            ...(isCancellable(project.status, true)
                                ? []
                                : ["cancel"]),
                            ...(isUpdatable(project.status) ? [] : ["update"]),
                            ...(isPayable({
                                status: project.status,
                                price: project.price,
                                deadline: project.deadline,
                            })
                                ? []
                                : ["paid"]),
                        ]}
                    >
                        {dropDownOptions.map((option) => {
                            const Icon = Icons[option.icon];

                            return (
                                <DropdownItem
                                    key={option.key}
                                    startContent={<Icon className="h-4 w-4" />}
                                    color={option.color}
                                >
                                    {option.label}
                                </DropdownItem>
                            );
                        })}
                    </DropdownMenu>
                </Dropdown>
            </ButtonGroup>

            <ProjectAcceptModal
                isOpen={isAcceptOpen}
                onOpenChange={onAcceptOpenChange}
                onClose={onAcceptClose}
                data={project}
                setSelected={setSelected}
            />

            <ProjectRejectModal
                isOpen={isRejectOpen}
                onOpenChange={onRejectOpenChange}
                onClose={onRejectClose}
                data={project}
                setSelected={setSelected}
            />

            <ProjectCompleteModal
                isOpen={isCompleteOpen}
                onOpenChange={onCompleteOpenChange}
                onClose={onCompleteClose}
                data={project}
                setSelected={setSelected}
            />

            <ProjectUpdateModal
                isOpen={isUpdateOpen}
                onOpenChange={onUpdateOpenChange}
                onClose={onUpdateClose}
                data={project}
                setSelected={setSelected}
            />

            <ProjectCancelModal
                isOpen={isCancelOpen}
                onOpenChange={onCancelOpenChange}
                onClose={onCancelClose}
                data={project}
                setSelected={setSelected}
            />

            <ProjectPaidModal
                isOpen={isPaidOpen}
                onOpenChange={onPaidOpenChange}
                onClose={onPaidClose}
                data={project}
                setSelected={setSelected}
            />
        </>
    );
}

export default ProjectOperations;
