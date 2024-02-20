import fs from "fs";
import path from "path";
import BlogCard from "@/src/components/blogs/blog-card";
import GeneralShell from "@/src/components/global/shells/general-shell";
import { BLOGS_DIR } from "@/src/config/const";
import { Blog, blogMetadataSchema } from "@/src/lib/validation/blog";
import matter from "gray-matter";

function Page() {
    const files = fs.readdirSync(path.join(BLOGS_DIR));
    const blogs: Blog[] = [];

    for (const filename of files) {
        const fileContent = fs.readFileSync(
            path.join(BLOGS_DIR, filename),
            "utf-8"
        );

        const { data: frontMatter, content } = matter(fileContent);
        const parsedBlog = blogMetadataSchema.safeParse(frontMatter);

        if (!parsedBlog.success) continue;

        blogs.push({
            meta: parsedBlog.data,
            slug: filename.replace(".mdx", ""),
            content,
        });
    }

    return (
        <GeneralShell>
            <div className="space-y-3 text-center">
                <h2 className="text-3xl font-bold md:text-5xl">Blogs</h2>
                <p className="text-white/60">
                    I write about my experiences with music, and programming.
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
        </GeneralShell>
    );
}

export default Page;
