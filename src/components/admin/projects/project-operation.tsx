"use client";

import {
    isAcceptable,
    isCancellable,
    isCompletable,
    isPayable,
    isRejectable,
    isUpdatable,
} from "@/src/lib/projects";
import { chatHrefConstructor } from "@/src/lib/utils";
import { DefaultProps, ExtendedProject } from "@/src/types";
import { useAuth } from "@clerk/nextjs";
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
import { Icons } from "../../icons/icons";
import ProjectAcceptModal from "./modals/project-accept";
import ProjectCancelModal from "./modals/project-cancel";
import ProjectCompleteModal from "./modals/project-complete";
import ProjectPaidModal from "./modals/project-paid";
import ProjectRejectModal from "./modals/project-reject";
import ProjectUpdateModal from "./modals/project-update";

interface PageProps extends DefaultProps {
    data: ExtendedProject;
}

function ProjectOperation({ data }: PageProps) {
    const router = useRouter();

    const { userId } = useAuth();

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
            <Dropdown radius="sm">
                <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                        <Icons.moreVert className="h-4 w-4 text-gray-400" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disabledKeys={[
                        ...(isAcceptable(data.status) ? [] : ["accept"]),
                        ...(isRejectable(data.status) ? [] : ["reject"]),
                        ...(isCompletable({
                            status: data.status,
                            price: data.price,
                            deadline: data.deadline,
                        })
                            ? []
                            : ["complete"]),
                        ...(isCancellable(data.status, true) ? [] : ["cancel"]),
                        ...(isUpdatable(data.status) ? [] : ["update"]),
                        ...(isPayable({
                            status: data.status,
                            price: data.price,
                            deadline: data.deadline,
                        })
                            ? []
                            : ["paid"]),
                    ]}
                >
                    <DropdownSection showDivider title={"Details"}>
                        <DropdownItem
                            key={"copy_id"}
                            startContent={<Icons.user className="h-4 w-4" />}
                            onPress={() => {
                                navigator.clipboard.writeText(data.id);
                                toast.success("ID has been copied");
                            }}
                        >
                            Copy ID
                        </DropdownItem>
                        <DropdownItem
                            key={"copy_purchaser_id"}
                            startContent={<Icons.user className="h-4 w-4" />}
                            onPress={() => {
                                navigator.clipboard.writeText(data.purchaserId);
                                toast.success("Purchaser ID has been copied");
                            }}
                        >
                            Copy Purchaser ID
                        </DropdownItem>
                        <DropdownItem
                            key={"view"}
                            startContent={<Icons.view className="h-4 w-4" />}
                            onPress={() => router.push(`/projects/${data.id}`)}
                        >
                            View
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection showDivider title={"Action"}>
                        <DropdownItem
                            key={"message"}
                            startContent={<Icons.send className="h-4 w-4" />}
                            onPress={() =>
                                router.push(
                                    `/chats/${chatHrefConstructor(
                                        data.purchaserId,
                                        userId!
                                    )}`
                                )
                            }
                        >
                            Message
                        </DropdownItem>
                        <DropdownItem
                            key={"accept"}
                            startContent={<Icons.check className="h-4 w-4" />}
                            color="success"
                            onPress={onAcceptOpen}
                        >
                            Accept
                        </DropdownItem>

                        <DropdownItem
                            key={"reject"}
                            startContent={<Icons.close className="h-4 w-4" />}
                            color="danger"
                            onPress={onRejectOpen}
                        >
                            Reject
                        </DropdownItem>

                        <DropdownItem
                            key={"paid"}
                            startContent={<Icons.dollar className="h-4 w-4" />}
                            color="warning"
                            onPress={onPaidOpen}
                        >
                            Mark as Paid
                        </DropdownItem>

                        <DropdownItem
                            key={"complete"}
                            startContent={
                                <Icons.checkcircle className="h-4 w-4" />
                            }
                            color="success"
                            onPress={onCompleteOpen}
                        >
                            Mark as Completed
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Danger Zone"}>
                        <DropdownItem
                            key={"update"}
                            startContent={<Icons.pencil className="h-4 w-4" />}
                            color="primary"
                            onPress={onUpdateOpen}
                        >
                            Update
                        </DropdownItem>

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

            <ProjectAcceptModal
                isOpen={isAcceptOpen}
                onOpenChange={onAcceptOpenChange}
                onClose={onAcceptClose}
                data={data}
            />

            <ProjectRejectModal
                isOpen={isRejectOpen}
                onOpenChange={onRejectOpenChange}
                onClose={onRejectClose}
                data={data}
            />

            <ProjectCompleteModal
                isOpen={isCompleteOpen}
                onOpenChange={onCompleteOpenChange}
                onClose={onCompleteClose}
                data={data}
            />

            <ProjectUpdateModal
                isOpen={isUpdateOpen}
                onOpenChange={onUpdateOpenChange}
                onClose={onUpdateClose}
                data={data}
            />

            <ProjectCancelModal
                isOpen={isCancelOpen}
                onOpenChange={onCancelOpenChange}
                onClose={onCancelClose}
                data={data}
            />

            <ProjectPaidModal
                isOpen={isPaidOpen}
                onOpenChange={onPaidOpenChange}
                onClose={onPaidClose}
                data={data}
            />
        </>
    );
}

export default ProjectOperation;
