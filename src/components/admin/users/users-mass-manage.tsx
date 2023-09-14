"use client";

import { wait } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import {
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    Selection,
    SelectItem,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    keys: Selection;
}

function UsersMassManage({ className, keys }: PageProps) {
    const { toast } = useToast();

    const {
        isOpen: isMassManageOpen,
        onOpen: onMassManageOpen,
        onClose: onMassManageClose,
        onOpenChange: onMassManageOpenChange,
    } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const handleMassManage = async () => {
        setIsLoading(true);

        await wait(2000);
        setIsLoading(false);
        onMassManageClose();
    };

    return (
        <>
            <Button
                radius="sm"
                onPress={() => {
                    if (keys !== "all" && keys.size === 0) {
                        return toast({
                            title: "Oops!",
                            description:
                                "Please select at least one user to manage",
                            variant: "destructive",
                        });
                    }
                    onMassManageOpen();
                }}
                isDisabled={keys !== "all" && keys.size === 0 ? true : false}
            >
                Manage
            </Button>

            <Modal
                isOpen={isMassManageOpen}
                onOpenChange={onMassManageOpenChange}
                onClose={() => {
                    setAction(null);
                    setRole(null);
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Manage Users</ModalHeader>
                            <ModalBody className="gap-6">
                                <div>
                                    <Select
                                        label="Set Role"
                                        placeholder="Select a role"
                                        labelPlacement="outside"
                                        radius="sm"
                                        classNames={{
                                            value: "capitalize",
                                        }}
                                        onSelectionChange={(keys) => {
                                            const role = Array.from(
                                                keys
                                            ).pop() as string;
                                            setRole(role);
                                        }}
                                    >
                                        {[
                                            "user",
                                            "guest",
                                            "moderator",
                                            "admin",
                                            "owner",
                                        ].map((role) => (
                                            <SelectItem
                                                key={role}
                                                value={role}
                                                title={role}
                                                className="capitalize"
                                            />
                                        ))}
                                    </Select>
                                </div>

                                <Divider />

                                <div>
                                    <Select
                                        label="Danger Zone"
                                        placeholder="Select an action"
                                        labelPlacement="outside"
                                        radius="sm"
                                        classNames={{
                                            value: "capitalize",
                                        }}
                                        disabledKeys={[
                                            "ban",
                                            "unban",
                                            "suspend",
                                            "unsuspend",
                                        ]}
                                        onSelectionChange={(keys) => {
                                            const action = Array.from(
                                                keys
                                            ).pop() as string;
                                            setAction(action);
                                        }}
                                    >
                                        {[
                                            "delete",
                                            "ban",
                                            "unban",
                                            "suspend",
                                            "unsuspend",
                                        ].map((action) => (
                                            <SelectItem
                                                key={action}
                                                value={action}
                                                title={action}
                                                className="capitalize"
                                            />
                                        ))}
                                    </Select>
                                </div>
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
                                    Cancel
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    className="font-semibold"
                                    isDisabled={
                                        isLoading ||
                                        (action == null && role == null)
                                    }
                                    isLoading={isLoading}
                                    onPress={handleMassManage}
                                >
                                    Execute
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default UsersMassManage;
