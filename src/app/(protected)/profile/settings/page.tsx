import ProfilePage from "@/src/components/profile/settings/profile-page";
import ProfileSkeleton from "@/src/components/profile/settings/skeletons/profile-skeleton";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[65rem] space-y-8 p-0">
                <div className="flex w-full flex-col gap-5">
                    <div className="space-y-1 md:space-y-2">
                        <p className="text-2xl font-bold md:text-4xl">
                            Settings
                        </p>
                        <p className="text-sm text-gray-400 md:text-base">
                            Manage your account
                        </p>
                    </div>

                    <Suspense fallback={<ProfileSkeleton />}>
                        <ProfilePage />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}

export default Page;
