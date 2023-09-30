import BlogsPage from "@/src/components/blogs/blogs-page";
import BlogsPageSkeleton from "@/src/components/blogs/skeletons/blogs-page";
import { Suspense } from "react";

function Page() {
    return (
        <section className="p-5 py-10">
            <div className="container max-w-[75rem] space-y-8 p-0">
                <div className="space-y-3 text-center">
                    <p className="text-5xl font-bold">Blogs</p>
                    <p className="text-gray-500">
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
