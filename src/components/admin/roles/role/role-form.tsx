"use client";

import { updateRole } from "@/src/actions/roles";
import { BitFieldPermissions, Permissions } from "@/src/config/const";
import { cn, handleClientError } from "@/src/lib/utils";
import { roleUpdateSchema } from "@/src/lib/validation/roles";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedRole } from "@/src/types/cache";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Input,
    Switch,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PageProps extends DefaultProps {
    _role: CachedRole;
    hasAccessToEdit: boolean;
    isOwner: boolean;
    user: ClerkUserWithoutEmail;
    initialRoles: CachedRole[];
}

function RoleForm({
    className,
    _role,
    hasAccessToEdit,
    isOwner,
    user,
    initialRoles,
    ...props
}: PageProps) {
    const router = useRouter();

    const filteredPermissions = isOwner
        ? Permissions
        : Permissions.filter(
              (permission) =>
                  permission.bit !== BitFieldPermissions.Administrator
          );

    const totalPermissions = filteredPermissions.reduce(
        (acc, cur) => acc | cur.bit,
        0
    );

    const [roleName, setRoleName] = useState<string>(_role.name);
    const [rolePermissions, setRolePermissions] = useState<number>(
        _role.permissions
    );

    useEffect(() => {
        rolePermissions < 1 && setRolePermissions(1);
        rolePermissions > 2 &&
            setRolePermissions(
                BitFieldPermissions.ViewPrivatePages |
                    BitFieldPermissions.ViewPublicPages |
                    rolePermissions
            );
    }, [rolePermissions]);

    const { mutate: handleUpdateRole, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating role...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            roleUpdateSchema.parse({
                name: roleName,
                permissions: rolePermissions,
            });

            await updateRole({
                initialRoles,
                role: _role,
                updatedRole: {
                    name: roleName,
                    permissions: rolePermissions,
                },
                user,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Role updated successfully", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <div
            className={cn("flex w-full flex-col items-center gap-5", className)}
            {...props}
        >
            <Input
                value={roleName}
                onValueChange={setRoleName}
                classNames={{
                    inputWrapper: "border border-gray-700 bg-background",
                    label: "text-base md:text-lg font-bold",
                }}
                placeholder="Role Name"
                label="Name"
                labelPlacement="outside"
                isDisabled={
                    isLoading || _role.position === 0 ? false : !hasAccessToEdit
                }
            />

            <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-bold md:text-lg">
                        Permissions
                    </p>

                    <Button
                        variant="flat"
                        size="sm"
                        onPress={() =>
                            setRolePermissions(() =>
                                rolePermissions === totalPermissions
                                    ? 0
                                    : totalPermissions
                            )
                        }
                        isDisabled={
                            isLoading || _role.position === 0
                                ? false
                                : !hasAccessToEdit
                        }
                    >
                        {rolePermissions === totalPermissions
                            ? "Clear All"
                            : "Select All"}
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredPermissions.map((permission) => (
                        <Card key={permission.key}>
                            <CardBody>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold md:text-base">
                                            {permission.name}
                                        </p>
                                        <p className="text-xs text-gray-400 md:text-sm">
                                            {permission.description}
                                        </p>
                                    </div>

                                    <Switch
                                        name={permission.name}
                                        isDisabled={
                                            isLoading ||
                                            (_role.position === 0
                                                ? false
                                                : !hasAccessToEdit)
                                        }
                                        isSelected={
                                            (rolePermissions &
                                                permission.bit) ===
                                            permission.bit
                                        }
                                        onValueChange={(value) =>
                                            setRolePermissions((prev) =>
                                                value
                                                    ? prev | permission.bit
                                                    : prev ^ permission.bit
                                            )
                                        }
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            <ButtonGroup
                className="sticky bottom-10 z-50"
                variant="flat"
                isDisabled={
                    isLoading ||
                    (JSON.stringify(_role.permissions) ===
                        JSON.stringify(rolePermissions) &&
                        _role.name === roleName)
                }
            >
                <Button
                    className="bg-default-100 first:rounded-s-full"
                    onPress={() => {
                        setRoleName(_role.name);
                        setRolePermissions(_role.permissions);
                    }}
                >
                    Cancel
                </Button>

                <Button
                    className="bg-default-100 last:rounded-e-full"
                    isLoading={isLoading}
                    onPress={() => handleUpdateRole()}
                >
                    Submit
                </Button>
            </ButtonGroup>
        </div>
    );
}

export default RoleForm;
