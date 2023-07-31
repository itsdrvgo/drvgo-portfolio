import { Header } from "@/src/components/auth/header";
import { DashFooter } from "@/src/components/global/dash-footer";
import { EmptyPlaceholder } from "@/src/components/global/empty-placeholder";
import { GoBackButton } from "@/src/components/global/go-back-button";
import Navbar from "@/src/components/global/navbar";
import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { RootLayoutProps } from "@/src/types";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: {
        default: "Admin Panel",
        template: "Admin Panel | %s",
    },
    description: "Take administrative actions",
};

async function Layout({ children }: RootLayoutProps) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/signin");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });
    if (!user) redirect("/");

    if (user.role === "user")
        return (
            <main className="flex h-screen items-center justify-center bg-background p-5">
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="warning" />
                    <EmptyPlaceholder.Title>
                        Restricted Area
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You do not have access to view the content of the page
                    </EmptyPlaceholder.Description>
                    <GoBackButton />
                </EmptyPlaceholder>
            </main>
        );

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <DashFooter />
        </div>
    );
}

export default Layout;
