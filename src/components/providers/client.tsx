"use client";

import { DefaultProps } from "@/src/types";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function ClientProvider({ children }: DefaultProps) {
    return (
        <NextUIProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={true} />
            </QueryClientProvider>
        </NextUIProvider>
    );
}

export default ClientProvider;
