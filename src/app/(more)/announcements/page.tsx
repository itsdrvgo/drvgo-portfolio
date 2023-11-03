import AnnouncementPage from "@/src/components/announcements/announcements-page";
import AnnouncementSkeleton from "@/src/components/announcements/skeletons/announcement-page";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <Suspense fallback={<AnnouncementSkeleton />}>
                    <AnnouncementPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
