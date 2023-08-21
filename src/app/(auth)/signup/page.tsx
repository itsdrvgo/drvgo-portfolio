import OAuth from "@/src/components/auth/oauth-signin";
import { SignUpForm } from "@/src/components/forms/signup-form";
import { DRVGOIcon } from "@/src/config/const";
import Image from "next/image";
import Link from "next/link";

function Page() {
    return (
        <section className="m-6 my-0 flex min-h-[calc(100vh-12rem)] items-center justify-center">
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
                        <div className="space-y-2">
                            <p className="text-3xl font-bold">Sign Up</p>
                            <p className="text-sm text-gray-400">
                                Create a new account
                            </p>
                        </div>

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

                        <div className="flex-1 text-xs text-muted-foreground md:text-sm">
                            Already have an account?{" "}
                            <Link
                                aria-label="Sign in"
                                href="/signin"
                                className="text-accent-foreground underline-offset-4 transition-colors hover:underline"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Page;
