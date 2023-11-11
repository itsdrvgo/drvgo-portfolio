"use client";

import { DefaultProps } from "@/src/types";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ClientProvider({ children }: DefaultProps) {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient());

    return (
        <NextUIProvider navigate={router.push}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={true} />
            </QueryClientProvider>
        </NextUIProvider>
    );
}

export default ClientProvider;
