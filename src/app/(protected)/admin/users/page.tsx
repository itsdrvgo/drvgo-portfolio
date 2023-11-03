import UsersTableSkeleton from "@/src/components/admin/users/skeletons/users-table";
import UsersView from "@/src/components/admin/users/users-view";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Users",
    description: "Manager users connected to the site",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Users Table
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Manage your users from here
                    </p>
                </div>

                <Suspense fallback={<UsersTableSkeleton />}>
                    <UsersView />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
