import ChatsViewPage from "@/src/components/chats/chats-view-page";
import { ChatSectionSkeleton } from "@/src/components/chats/skeletons/sidebar";
import { Suspense } from "react";

function Page() {
    return (
        <Suspense fallback={<ChatSectionSkeleton />}>
            <ChatsViewPage />
        </Suspense>
    );
}

export default Page;
