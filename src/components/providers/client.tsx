"use client";

import { DefaultProps } from "@/src/types";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function ClientProvider({ children }: DefaultProps) {
    const router = useRouter();
    return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}

export default ClientProvider;
