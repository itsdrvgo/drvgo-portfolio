import PatchEditPage from "@/src/components/admin/patches/patch-edit";
import BlogViewSkeleton from "@/src/components/skeletons/blog-view-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "New Patch",
    description: "Create a new patch",
};

interface PageProps {
    params: { patchId: string };
}

function Page({ params }: PageProps) {
    return (
        <section className="my-10 flex p-5">
            <div className="container max-w-[65rem] space-y-10 p-0 md:space-y-16">
                <Suspense fallback={<BlogViewSkeleton />}>
                    <PatchEditPage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;