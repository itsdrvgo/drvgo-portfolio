"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function GoHomeButton() {
    const router = useRouter();

    return (
        <div className="flex items-center">
            <Button
                aria-label="Go back to the previous page"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push("/")}
            >
                Go Home
            </Button>
        </div>
    );
}

export { GoHomeButton };
