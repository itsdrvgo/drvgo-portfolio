import AnnouncementPage from "@/src/components/admin/announcements/announcement-page";
import AnnouncementFormSkeleton from "@/src/components/admin/announcements/skeletons/announcement-page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Announcements",
    description: "Send announcements to all of the users",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Announcements
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Send announcements to all of the users
                    </p>
                </div>

                <Suspense fallback={<AnnouncementFormSkeleton />}>
                    <AnnouncementPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
