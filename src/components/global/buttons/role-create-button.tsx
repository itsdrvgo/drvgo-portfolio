"use client";

import { cn, parseJSONToObject } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { Button, ButtonProps } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function RoleCreateButton({ className, ...props }: ButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRoleCreate = () => {
        setIsLoading(true);

        const toastId = toast.loading("Creating role");

        axios
            .post<ResponseData>("/api/roles")
            .then(({ data: resData }) => {
                setIsLoading(false);

                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });
                toast.success("Role created successfully", {
                    id: toastId,
                });

                const roleId = parseJSONToObject<string>(resData.data);
                router.push(`/admin/roles/${roleId}`);
            })
            .catch((err) => {
                console.error(err);

                setIsLoading(false);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            });
    };

    return (
        <Button
            onPress={handleRoleCreate}
            isDisabled={isLoading}
            isLoading={isLoading}
            className={cn("font-semibold", className)}
            radius="sm"
            startContent={!isLoading && <Icons.add className="h-4 w-4" />}
            {...props}
        >
            New Role
        </Button>
    );
}

export default RoleCreateButton;
