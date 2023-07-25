"use client";

import { SignUpData, signupSchema } from "@/src/lib/validation/auth";
import { ResponseData } from "@/src/lib/validation/response";
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
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { PasswordInput } from "./password-input";

function SignUpForm() {
    const { toast } = useToast();

    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const form = useForm<SignUpData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });

    function onSubmit(data: SignUpData) {
        setLoading(true);

        axios
            .post<ResponseData>("/api/users/create", data)
            .then(({ data: resData }) => {
                setLoading(false);

                switch (resData.code) {
                    case 201:
                        toast({
                            title: "Welcome, " + data.username + "!",
                            description:
                                "Please verify your Email by clicking the link sent in your inbox",
                            variant: "destructive",
                        });
                        router.push("/signin");
                        break;

                    case 409:
                        toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });
                        router.push("/signin");
                        break;

                    default:
                        toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });
                        break;
                }
            })
            .catch(() => {
                setLoading(false);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    }

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
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="duckymomo60"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="ryomensukuna@jjk.jp"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="**********"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-white hover:bg-gray-200"
                >
                    {isLoading ? (
                        <>
                            <Icons.spinner
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                            <p>Signing Up</p>
                        </>
                    ) : (
                        <p>Sign Up</p>
                    )}
                </Button>
            </form>
        </Form>
    );
}

export { SignUpForm };
