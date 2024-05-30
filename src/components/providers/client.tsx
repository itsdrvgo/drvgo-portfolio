"use client";

import { LayoutProps } from "@/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ClientProvider({ children }: LayoutProps) {
    return (
        <NextThemesProvider attribute="class">{children}</NextThemesProvider>
    );
}
