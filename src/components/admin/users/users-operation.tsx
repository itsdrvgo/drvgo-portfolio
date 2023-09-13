"use client";

import { useToast } from "@/src/components/ui/use-toast";
import { User } from "@/src/lib/drizzle/schema";
import { checkRoleHierarchy, cn, manageRole, wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import {
    Button,
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
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { PartialUser } from "./users-table";

interface PageProps extends DefaultProps {
    data: PartialUser;
    authUser: ClerkUser;
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

function UsersOperation({ data, authUser }: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
        onOpenChange: onDeleteOpenChange,
    } = useDisclosure();

    const handleUserDelete = async () => {
        if (authUser.id === data.id)
            return toast({
                title: "Oops!",
                description: "You cannot delete your own account",
                variant: "destructive",
            });

        if (!checkRoleHierarchy(authUser.privateMetadata.role, data.role))
            return toast({
                title: "Oops!",
                description: "You don't have permission to execute this action",
                variant: "destructive",
            });

        setIsDeleting(true);

        axios
            .delete<ResponseData>(`/api/users/${data.id}`)
            .then(async ({ data: resData }) => {
                setIsDeleting(false);
                onDeleteClose();

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
                setIsDeleting(false);
                onDeleteClose();

                console.error(err);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    const handleUserRole = async ({ action }: Action) => {
        if (authUser.id === data.id)
            return toast({
                title: "Oops!",
                description: "You cannot change your own role",
                variant: "destructive",
            });

        if (!checkRoleHierarchy(authUser.privateMetadata.role, data.role))
            return toast({
                title: "Oops!",
                description: "You don't have permission to execute this action",
                variant: "destructive",
            });

        const role = manageRole(data.role, action);
        if (!role)
            return toast({
                title: "Oops!",
                description: "Action cannot be performed",
                variant: "destructive",
            });

        setIsUpdating(true);

        axios
            .patch<ResponseData>(
                `/api/users/${data.id}`,
                JSON.stringify({ role })
            )
            .then(async ({ data: resData }) => {
                setIsUpdating(false);

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
                setIsUpdating(false);

                console.error(err);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
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
                    itemClasses={{
                        base: "rounded-sm",
                    }}
                    disabledKeys={[
                        ["owner", "admin"].includes(data.role)
                            ? "promote"
                            : checkRoleHierarchy(
                                  authUser.privateMetadata.role,
                                  data.role
                              )
                            ? data.role === "user"
                                ? "demote"
                                : ""
                            : "promote",
                        authUser.id === data.id ? "delete" : "",
                    ]}
                >
                    <DropdownSection showDivider title={"Details"}>
                        <DropdownItem
                            key={"copy_id"}
                            startContent={
                                <Icons.user className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() => {
                                navigator.clipboard.writeText(data.id);
                                toast({
                                    description: "ID has been copied",
                                });
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
                                navigator.clipboard.writeText(data.email);
                                toast({
                                    description: "Email has been copied",
                                });
                            }}
                        >
                            Copy Email
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection
                        showDivider={authUser.privateMetadata.role === "owner"}
                        title={"Manage Role"}
                    >
                        <DropdownItem
                            key={"promote"}
                            startContent={
                                <Icons.chevronUp className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() =>
                                handleUserRole({ action: "promote" })
                            }
                        >
                            Promote
                        </DropdownItem>
                        <DropdownItem
                            key={"demote"}
                            startContent={
                                <Icons.chevronDown className="h-4 w-4 text-gray-400" />
                            }
                            onPress={() => handleUserRole({ action: "demote" })}
                        >
                            Demote
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection
                        title={"Danger Zone"}
                        className={cn(
                            authUser.privateMetadata.role !== "owner" &&
                                "hidden"
                        )}
                    >
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

        // <>
        //     {data.role !== "owner" ? (
        //         <>
        //             <DropdownMenuSeparator />
        //             {data.role === "user" ? (
        //                 <DropdownMenuItem
        //                     className="cursor-pointer"
        //                     onSelect={() =>
        //                         handleUserRole({ action: "promote" })
        //                     }
        //                 >
        //                     Promote
        //                 </DropdownMenuItem>
        //             ) : data.role === "guest" ? (
        //                 <>
        //                     <DropdownMenuItem
        //                         className="cursor-pointer"
        //                         onSelect={() =>
        //                             handleUserRole({ action: "promote" })
        //                         }
        //                     >
        //                         Promote
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem
        //                         className="cursor-pointer"
        //                         onSelect={() =>
        //                             handleUserRole({ action: "demote" })
        //                         }
        //                     >
        //                         Demote
        //                     </DropdownMenuItem>
        //                 </>
        //             ) : data.role === "moderator" ? (
        //                 <>
        //                     <DropdownMenuItem
        //                         className="cursor-pointer"
        //                         onSelect={() =>
        //                             handleUserRole({ action: "promote" })
        //                         }
        //                     >
        //                         Promote
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem
        //                         className="cursor-pointer"
        //                         onSelect={() =>
        //                             handleUserRole({ action: "demote" })
        //                         }
        //                     >
        //                         Demote
        //                     </DropdownMenuItem>
        //                 </>
        //             ) : data.role === "admin" ? (
        //                 <DropdownMenuItem
        //                     className="cursor-pointer"
        //                     onSelect={() =>
        //                         handleUserRole({ action: "demote" })
        //                     }
        //                 >
        //                     Demote
        //                 </DropdownMenuItem>
        //             ) : null}
        //         </>
        //     ) : null}
        //     {data.id !== userId ? (
        //         <>
        //             <DropdownMenuSeparator />
        //             <DropdownMenuItem
        //                 className="cursor-pointer text-destructive focus:text-destructive"
        //                 onSelect={handleUserDelete}
        //             >
        //                 Delete User
        //             </DropdownMenuItem>
        //         </>
        //     ) : null}
        // </>
    );
}

export default UsersOperation;
