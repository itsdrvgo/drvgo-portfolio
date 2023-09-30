import BlogEditPage from "@/src/components/admin/blogs/blog/blog-edit";
import BlogEditSkeleton from "@/src/components/admin/blogs/skeletons/blog-edit";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "New Blog",
    description: "Create a new blog",
};

interface PageProps {
    params: { blogId: string };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[65rem] space-y-10 p-0 md:space-y-16">
                <Suspense fallback={<BlogEditSkeleton />}>
                    <BlogEditPage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
