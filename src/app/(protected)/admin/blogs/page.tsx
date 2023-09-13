import BlogCreateButton from "@/src/components/admin/blogs/blog-create-button";
import BlogsPage from "@/src/components/admin/blogs/blogs-view-page";
import BlogEditSkeleton from "@/src/components/skeletons/admin-blog-edit-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Blogs Panel",
    description: "Create and manage blogs",
};

function Page() {
    return (
        <section className="m-5 my-10 flex min-h-[calc(100vh-5rem)]">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-0 md:text-left">
                    <div className="flex flex-col justify-center gap-2">
                        <p className="text-4xl font-bold">Blogs</p>
                        <p className="text-gray-400">Create and manage blogs</p>
                    </div>

                    <BlogCreateButton color="primary" />
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
                    <BlogsPage className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3" />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
