import BlogsPage from "@/src/components/blogs/blogs-page";
import BlogsSkeleton from "@/src/components/skeletons/blogs-view-skeleton";
import { Suspense } from "react";

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-8">
                <div className="space-y-3 text-center">
                    <p className="text-5xl font-bold">Blogs</p>
                    <p className="text-gray-500">
                        All the published blogs will appear here
                    </p>
                </div>
                <Suspense fallback={<BlogsSkeleton />}>
                    <BlogsPage className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3" />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
