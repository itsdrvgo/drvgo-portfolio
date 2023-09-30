"use client";

import { UserUpdateData, userUpdateSchema } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function UsernameForm({ user }: PageProps) {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const form = useForm<UserUpdateData>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            username: user.username!,
        },
    });

    const onSubmit = (data: UserUpdateData) => {
        setLoading(true);

        axios
            .patch<ResponseData>(
                `/api/users/${user.id}`,
                JSON.stringify({
                    username: data.username,
                })
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200) return toast.error(resData.message);

                toast.success("Username updated");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(() => {
                setLoading(false);
                router.refresh();
            });
    };

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) => form.handleSubmit(onSubmit)(...args)}
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    className="w-full lowercase md:w-2/5"
                                    classNames={{
                                        inputWrapper:
                                            "border border-gray-700 bg-background",
                                    }}
                                    startContent={"@"}
                                    radius="sm"
                                    placeholder="duckymomo60"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full items-center justify-center md:justify-start">
                    <Button
                        type="submit"
                        isDisabled={
                            isLoading ||
                            form.getValues().username === user.username
                        }
                        className="flex items-center gap-2 bg-secondary-900 font-semibold"
                        radius="sm"
                        color="success"
                        isLoading={isLoading}
                    >
                        {isLoading ? "Updating" : "Update"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default UsernameForm;
