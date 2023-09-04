import PatchCreateButton from "@/src/components/admin/patches/patch-create-button";
import PatchViewPage from "@/src/components/admin/patches/patch-view-page";
import BlogEditSkeleton from "@/src/components/skeletons/admin-blog-edit-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Patch Notes",
    description: "Write and manage patch notes for your app",
};

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="flex flex-col justify-center gap-2">
                        <p className="text-4xl font-bold">Patch Notes</p>
                        <p className="text-gray-400">
                            Write and manage patch notes for your app
                        </p>
                    </div>
                    <PatchCreateButton />
                </div>
                <Suspense
                    fallback={
                        <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                            {Array.from({ length: 4 }, (_, index) => (
                                <BlogEditSkeleton key={index} />
                            ))}
                        </div>
                    }
                >
                    <PatchViewPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
