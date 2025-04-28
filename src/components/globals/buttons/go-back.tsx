"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GoBackButton(props: ButtonProps) {
    const router = useRouter();

    return (
        <Button
            aria-label="Go back to the previous page"
            onClick={() => router.back()}
            {...props}
        >
            Go back
        </Button>
    );
}
