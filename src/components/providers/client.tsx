"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ClientProvider({ children }: ChildrenProps) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="light">
            {children}
        </NextThemesProvider>
    );
}
