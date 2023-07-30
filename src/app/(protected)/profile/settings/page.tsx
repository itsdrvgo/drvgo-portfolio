import ProfilePage from "@/src/components/profile/settings/profile-page";
import SidebarOperation from "@/src/components/profile/settings/side-bar-operation";
import ProfileSkeleton from "@/src/components/skeletons/profile-skeleton";
import { Suspense } from "react";

function Page() {
    return (
        <div className="relative w-full space-y-4 p-2 md:space-y-0">
            <SidebarOperation className="visible md:hidden" />

            <div className="flex w-full flex-col gap-5">
                <div className="space-y-1 md:space-y-2">
                    <p className="text-2xl font-bold md:text-4xl">Settings</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Manage your account
                    </p>
                </div>

                <Suspense fallback={<ProfileSkeleton />}>
                    <ProfilePage />
                </Suspense>
            </div>
        </div>
    );
}

export default Page;
