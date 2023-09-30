import RolePage from "@/src/components/admin/roles/role/role-page";
import RoleFormSkeleton from "@/src/components/admin/roles/skeletons/role-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Role Panel",
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
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="flex flex-col justify-center gap-2">
                        <p className="text-2xl font-bold md:text-4xl">
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
