"use client";

import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/use-toast";
import { User } from "@/src/lib/drizzle/schema";
import { checkRoleHierarchy, manageRole } from "@/src/lib/utils";
import { UserUpdateData } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PageProps extends DefaultProps {
    rowData: User;
}

type Action = {
    action: "promote" | "demote";
};

const fetchUser = async (userId: string) => {
    const {
        data: { data },
    } = await axios.get<ResponseData>(`/api/users/${userId}`);
    return JSON.parse(data) as User | null;
};

function UsersOperation({ rowData }: PageProps) {
    const { data: session } = useSession();

    const { toast } = useToast();
    const router = useRouter();

    const handleUserDelete = async () => {
        const [user, target] = await Promise.all([
            fetchUser(session?.user.id!),
            fetchUser(rowData.id),
        ]);

        if (!target)
            return toast({
                title: "Oops!",
                description: "User doesn't exist",
                variant: "destructive",
            });

        if (!checkRoleHierarchy(user!, target))
            return toast({
                title: "Oops!",
                description: "You don't have permission to execute this action",
                variant: "destructive",
            });

        axios
            .delete<ResponseData>(`/api/users/${rowData.id}`)
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "User has been deleted",
                });

                router.refresh();
            })
            .catch(() => {
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleUserRole = async ({ action }: Action) => {
        const [user, target] = await Promise.all([
            fetchUser(session?.user.id!),
            fetchUser(rowData.id),
        ]);

        if (!target)
            return toast({
                title: "Oops!",
                description: "User doesn't exist",
                variant: "destructive",
            });

        if (!checkRoleHierarchy(user!, target))
            return toast({
                title: "Oops!",
                description: "You don't have permission to execute this action",
                variant: "destructive",
            });

        const role = manageRole(target.role, action);
        if (!role)
            return toast({
                title: "Oops!",
                description: "Action cannot be performed",
                variant: "destructive",
            });

        const body: UserUpdateData = {
            role,
        };

        axios
            .patch<ResponseData>(
                `/api/users/${rowData.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                router.refresh();

                toast({
                    description: "User role has been updated",
                });
            })
            .catch(() => {
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            {rowData.role !== "owner" ? (
                <>
                    <DropdownMenuSeparator />
                    {rowData.role === "user" ? (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() =>
                                handleUserRole({ action: "promote" })
                            }
                        >
                            Promote
                        </DropdownMenuItem>
                    ) : rowData.role === "moderator" ? (
                        <>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() =>
                                    handleUserRole({ action: "promote" })
                                }
                            >
                                Promote
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() =>
                                    handleUserRole({ action: "demote" })
                                }
                            >
                                Demote
                            </DropdownMenuItem>
                        </>
                    ) : rowData.role === "admin" ? (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() =>
                                handleUserRole({ action: "demote" })
                            }
                        >
                            Demote
                        </DropdownMenuItem>
                    ) : null}
                </>
            ) : null}
            {rowData.id !== session?.user.id ? (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onSelect={handleUserDelete}
                    >
                        Delete User
                    </DropdownMenuItem>
                </>
            ) : null}
        </>
    );
}

export default UsersOperation;
