"use client";

import { LoginData, loginSchema } from "@/src/lib/validation/auth";
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

function SignInForm() {
    const { toast } = useToast();

    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: LoginData) {
        setLoading(true);

        axios
            .post<ResponseData>("/api/users", JSON.stringify(data))
            .then(({ data: resData }) => {
                setLoading(false);

                switch (resData.code) {
                    case 200:
                        toast({
                            description: "Welcome, " + resData.data + "!",
                        });

                        router.refresh();
                        router.push("/");
                        break;

                    case 404:
                        toast({
                            title: "Oops!",
                            description: resData.message,
                            variant: "destructive",
                        });
                        router.push("/signup");
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
            .catch((err) => {
                setLoading(false);
                console.log(err);

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
                    disabled={isLoading || true}
                    className="flex items-center gap-2 bg-white hover:bg-gray-200"
                >
                    {isLoading ? (
                        <>
                            <Icons.spinner
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                            <p>Signing In</p>
                        </>
                    ) : (
                        <p>Sign In</p>
                    )}
                </Button>
            </form>
        </Form>
    );
}

export { SignInForm };
