"use client";

import { BitFieldPermissions } from "@/src/config/const";
import { checkRoleHierarchy, hasPermission } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedRole, CachedUser } from "@/src/types/cache";
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectedItems,
    SelectItem,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

interface PageProps extends DefaultProps {
    target: CachedUser;
    user: ClerkUser;
    roles: CachedRole[];
}

function UsersOperation({ target, user, roles }: PageProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
        onOpenChange: onDeleteOpenChange,
    } = useDisclosure();

    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
        onOpenChange: onUpdateOpenChange,
    } = useDisclosure();

    const userRoles = user.privateMetadata.roles;
    const targetRoles = target.roles;

    const [finalRoles, setFinalRoles] = useState<string[]>(targetRoles);

    const handleUserDelete = () => {
        if (user.id === target.id)
            return toast.error("You cannot delete your own account!");

        if (!checkRoleHierarchy(userRoles, targetRoles, roles))
            return toast.error(
                "You don't have permission to execute this action!"
            );

        setIsDeleting(true);

        const toastId = toast.loading("Deleting user...");

        axios
            .delete<ResponseData>(`/api/users/${target.id}`)
            .then(({ data: resData }) => {
                if (resData.code !== 204)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("User has been deleted", {
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
                setIsDeleting(false);
                onDeleteClose();
                router.refresh();
            });
    };

    const handleRoleUpdate = () => {
        if (!checkRoleHierarchy(userRoles, targetRoles, roles))
            return toast.error(
                "You don't have permission to execute this action!"
            );

        setIsUpdating(true);

        const toastId = toast.loading("Updating user role...");

        axios
            .patch<ResponseData>(
                `/api/users/${target.id}`,
                JSON.stringify({ roles: finalRoles })
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("User role has been updated", {
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
                setIsUpdating(false);
                onUpdateClose();
                router.refresh();
            });
    };

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
                        user.id === target.id ? "delete" : "",
                        !hasPermission(
                            user.privateMetadata.permissions,
                            BitFieldPermissions.Administrator
                        )
                            ? "copy_email"
                            : "",
                        hasPermission(
                            target.permissions,
                            BitFieldPermissions.ManageUsers
                        )
                            ? "delete"
                            : "",
                        user.id === target.id
                            ? hasPermission(
                                  user.privateMetadata.permissions,
                                  BitFieldPermissions.Administrator
                              )
                                ? ""
                                : "update_role"
                            : checkRoleHierarchy(userRoles, targetRoles, roles)
                            ? ""
                            : "update_role",
                    ]}
                >
                    <DropdownSection showDivider title={"Details"}>
                        <DropdownItem
                            key={"copy_id"}
                            startContent={
                                <Icons.user className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() => {
                                navigator.clipboard.writeText(target.id);
                                toast.success("ID has been copied");
                            }}
                        >
                            Copy ID
                        </DropdownItem>
                        <DropdownItem
                            key={"copy_email"}
                            startContent={
                                <Icons.email className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() => {
                                navigator.clipboard.writeText(target.email);
                                toast.success("Email has been copied");
                            }}
                        >
                            Copy Email
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Manage Role"}>
                        <DropdownItem
                            key={"update_role"}
                            startContent={
                                <Icons.userSettings className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() => onUpdateOpen()}
                        >
                            Update Roles
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title={"Danger Zone"}>
                        <DropdownItem
                            key={"delete"}
                            startContent={
                                <Icons.trash className="h-4 w-4 text-gray-400" />
                            }
                            color="danger"
                            onPress={onDeleteOpen}
                        >
                            Delete User
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            <Modal isOpen={isUpdateOpen} onOpenChange={onUpdateOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add or Remove Roles</ModalHeader>
                            <ModalBody>
                                <Select
                                    items={roles.sort(
                                        (a, b) =>
                                            b.permissions! - a.permissions!
                                    )}
                                    radius="sm"
                                    label="Select Roles"
                                    labelPlacement="outside"
                                    isMultiline={true}
                                    selectionMode="multiple"
                                    placeholder="Select a role to add or remove"
                                    disabledKeys={["user"]}
                                    defaultSelectedKeys={targetRoles.map(
                                        (role) => role
                                    )}
                                    onSelectionChange={(keys) => {
                                        const selectedRoles = Array.from(
                                            keys
                                        ) as string[];

                                        setFinalRoles(selectedRoles);
                                    }}
                                    renderValue={(
                                        items: SelectedItems<CachedRole>
                                    ) => {
                                        return (
                                            <div className="flex flex-wrap gap-1">
                                                {items.map((item) => (
                                                    <Chip
                                                        size="sm"
                                                        key={item.data?.key}
                                                        color={
                                                            item.data
                                                                ?.permissions! &
                                                            BitFieldPermissions.Administrator
                                                                ? "success"
                                                                : item.data
                                                                      ?.permissions! &
                                                                  BitFieldPermissions.ManagePages
                                                                ? "warning"
                                                                : item.data
                                                                      ?.permissions! &
                                                                  (BitFieldPermissions.ManageRoles |
                                                                      BitFieldPermissions.ManageBlogs |
                                                                      BitFieldPermissions.ManageUsers)
                                                                ? "primary"
                                                                : item.data
                                                                      ?.permissions! &
                                                                  BitFieldPermissions.ViewPrivatePages
                                                                ? "secondary"
                                                                : "default"
                                                        }
                                                        variant="dot"
                                                    >
                                                        {item.data?.name}
                                                    </Chip>
                                                ))}
                                            </div>
                                        );
                                    }}
                                >
                                    {(role) => (
                                        <SelectItem
                                            key={role.key}
                                            textValue={role.name}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-small">
                                                        {role.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    isDisabled={isUpdating}
                                    onPress={onClose}
                                    className="font-semibold"
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    onPress={handleRoleUpdate}
                                    className="font-semibold"
                                    isDisabled={
                                        isUpdating ||
                                        JSON.stringify(finalRoles) ===
                                            JSON.stringify(targetRoles)
                                    }
                                    isLoading={isUpdating}
                                >
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Delete User</ModalHeader>
                            <ModalBody>
                                Are you sure you want to delete this user? This
                                action cannot be undone.
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    isDisabled={isDeleting}
                                    onPress={onClose}
                                    className="font-semibold"
                                >
                                    Close
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    onPress={handleUserDelete}
                                    className="font-semibold"
                                    isDisabled={isDeleting}
                                    isLoading={isDeleting}
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default UsersOperation;
