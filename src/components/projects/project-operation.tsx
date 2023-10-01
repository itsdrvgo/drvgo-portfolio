"use client";

import { isCancellable, isEditable, isMessageable } from "@/src/lib/projects";
import { chatHrefConstructor } from "@/src/lib/utils";
import { DefaultProps, ExtendedProject } from "@/src/types";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectCancelModal from "../admin/projects/modals/project-cancel";
import { Icons } from "../icons/icons";

interface PageProps extends DefaultProps {
    project: ExtendedProject;
    ownerId: string;
}

function ProjectOperation({ project, ownerId }: PageProps) {
    const router = useRouter();

    const {
        isOpen: isCancelOpen,
        onOpen: onCancelOpen,
        onClose: onCancelClose,
        onOpenChange: onCancelOpenChange,
    } = useDisclosure();

    return (
        <>
            <Dropdown radius="sm">
                <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                        <Icons.moreVert className="h-4 w-4 text-gray-400" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disabledKeys={[
                        ...(isCancellable(project.status, false)
                            ? []
                            : ["cancel"]),
                        ...(isEditable(project.status) ? [] : ["edit"]),
                        ...(isMessageable(project.status) ? [] : ["message"]),
                    ]}
                >
                    <DropdownSection showDivider title={"Details"}>
                        <DropdownItem
                            key={"copy_id"}
                            startContent={<Icons.user className="h-4 w-4" />}
                            onPress={() => {
                                navigator.clipboard.writeText(project.id);
                                toast.success("ID has been copied");
                            }}
                        >
                            Copy ID
                        </DropdownItem>

                        <DropdownItem
                            key={"view"}
                            startContent={<Icons.view className="h-4 w-4" />}
                            onPress={() => {
                                router.push(`/projects/${project.id}`);
                            }}
                        >
                            View
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection showDivider title={"Actions"}>
                        <DropdownItem
                            key={"message"}
                            startContent={<Icons.send className="h-4 w-4" />}
                            onPress={() => {
                                router.push(
                                    `/chats/${chatHrefConstructor(
                                        ownerId,
                                        project.purchaserId
                                    )}`
                                );
                            }}
                        >
                            Message Seller
                        </DropdownItem>

                        <DropdownItem
                            key={"edit"}
                            startContent={<Icons.pencil className="h-4 w-4" />}
                            onPress={() =>
                                router.push(`/projects/${project.id}/edit`)
                            }
                        >
                            Edit
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Danger Zone"}>
                        <DropdownItem
                            key={"cancel"}
                            startContent={<Icons.trash className="h-4 w-4" />}
                            color="danger"
                            onPress={onCancelOpen}
                        >
                            Cancel
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            <ProjectCancelModal
                data={project}
                isOpen={isCancelOpen}
                onOpenChange={onCancelOpenChange}
                onClose={onCancelClose}
                description={
                    <>
                        <p>
                            Are you sure you want to cancel this project? This
                            action cannot be undone.
                        </p>
                        <p className="italic text-gray-400">
                            A 10% fee will be applied to the total price of your
                            next order.
                        </p>
                    </>
                }
            />
        </>
    );
}

export default ProjectOperation;
