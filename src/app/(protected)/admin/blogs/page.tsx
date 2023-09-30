import BlogsPage from "@/src/components/admin/blogs/blogs-view-page";
import BlogsPageSkeleton from "@/src/components/admin/blogs/skeletons/blogs-page";
import BlogCreateButton from "@/src/components/global/buttons/blog-create-button";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Blogs Panel",
    description: "Create and manage blogs",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="flex flex-col justify-center gap-2">
                        <p className="text-4xl font-bold">Blogs</p>
                        <p className="text-gray-400">Create and manage blogs</p>
                    </div>

                    <BlogCreateButton
                        color="success"
                        className="bg-primary-900"
                    />
                </div>

                <Suspense fallback={<BlogsPageSkeleton />}>
                    <BlogsPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
