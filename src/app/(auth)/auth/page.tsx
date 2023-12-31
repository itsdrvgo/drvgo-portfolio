"use client";

import OAuth from "@/src/components/auth/oauth-signin";
import SignInForm from "@/src/components/forms/signin-form";
import SignUpForm from "@/src/components/forms/signup-form";
import { Card, CardBody, Link, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";

function Page() {
    const [selected, setSelected] = useState("signin");

    return (
        <section className="flex w-full items-center justify-center">
            <Card
                classNames={{
                    base: "w-full max-w-sm",
                }}
            >
                <CardBody>
                    <Tabs
                        fullWidth
                        size="md"
                        color="primary"
                        variant="bordered"
                        aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={(key) => setSelected(key as string)}
                        classNames={{
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
                                        <span className="rounded-lg bg-default-50 px-2 text-gray-400">
                                            Or
                                        </span>
                                    </div>
                                </div>

                                <SignInForm />

                                <div className="flex-1 cursor-default text-xs text-gray-400 md:text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        size="sm"
                                        onPress={() => setSelected("signup")}
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
                                        <span className="rounded-lg bg-default-50 px-2 text-gray-400">
                                            Or
                                        </span>
                                    </div>
                                </div>

                                <SignUpForm />

                                <div className="flex-1 cursor-default text-xs text-gray-400 md:text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        size="sm"
                                        onPress={() => setSelected("signin")}
                                        className="cursor-pointer"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </section>
    );
}

export default Page;
