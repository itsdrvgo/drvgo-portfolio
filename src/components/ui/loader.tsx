"use client";

import { cn } from "@/src/lib/utils";
import { Spinner } from "@nextui-org/react";
import { HTMLAttributes } from "react";

function Loader({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <div
            className={cn("flex w-full justify-center p-5", className)}
            {...props}
        >
            <Spinner />
        </div>
    );
}

export default Loader;
