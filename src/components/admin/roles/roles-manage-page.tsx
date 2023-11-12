"use client";

import { updateRoles } from "@/src/actions/roles";
import { BitFieldPermissions } from "@/src/config/const";
import {
    checkRoleHierarchy,
    cn,
    handleClientError,
    hasPermission,
    reorder,
} from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedRole } from "@/src/types/cache";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { Button, ButtonGroup, Chip } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function isOwnerRoleActionable(user: ClerkUserWithoutEmail, role: CachedRole) {
    const hasOwnerPerms = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    if (role.key === "owner" && hasOwnerPerms) return true;
    return false;
}

function isActionable(
    user: ClerkUserWithoutEmail,
    roles: CachedRole[],
    role: CachedRole
) {
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
    initialRoles: CachedRole[];
    user: ClerkUserWithoutEmail;
}

function RolesManagePage({ className, initialRoles, user }: PageProps) {
    const router = useRouter();

    const [roles, setRoles] = useState<CachedRole[]>(initialRoles);

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
            const newRoles: CachedRole[] = [...roles];
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

    const { mutate: handleRoleUpdate, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating roles...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const rolesToBeUpdated = roles.map((role, index) => ({
                id: role.id,
                position: index + 1,
            }));

            await updateRoles({
                initialRoles,
                rolesToBeUpdated,
                user,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Roles updated successfully", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

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
                                                    "flex items-center justify-between gap-4 rounded-xl bg-default-50 p-4",
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
                                                        startContent={
                                                            <Icons.pencil className="h-4 w-4" />
                                                        }
                                                    />

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
                                                            const newRoles: CachedRole[] =
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
                    className="sticky bottom-10 z-50"
                    variant="flat"
                    isDisabled={
                        isLoading ||
                        JSON.stringify(initialRoles) === JSON.stringify(roles)
                    }
                >
                    <Button
                        onPress={() => setRoles(initialRoles)}
                        className="bg-default-100 first:rounded-s-full"
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-default-100 last:rounded-e-full"
                        isLoading={isLoading}
                        onPress={() => handleRoleUpdate()}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default RolesManagePage;
