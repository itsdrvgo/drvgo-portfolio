"use client";

import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/use-toast";
import { User } from "@/src/lib/drizzle/schema";
import { checkRoleHierarchy, manageRole, wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
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
    const { userId } = useAuth();

    const { toast } = useToast();
    const router = useRouter();

    const handleUserDelete = async () => {
        const [user, target] = await Promise.all([
            fetchUser(userId!),
            fetchUser(rowData.id),
        ]);

        if (!target)
            return toast({
                title: "Oops!",
                description: "User doesn't exist",
                variant: "destructive",
            });

        if (user!.id === target.id)
            return toast({
                title: "Oops!",
                description: "You cannot delete your own account",
                variant: "destructive",
            });

        if (!checkRoleHierarchy(user!, target))
            return toast({
                title: "Oops!",
                description: "You don't have permission to execute this action",
                variant: "destructive",
            });

        axios
            .delete<ResponseData>(`/api/users/${target.id}`)
            .then(async ({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "User has been deleted",
                });

                await wait(500);
                router.refresh();
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleUserRole = async ({ action }: Action) => {
        const [user, target] = await Promise.all([
            fetchUser(userId!),
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

        axios
            .patch<ResponseData>(
                `/api/users/${target.id}`,
                JSON.stringify({ role })
            )
            .then(async ({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "User role has been updated",
                });

                await wait(500);
                router.refresh();
            })
            .catch((err) => {
                console.log(err);
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
            {rowData.id !== userId ? (
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
