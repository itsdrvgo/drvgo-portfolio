import UsersView from "@/src/components/admin/users/users-view";
import UsersTableSkeleton from "@/src/components/skeletons/users-table-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Users Panel",
    description: "Manager users connected to the site",
};

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-10 md:space-y-16">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">Users Table</p>
                    <p className="text-gray-400">Manage your users from here</p>
                </div>
                <Suspense fallback={<UsersTableSkeleton />}>
                    <UsersView />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
