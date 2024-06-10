import fs from "fs";
import path from "path";
import { BlogCard } from "@/components/blogs";
import { BLOGS_DIR } from "@/config/const";
import { SLACKEY_FONT } from "@/config/fonts";
import { cn } from "@/lib/utils";
import { Blog, blogMetadataSchema } from "@/lib/validation/blog";
import matter from "gray-matter";

function Page() {
    const blogFiles = fs.readdirSync(path.join(BLOGS_DIR));
    const blogs: Blog[] = [];

    for (const blogFile of blogFiles) {
        const fileContent = fs.readFileSync(
            path.join(BLOGS_DIR, blogFile),
            "utf-8"
        );

        const { data: frontMatter, content } = matter(fileContent);
        const parsedBlog = blogMetadataSchema.safeParse(frontMatter);

        if (!parsedBlog.success) continue;

        blogs.push({
            meta: parsedBlog.data,
            slug: blogFile.replace(/\.mdx?/, ""),
            content,
        });
    }

    return (
        <section
            className={cn(
                SLACKEY_FONT.className,
                "flex min-h-screen justify-center p-5 py-10"
            )}
        >
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <div className="space-y-3 text-center md:text-start">
                    <h2 className="text-3xl font-bold md:text-5xl">My Blogs</h2>
                    <p className="text-sm md:text-base">
                        I write about latest technologies, programming and
                        more...
                    </p>
                </div>

                <div className="grid gap-2 py-2 md:grid-cols-3 md:gap-4">
                    {blogs
                        .sort(
                            (a, b) =>
                                new Date(b.meta.date).getTime() -
                                new Date(a.meta.date).getTime()
                        )
                        .map(
                            (blog) =>
                                blog && <BlogCard key={blog.slug} blog={blog} />
                        )}
                </div>
            </div>
        </section>
    );
}

export default Page;
