import BlogEditPage from "@/src/components/admin/blogs/blog/blog-edit";
import BlogEditSkeleton from "@/src/components/admin/blogs/skeletons/blog-edit";
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

    if (!blog.title || !blog.title.length)
        return {
            title: "Blogs | New Blog",
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
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <Suspense fallback={<BlogEditSkeleton />}>
                    <BlogEditPage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
