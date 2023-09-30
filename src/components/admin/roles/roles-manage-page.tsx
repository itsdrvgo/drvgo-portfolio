"use client";

import { BitFieldPermissions } from "@/src/config/const";
import { Role } from "@/src/lib/drizzle/schema";
import {
    checkRoleHierarchy,
    cn,
    hasPermission,
    reorder,
} from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Button, ButtonGroup, Chip } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function isOwnerRoleActionable(user: ClerkUser, role: Role) {
    const hasOwnerPerms = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    if (role.key === "owner" && hasOwnerPerms) return true;
    return false;
}

function isActionable(user: ClerkUser, roles: Role[], role: Role) {
    const hasUserPermission = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManagePages | BitFieldPermissions.ManageRoles
    );

    const isUserRoleHigherThanTargettedRole = checkRoleHierarchy(
        user.privateMetadata.roles,
        [role.key],
        roles
    );

    return hasUserPermission && isUserRoleHigherThanTargettedRole;
}

interface PageProps extends DefaultProps {
    initialRoles: Role[];
    user: ClerkUser;
}

function RolesManagePage({ className, initialRoles, user }: PageProps) {
    const router = useRouter();

    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDragStart = () => {
        if (window.navigator.vibrate) window.navigator.vibrate(100);
    };

    const handleDragEnd = (result: DropResult) => {
        if (result.destination) {
            const isDragDisabled = !isActionable(
                user,
                roles,
                roles[result.destination.index]
            );

            if (roles.length > 3 && isDragDisabled) return;
        }

        if (result.combine) {
            const newRoles: Role[] = [...roles];
            newRoles.splice(result.source.index, 1);
            setRoles(newRoles);
            return;
        }

        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const newRoles = reorder(
            roles,
            result.source.index,
            result.destination.index
        );

        setRoles(newRoles);
    };

    const handleSave = () => {
        setIsLoading(true);

        const toastId = toast.loading("Updating roles...");

        const body: Partial<Role>[] = roles.map((role, index) => ({
            id: role.id,
            position: index + 1,
        }));

        axios
            .patch("/api/roles", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("Roles updated successfully", {
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
                setIsLoading(false);
                router.refresh();
            });
    };

    return (
        <div className="flex flex-col gap-5">
            <DragDropContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <Droppable droppableId="droppable">
                    {(droppableProvided) => (
                        <ul
                            className={cn("flex flex-col gap-4", className)}
                            {...droppableProvided.droppableProps}
                            ref={droppableProvided.innerRef}
                        >
                            {roles.map((role, index) => {
                                const isDragDisabled = !isActionable(
                                    user,
                                    roles,
                                    role
                                );

                                return (
                                    <Draggable
                                        key={role.id}
                                        draggableId={role.id}
                                        index={index}
                                        isDragDisabled={
                                            isDragDisabled &&
                                            !isOwnerRoleActionable(user, role)
                                        }
                                    >
                                        {(draggableProvided) => (
                                            <li
                                                className={cn(
                                                    "flex items-center justify-between gap-4 rounded-md bg-default-50 p-4",
                                                    isDragDisabled &&
                                                        !isOwnerRoleActionable(
                                                            user,
                                                            role
                                                        ) &&
                                                        "cursor-not-allowed opacity-60",
                                                    className
                                                )}
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Icons.gripV className="h-4 w-4" />

                                                    <div className="flex items-center gap-4">
                                                        <Chip
                                                            size="sm"
                                                            color="primary"
                                                        >
                                                            {index + 1}
                                                        </Chip>
                                                        <p>{role.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        isIconOnly
                                                        isDisabled={
                                                            isLoading ||
                                                            (isDragDisabled &&
                                                                !isOwnerRoleActionable(
                                                                    user,
                                                                    role
                                                                ))
                                                        }
                                                        radius="full"
                                                        variant="flat"
                                                        size="sm"
                                                        onPress={() =>
                                                            router.push(
                                                                `/admin/roles/${role.id}`
                                                            )
                                                        }
                                                    >
                                                        <Icons.pencil className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        isIconOnly
                                                        radius="full"
                                                        variant="flat"
                                                        size="sm"
                                                        isDisabled={
                                                            roles.length ===
                                                                1 ||
                                                            isLoading ||
                                                            role.key ===
                                                                "user" ||
                                                            (isDragDisabled &&
                                                                !isOwnerRoleActionable(
                                                                    user,
                                                                    role
                                                                ))
                                                        }
                                                        onPress={() => {
                                                            const newRoles: Role[] =
                                                                [...roles];
                                                            newRoles.splice(
                                                                index,
                                                                1
                                                            );
                                                            setRoles(newRoles);
                                                        }}
                                                    >
                                                        <Icons.close className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {droppableProvided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="sticky bottom-10 flex items-center justify-center">
                <ButtonGroup
                    className="z-50 backdrop-blur-sm"
                    variant="flat"
                    isDisabled={
                        isLoading ||
                        JSON.stringify(initialRoles) === JSON.stringify(roles)
                    }
                >
                    <Button radius="sm" onPress={() => setRoles(initialRoles)}>
                        Cancel
                    </Button>

                    <Button
                        radius="sm"
                        isLoading={isLoading}
                        onPress={handleSave}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default RolesManagePage;
