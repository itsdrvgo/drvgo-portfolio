import BlogViewFetch from "@/src/components/blogs/blog/blog-view-fetch";
import BlogNav from "@/src/components/blogs/blog/blogs-nav";
import BlogViewSkeleton from "@/src/components/blogs/skeletons/blog-view";
import { siteConfig } from "@/src/config/site";
import { getBlogFromCache } from "@/src/lib/redis/methods/blog";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: { blogId: string };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const blog = await getBlogFromCache(params.blogId);
    if (!blog)
        return {
            title: `Blogs | ${params.blogId}`,
        };

    return {
        title: blog.title,
        description: blog.description,
        openGraph: {
            title: blog.title,
            description: blog.description,
            type: "article",
            images: [
                {
                    url: siteConfig.blogsOgImage,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.name + " | Blogs",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.description,
            images: [siteConfig.blogsOgImage],
        },
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="flex p-5 py-10">
            <div className="container relative flex max-w-[65rem] flex-col gap-4 p-0">
                <Suspense fallback={<BlogViewSkeleton />}>
                    <>
                        <BlogNav params={params} />
                        <BlogViewFetch params={params} />
                    </>
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
