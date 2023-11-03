import RolesPage from "@/src/components/admin/roles/roles-page";
import RolesPageSkeleton from "@/src/components/admin/roles/skeletons/roles-page";
import RoleCreateButton from "@/src/components/global/buttons/role-create-button";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Roles Panel",
    description: "Create roles and manage their permissions",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="space-y-2">
                        <p className="text-4xl font-bold md:text-5xl">
                            Roles and Permissions
                        </p>
                        <p className="text-sm text-gray-400 md:text-base">
                            Create roles and manage their permissions
                        </p>
                    </div>

                    <RoleCreateButton
                        color="success"
                        className="bg-primary-900"
                    />
                </div>

                <Suspense fallback={<RolesPageSkeleton />}>
                    <RolesPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
