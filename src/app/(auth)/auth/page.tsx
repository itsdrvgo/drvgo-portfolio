"use client";

import OAuth from "@/src/components/auth/oauth-signin";
import { SignInForm } from "@/src/components/forms/signin-form";
import { SignUpForm } from "@/src/components/forms/signup-form";
import { DRVGOIcon } from "@/src/config/const";
import { Link, Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

function Page() {
    const [selected, setSelected] = useState("signin");

    return (
        <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-5">
            <div className="w-full max-w-[55rem] rounded-md bg-gradient-to-r from-transparent to-card p-2 backdrop-blur-sm md:p-5">
                <div className="grid grid-cols-1 divide-x-0 md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="hidden items-center justify-center md:flex">
                        <Image
                            src={DRVGOIcon}
                            alt="DRVGO"
                            width={400}
                            height={400}
                        />
                    </div>

                    <div className="space-y-6 p-5">
                        <Tabs
                            fullWidth
                            size="md"
                            color="primary"
                            aria-label="Tabs form"
                            selectedKey={selected}
                            onSelectionChange={(key) =>
                                setSelected(key as string)
                            }
                            radius="sm"
                            classNames={{
                                tabList: "bg-background",
                                tabContent: "font-semibold",
                            }}
                        >
                            <Tab key="signin" title="Sign In">
                                <div className="space-y-4">
                                    <OAuth />
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="rounded-md bg-card px-2 text-muted-foreground">
                                                Or
                                            </span>
                                        </div>
                                    </div>

                                    <SignInForm />

                                    <div className="flex-1 cursor-default text-xs text-muted-foreground md:text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            size="sm"
                                            onPress={() =>
                                                setSelected("signup")
                                            }
                                            className="cursor-pointer"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </Tab>
                            <Tab key="signup" title="Sign Up">
                                <div className="space-y-4">
                                    <OAuth />
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="rounded-md bg-card px-2 text-muted-foreground">
                                                Or
                                            </span>
                                        </div>
                                    </div>
                                    <SignUpForm />
                                    <div className="flex-1 cursor-default text-xs text-muted-foreground md:text-sm">
                                        Already have an account?{" "}
                                        <Link
                                            size="sm"
                                            onPress={() =>
                                                setSelected("signin")
                                            }
                                            className="cursor-pointer"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Page;
