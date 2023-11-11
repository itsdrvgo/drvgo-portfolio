"use client";

import { createRole } from "@/src/actions/roles";
import { cn, handleClientError } from "@/src/lib/utils";
import { Button, ButtonProps } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function RoleCreateButton({ className, ...props }: ButtonProps) {
    const router = useRouter();

    const { mutate: handleRoleCreate, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Creating role...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            const role = await createRole();
            return role;
        },
        onSuccess({ role }, __, ctx) {
            toast.success("Role created successfully", {
                id: ctx?.toastId,
            });
            router.push(`/admin/roles/${role.id}`);
        },
        onError(err, __, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <Button
            onPress={() => handleRoleCreate()}
            isDisabled={isLoading}
            isLoading={isLoading}
            className={cn("font-semibold", className)}
            startContent={!isLoading && <Icons.add className="h-4 w-4" />}
            {...props}
        >
            New Role
        </Button>
    );
}

export default RoleCreateButton;
