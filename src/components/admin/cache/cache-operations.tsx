"use client";

import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import { Button, Card, CardBody } from "@nextui-org/react";
import axios from "axios";
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

    const handleFetch = (type: CachedType) => {
        setIsFetching(type);

        const toastId = toast.loading("Revalidating cache...");

        axios
            .post<ResponseData>(`/api/fetch/${type}`)
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, { id: toastId });

                toast.success("Cache revalidated!", { id: toastId });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsFetching(null);
                router.refresh();
            });
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <Card radius="sm">
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
                        isDisabled={!!isFetching}
                        radius="sm"
                        onPress={() => handleFetch("users")}
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

            <Card radius="sm">
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
                        isDisabled={!!isFetching}
                        radius="sm"
                        onPress={() => handleFetch("blogs")}
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

            <Card radius="sm">
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
                        isDisabled={!!isFetching}
                        radius="sm"
                        onPress={() => handleFetch("roles")}
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
