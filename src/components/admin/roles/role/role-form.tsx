"use client";

import { BitFieldPermissions, Permissions } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PageProps extends DefaultProps {
    roleData: CachedRole;
    hasAccessToEdit: boolean;
    isOwner: boolean;
}

function RoleForm({
    className,
    roleData,
    hasAccessToEdit,
    isOwner,
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

    const [roleName, setRoleName] = useState<string>(roleData.name);
    const [rolePermissions, setRolePermissions] = useState<number>(
        roleData.permissions
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

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        setIsLoading(true);

        const toastId = toast.loading("Updating role...");

        const body: Partial<CachedRole> = {
            name: roleName,
            permissions: rolePermissions,
        };

        axios
            .patch(`/api/roles/${roleData.id}`, JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });
                toast.success("Role updated successfully", {
                    id: toastId,
                });
                router.refresh();
                router.push("/admin/roles");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={cn("flex flex-col gap-5", className)} {...props}>
            <Input
                value={roleName}
                onValueChange={setRoleName}
                radius="sm"
                classNames={{
                    inputWrapper: "border border-gray-700 bg-background",
                    label: "text-base md:text-lg font-bold",
                }}
                placeholder="Role Name"
                label="Name"
                labelPlacement="outside"
                isDisabled={
                    isLoading || roleData.position === 0
                        ? false
                        : !hasAccessToEdit
                }
            />

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-bold md:text-lg">
                        Permissions
                    </p>

                    <Button
                        radius="sm"
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
                            isLoading || roleData.position === 0
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
                        <Card key={permission.key} radius="sm">
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
                                            (roleData.position === 0
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

            <div className="sticky bottom-10 flex items-center justify-center">
                <ButtonGroup
                    className="z-50 backdrop-blur-sm"
                    variant="flat"
                    isDisabled={
                        isLoading ||
                        (JSON.stringify(roleData.permissions) ===
                            JSON.stringify(rolePermissions) &&
                            roleData.name === roleName)
                    }
                >
                    <Button
                        radius="sm"
                        onPress={() => {
                            setRoleName(roleData.name);
                            setRolePermissions(roleData.permissions);
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        radius="sm"
                        isLoading={isLoading}
                        onPress={handleSubmit}
                    >
                        Submit
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default RoleForm;
