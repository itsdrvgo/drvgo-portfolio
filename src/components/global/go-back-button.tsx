"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function GoBackButton() {
    const router = useRouter();

    return (
        <div className="flex items-center">
            <Button
                aria-label="Go back to the previous page"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.back()}
            >
                Go back
            </Button>
        </div>
    );
}

export { GoBackButton };
