"use client";

import { EmptyPlaceholder } from "@/src/components/global/empty-placeholder";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

function Page() {
    const router = useRouter();
    const { data: session } = useSession();
    if (session) redirect("/");

    return (
        <div className="flex h-screen items-center justify-center bg-background p-5">
            <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="warning" />
                <EmptyPlaceholder.Title>Invalid Session</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                    No valid session was found, you must login in order to
                    conitnue
                </EmptyPlaceholder.Description>
                <div className="flex items-center">
                    <Button
                        aria-label="Login to continue"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </Button>
                </div>
            </EmptyPlaceholder>
        </div>
    );
}

export default Page;
