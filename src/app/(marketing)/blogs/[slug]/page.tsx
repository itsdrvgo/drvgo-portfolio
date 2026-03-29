import fs from "fs/promises";
import path from "path";
import { BlogPage } from "@/components/blogs";
import { getBlog } from "@/components/blogs/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOGS_DIR } from "@/config/const";
import { siteConfig } from "@/config/site";
import { getAbsoluteURL } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const blog = await getBlog(slug);
    if (!blog)
        return {
            title: "Invalid Blog | Blogs",
            description: "Blog not found",
        };

    return {
        title: blog.meta.title + " | Blogs",
        description: blog.meta.description,
        keywords: blog.meta.tags,
        authors: blog.meta.authors,
        creator: siteConfig.name,
        openGraph: {
            title: blog.meta.title + " | Blogs | " + siteConfig.name,
            description: blog.meta.description,
            type: "article",
            locale: "en_US",
            url: getAbsoluteURL(`/blogs/${blog.slug}`),
            authors: blog.meta.authors.map((author) => author.name),
            publishedTime: new Date(blog.meta.date).toISOString(),
            tags: blog.meta.tags,
            siteName: siteConfig.name,
            images: [
                {
                    url: blog.meta.thumbnail,
                    width: 1920,
                    height: 1080,
                    alt: blog.meta.title,
                },
            ],
        },
        twitter: {
            title: blog.meta.title + " | Blogs | " + siteConfig.name,
            description: blog.meta.description,
            card: "summary_large_image",
            creator: "@itsdrvgo",
            creatorId: "itsdrvgo",
            images: [blog.meta.thumbnail],
        },
    };
}

export async function generateStaticParams() {
    const files = await fs.readdir(path.join(BLOGS_DIR));

    const paths = files.map((filename) => ({
        slug: filename.replace(".mdx", ""),
    }));

    return paths;
}

export default function Page(props: PageProps) {
    return (
        <Suspense fallback={<BlogSkeleton />}>
            <BlogFetch {...props} />
        </Suspense>
    );
}

async function BlogFetch({ params }: PageProps) {
    const { slug } = await params;

    const blog = await getBlog(slug);
    if (!blog) notFound();

    return <BlogPage blog={blog} />;
}

function BlogSkeleton() {
    return (
        <section className="min-h-screen">
            {/* Hero skeleton */}
            <Skeleton className="h-64 w-full md:h-80 lg:h-96" />

            <div className="relative mx-auto -mt-20 max-w-3xl px-5 pb-16 2xl:max-w-4xl">
                {/* Meta card skeleton */}
                <div className="mb-8 space-y-4 rounded-2xl border bg-card/80 p-6 backdrop-blur-md md:p-8">
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </section>
    );
}
