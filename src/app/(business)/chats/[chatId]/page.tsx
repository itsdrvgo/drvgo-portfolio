import ChatsViewPage from "@/src/components/chats/chats-view-page";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { chatHrefConstructor } from "@/src/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { chatId } = params;

    const user = await currentUser();
    if (!user) return { title: "Chats" };

    const [userId1, userId2] = chatId.split("--");
    if (userId1 !== user.id && userId2 !== user.id) return { title: "Chats" };

    const chatPartnerId = userId1 === user.id ? userId2 : userId1;

    const partner = await db.query.users.findFirst({
        where: eq(users.id, chatPartnerId),
    });
    if (!partner) return { title: "Chats" };

    return {
        title: "Chat with @" + partner?.username,
        description: "Chat with @" + partner?.username,
    };
}

interface PageProps {
    params: {
        chatId: string;
    };
}

function Page({ params }: PageProps) {
    const { chatId } = params;
    const [userId1, userId2] = chatId.split("--");

    if (chatHrefConstructor(userId1, userId2) !== chatId)
        redirect(`/chats/${chatHrefConstructor(userId1, userId2)}`);

    return <ChatsViewPage params={params} />;
}

export default Page;
