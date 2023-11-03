import BlogsPage from "@/src/components/admin/blogs/blogs-view-page";
import BlogsPageSkeleton from "@/src/components/admin/blogs/skeletons/blogs-page";
import BlogCreateButton from "@/src/components/global/buttons/blog-create-button";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Blogs",
    description: "Create and manage blogs",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="space-y-2">
                        <p className="text-4xl font-bold md:text-5xl">Blogs</p>
                        <p className="text-sm text-gray-400 md:text-base">
                            Create and manage blogs
                        </p>
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
