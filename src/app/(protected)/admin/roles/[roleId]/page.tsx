import RolePage from "@/src/components/admin/roles/role/role-page";
import RoleFormSkeleton from "@/src/components/admin/roles/skeletons/role-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Roles and Permissions",
    description: "Manage and edit roles and their permissions",
};

interface PageProps {
    params: {
        roleId: string;
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="space-y-2">
                        <p className="text-4xl font-bold md:text-5xl">
                            Roles and Permissions
                        </p>
                        <p className="text-sm text-gray-400 md:text-base">
                            Manage and edit roles and their permissions
                        </p>
                    </div>
                </div>

                <Suspense fallback={<RoleFormSkeleton />}>
                    <RolePage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
