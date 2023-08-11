import { defaultBlogThumbnail } from "@/src/config/const";
import { Blog } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { BlogOperations } from "./blog-item-operations";

interface PageProps extends DefaultProps {
    blog: Pick<
        Blog,
        | "id"
        | "title"
        | "published"
        | "createdAt"
        | "thumbnailUrl"
        | "content"
        | "description"
    >;
}

export function BlogItem({ blog, className }: PageProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-2 overflow-hidden rounded-md border border-gray-500",
                className
            )}
        >
            <Image
                src={blog.thumbnailUrl ?? defaultBlogThumbnail.src}
                alt={blog.id.toString()}
                width={500}
                height={500}
                className="aspect-video object-cover"
            />
            <div className="flex h-full w-full items-center justify-between p-5">
                <div className="flex h-full basis-5/6 flex-col justify-between">
                    <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="font-semibold hover:underline"
                    >
                        {blog.title}
                    </Link>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(blog.createdAt.toDateString())}
                        </p>
                    </div>
                </div>
                <BlogOperations
                    blog={{
                        id: blog.id,
                        title: blog.title,
                        published: blog.published,
                        thumbnailUrl: blog.thumbnailUrl,
                        content: blog.content,
                        description: blog.description,
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
                />
            </div>
        </div>
    );
}
