import BlogsPage from "@/src/components/blogs/blogs-page";
import BlogsPageSkeleton from "@/src/components/blogs/skeletons/blogs-page";
import { Suspense } from "react";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">Blogs</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        All the published blogs will appear here
                    </p>
                </div>

                <Suspense fallback={<BlogsPageSkeleton />}>
                    <BlogsPage />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
