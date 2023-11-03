"use client";

import { EmptyPlaceholder } from "@/src/components/ui/empty-placeholder";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";

function InvalidBday({ className, ...props }: DefaultProps) {
    return (
        <section
            className={cn(
                "container flex h-screen items-center justify-center p-4 md:p-6",
                className
            )}
            {...props}
        >
            <EmptyPlaceholder
                title="Who are you?"
                description="Seems like the URL you entered is invalid! Please check the URL and try again!"
                icon="warning"
                className="max-w-md"
            />
        </section>
    );
}

export default InvalidBday;
