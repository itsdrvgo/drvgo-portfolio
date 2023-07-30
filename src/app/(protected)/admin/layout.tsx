import { Header } from "@/src/components/auth/header";
import { DashFooter } from "@/src/components/global/dash-footer";
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
            <main className="flex-1">
                <div className="container flex min-h-[calc(100vh-5rem)] max-w-[30rem] flex-col items-center justify-center gap-8 pb-8 pt-6 md:py-8">
                    <Header
                        title="Restricted Area"
                        description="You do not have access to view the content of the page."
                        size="sm"
                        className="text-center"
                    />
                    <GoBackButton />
                </div>
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
