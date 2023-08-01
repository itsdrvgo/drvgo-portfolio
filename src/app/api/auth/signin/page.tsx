import { EmptyPlaceholder } from "@/src/components/global/empty-placeholder";
import LoginButton from "@/src/components/global/nosession-login-button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
    const session = await getServerSession();
    if (session) redirect("/");

    return (
        <div className="flex h-screen items-center justify-center bg-background p-5">
            <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="warning" />
                <EmptyPlaceholder.Title>Invalid Session</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                    You must login in order to view the content of the page
                </EmptyPlaceholder.Description>
                <div className="flex items-center">
                    <LoginButton />
                </div>
            </EmptyPlaceholder>
        </div>
    );
}

export default Page;
