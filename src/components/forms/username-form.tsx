"use client";

import { updateUsername } from "@/src/actions/users";
import { handleClientError } from "@/src/lib/utils";
import { checkUsernameSchema, UsernameData } from "@/src/lib/validation/auth";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";

const updateUsernameSchema = z.object({
    username: checkUsernameSchema.shape.username,
});

interface PageProps extends DefaultProps {
    user: ClerkUserWithoutEmail;
}

function UsernameForm({ user }: PageProps) {
    const router = useRouter();

    const form = useForm<UsernameData>({
        resolver: zodResolver(updateUsernameSchema),
        defaultValues: {
            username: user.username!,
        },
    });

    const { mutate: handleUpdateUsername, isLoading } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating username...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            await updateUsername({
                id: user.id,
                username: form.getValues().username,
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Username updated", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) =>
                    form.handleSubmit(() => handleUpdateUsername())(...args)
                }
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    radius="sm"
                                    className="w-full lowercase md:w-2/5"
                                    classNames={{
                                        inputWrapper:
                                            "border border-gray-700 bg-default-50",
                                    }}
                                    startContent={"@"}
                                    placeholder="duckymomo60"
                                    isDisabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full items-center justify-center md:justify-start">
                    <Button
                        radius="sm"
                        type="submit"
                        isDisabled={
                            isLoading ||
                            form.getValues().username === user.username
                        }
                        className="flex items-center gap-2 bg-secondary-900 font-semibold"
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
