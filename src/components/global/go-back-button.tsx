"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function GoBackButton() {
    const router = useRouter();

    return (
        <div className="flex items-center">
            <Button
                aria-label="Go back to the previous page"
                color="secondary"
                radius="sm"
                className="border border-gray-700"
                onPress={() => router.back()}
            >
                Go back
            </Button>
        </div>
    );
}

export { GoBackButton };
