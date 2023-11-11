"use client";

import {
    revalidateBlogs,
    revalidateRoles,
    revalidateUsers,
} from "@/src/actions/cache";
import { cn, handleClientError } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

type CachedType = "users" | "blogs" | "roles";

interface PageProps extends DefaultProps {
    users: CachedUser[];
    blogs: CachedBlog[];
    roles: CachedRole[];
}

function CacheOperations({ className, users, blogs, roles }: PageProps) {
    const router = useRouter();

    const [isFetching, setIsFetching] = useState<CachedType | null>(null);

    const { mutate: handleRevalidate, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Revalidating cache...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            isFetching === "users" && (await revalidateUsers());
            isFetching === "blogs" && (await revalidateBlogs());
            isFetching === "roles" && (await revalidateRoles());
        },
        onSuccess(_, __, ctx) {
            toast.success("Cache revalidated!", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            setIsFetching(null);
        },
    });

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <Card>
                <CardBody className="flex-row items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Icons.users className="h-5 w-5 text-green-600" />

                        <p className="font-semibold">
                            Users{" "}
                            <span className="text-gray-400">
                                ({users.length})
                            </span>
                        </p>
                    </div>

                    <Button
                        isIconOnly
                        color="primary"
                        isDisabled={isLoading}
                        radius="full"
                        onPress={() => {
                            setIsFetching("users");
                            handleRevalidate();
                        }}
                        startContent={
                            <Icons.refresh
                                className={cn("h-4 w-4", {
                                    "animate-spin": isFetching === "users",
                                })}
                            />
                        }
                    />
                </CardBody>
            </Card>

            <Card>
                <CardBody className="flex-row items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Icons.page className="h-5 w-5 text-blue-600" />

                        <p className="font-semibold">
                            Blogs{" "}
                            <span className="text-gray-400">
                                ({blogs.length})
                            </span>
                        </p>
                    </div>

                    <Button
                        isIconOnly
                        color="primary"
                        isDisabled={isLoading}
                        radius="full"
                        onPress={() => {
                            setIsFetching("blogs");
                            handleRevalidate();
                        }}
                        startContent={
                            <Icons.refresh
                                className={cn("h-4 w-4", {
                                    "animate-spin": isFetching === "blogs",
                                })}
                            />
                        }
                    />
                </CardBody>
            </Card>

            <Card>
                <CardBody className="flex-row items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Icons.barChart className="h-5 w-5 text-yellow-600" />

                        <p className="font-semibold">
                            Roles{" "}
                            <span className="text-gray-400">
                                ({roles.length})
                            </span>
                        </p>
                    </div>

                    <Button
                        isIconOnly
                        color="primary"
                        isDisabled={isLoading}
                        radius="full"
                        onPress={() => {
                            setIsFetching("roles");
                            handleRevalidate();
                        }}
                        startContent={
                            <Icons.refresh
                                className={cn("h-4 w-4", {
                                    "animate-spin": isFetching === "roles",
                                })}
                            />
                        }
                    />
                </CardBody>
            </Card>
        </div>
    );
}

export default CacheOperations;
