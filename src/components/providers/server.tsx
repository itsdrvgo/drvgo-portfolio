"use client";

import { DefaultProps } from "@/src/types";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";

function ServerProvider({ children }: DefaultProps) {
    return (
        <NextUIProvider>
            <ClerkProvider>{children}</ClerkProvider>
        </NextUIProvider>
    );
}

export default ServerProvider;
