import ChatsViewPage from "@/src/components/chats/chats-fetch";
import { ChatSectionSkeleton } from "@/src/components/chats/skeletons/sidebar";
import { getUserFromCache } from "@/src/lib/redis/methods/user";
import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    searchParams?: {
        uId?: string;
        pId?: string;
    };
}

export async function generateMetadata({
    searchParams,
}: PageProps): Promise<Metadata> {
    if (!searchParams) return { title: "Chats" };

    const { uId, pId } = searchParams;
    if (!uId || !pId) return { title: "Chats" };

    const user = await currentUser();
    if (!user) return { title: "Chats" };

    const chatPartnerId = uId === user.id ? pId : uId;
    const chatPartner = await getUserFromCache(chatPartnerId);
    if (!chatPartner) return { title: "Chats" };

    return {
        title: `Chat with @${chatPartner.username}`,
        description: `Chat with @${chatPartner.username}`,
    };
}

function Page({ searchParams }: PageProps) {
    return (
        <Suspense fallback={<ChatSectionSkeleton />}>
            <ChatsViewPage searchParams={searchParams} />
        </Suspense>
    );
}

export default Page;
