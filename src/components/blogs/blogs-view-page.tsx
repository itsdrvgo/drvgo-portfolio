import { defaultUserPFP } from "@/src/config/const";
import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs, comments, likes, User, users } from "@/src/lib/drizzle/schema";
import { cn, formatDate, shortenNumber } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Mdx } from "../md/mdx-comp";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import BlogViewOperations from "./blog-view-operations";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogViewPage({ params, className }: PageProps) {
    const session = await getServerSession(authOptions);

    const [blog, user] = await Promise.all([
        db.query.blogs.findFirst({
            with: {
                author: true,
                comments: {
                    orderBy: [desc(comments.createdAt)],
                    with: {
                        user: true,
                    },
                },
                likes: true,
                views: true,
            },
            where: eq(blogs.id, Number(params.blogId)),
        }),
        db.query.users.findFirst({
            where: eq(users.id, session?.user.id!),
        }),
    ]);

    if (!blog) notFound();
    if (!user) redirect("/");

    const blogIsLiked = blog.likes.find((like) => like.userId === user.id)
        ? true
        : false;

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex w-full flex-col gap-4">
                <p className="text-2xl font-bold md:text-5xl md:leading-tight">
                    {blog.title}
                </p>
                <Separator className="w-full" />
                <div className="flex items-center gap-3 text-xs md:text-sm">
                    <Avatar>
                        <AvatarImage
                            src={blog.author.image ?? defaultUserPFP.src}
                            alt={blog.author.name ?? blog.author.id}
                        />
                        <AvatarFallback>
                            {(blog.author.name ?? blog.author.id)
                                .charAt(0)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p>@{blog.author.name ?? blog.author.id}</p>
                        <p className="text-gray-400">
                            Published on {formatDate(Date.now())}
                        </p>
                    </div>
                </div>
                <Image
                    src={blog.thumbnailUrl!}
                    alt="thumbnail"
                    width={2000}
                    height={2000}
                    className="h-full w-full rounded"
                />
                <Mdx
                    className="prose prose-lg max-w-full text-sm text-white md:text-base"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[
                        rehypeKatex,
                        rehypeSlug,
                        [
                            rehypePrettyCode,
                            {
                                theme: "github-dark",
                                onVisitLine(node: any) {
                                    if (node.children.length === 0) {
                                        node.children = [
                                            { type: "text", value: " " },
                                        ];
                                    }
                                },
                                onVisitHighlightedLine(node: any) {
                                    node.properties.className.push(
                                        "line--highlighted"
                                    );
                                },
                                onVisitHighlightedWord(node: any) {
                                    node.properties.className = [
                                        "word--highlighted",
                                    ];
                                },
                            },
                        ],
                        [
                            rehypeAutolinkHeadings,
                            {
                                properties: {
                                    className: ["subheading-anchor"],
                                    ariaLabel: "Link to section",
                                },
                            },
                        ],
                    ]}
                >
                    {blog.content!}
                </Mdx>
            </div>

            <div className="flex w-full cursor-default items-center justify-between rounded-md bg-zinc-900 p-5 py-3 text-sm">
                <div>
                    <p>{shortenNumber(blog.likes.length)} Likes</p>
                </div>
                <div className="flex items-center gap-4">
                    <p>{shortenNumber(blog.comments.length)} Comments</p>
                    <p>{shortenNumber(blog.views.length)} Views</p>
                </div>
            </div>
            <Separator className="w-full" />

            <BlogViewOperations
                params={params}
                blog={blog}
                user={user}
                blogIsLiked={blogIsLiked}
                className="space-y-3"
            />
        </div>
    );
}

export default BlogViewPage;
