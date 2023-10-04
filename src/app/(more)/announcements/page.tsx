import AnnouncementPage from "@/src/components/announcements/announcements-page";
import AnnouncementSkeleton from "@/src/components/announcements/skeletons/announcement-page";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] p-0">
                <Suspense fallback={<AnnouncementSkeleton />}>
                    <AnnouncementPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
