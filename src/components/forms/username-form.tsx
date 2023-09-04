"use client";

import { wait } from "@/src/lib/utils";
import { UserUpdateData, userUpdateSchema } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { User } from "@clerk/nextjs/dist/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
}

function UsernameForm({ user }: PageProps) {
    const { toast } = useToast();

    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const form = useForm<UserUpdateData>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            username: user.username!,
        },
    });

    const onSubmit = async (data: UserUpdateData) => {
        setLoading(true);

        axios
            .patch<ResponseData>(
                `/api/users/${user.id}`,
                JSON.stringify({
                    username: data.username,
                })
            )
            .then(async ({ data: resData }) => {
                setLoading(false);
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Username updated",
                });
                await wait(500);
                router.refresh();
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
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
                                    placeholder="duckymomo60"
                                    disabled={isLoading}
                                    className="w-full lowercase md:w-2/5"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full items-center justify-center md:justify-start">
                    <Button
                        disabled={
                            isLoading ||
                            form.getValues().username === user.username
                        }
                        className="flex w-max items-center gap-2 bg-white hover:bg-gray-200"
                    >
                        {isLoading ? (
                            <>
                                <Icons.spinner
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                                <p>Updating</p>
                            </>
                        ) : (
                            <p>Update</p>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export { UsernameForm };
