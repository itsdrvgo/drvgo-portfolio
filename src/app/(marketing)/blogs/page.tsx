import fs from "fs/promises";
import path from "path";
import { slackey } from "@/app/fonts";
import { BlogsPage, BlogTitle } from "@/components/blogs";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOGS_DIR } from "@/config/const";
import { cn } from "@/lib/utils";
import { Blog, blogMetaSchema } from "@/lib/validations";
import matter from "gray-matter";
import { Suspense } from "react";

export default function Page() {
    return (
        <section
            className={cn(
                slackey.className,
                "flex min-h-screen justify-center p-5 py-10"
            )}
        >
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <BlogTitle />

                <Suspense fallback={<BlogsSkeleton />}>
                    <BlogsFetch />
                </Suspense>
            </div>
        </section>
    );
}

async function BlogsFetch() {
    const files = await fs.readdir(path.join(BLOGS_DIR));
    const blogs: Blog[] = [];

    for (const file of files) {
        const fContent = await fs.readFile(path.join(BLOGS_DIR, file), "utf-8");

        const { data: frontMatter, content } = matter(fContent);
        const parsed = blogMetaSchema.safeParse(frontMatter);
        if (parsed.success) {
            blogs.push({
                slug: file.replace(/\.mdx?$/, ""),
                meta: parsed.data,
                content,
            });
        }
    }

    return <BlogsPage blogs={blogs} />;
}

function BlogsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="relative">
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid gap-2 py-2 md:grid-cols-3 md:gap-4">
                {Array(6)
                    .fill(0)
                    .map((_, i) => (
                        <Skeleton
                            key={i}
                            className="group relative aspect-[3/2.5] overflow-hidden rounded-lg"
                        />
                    ))}
            </div>
        </div>
    );
}
