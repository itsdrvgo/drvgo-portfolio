import { env } from "@/env.mjs";
import BlogViewPage from "@/src/components/blogs/blogs-view-page";
import BlogViewSkeleton from "@/src/components/skeletons/blog-view-skeleton";
import { db } from "@/src/lib/drizzle";
import { blogs } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: { blogId: string };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const blog = await db.query.blogs.findFirst({
        where: eq(blogs.id, Number(params.blogId)),
    });
    if (!blog)
        return {
            title: `Blogs | ${params.blogId}`,
        };

    const url = env.NEXT_PUBLIC_APP_URL;
    const ogUrl = new URL(`${url}/blogs/${blog.id}`);

    return {
        title: blog.title,
        description: blog.title,
        openGraph: {
            title: blog.title,
            description: blog.title,
            type: "article",
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.title,
            images: [ogUrl.toString()],
        },
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="m-5 my-10 flex min-h-[calc(100vh-5rem)]">
            <div className="container max-w-[65rem] space-y-10 p-0 md:space-y-16">
                <Suspense fallback={<BlogViewSkeleton />}>
                    <BlogViewPage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
