import { defaultUserPFP } from "@/src/config/const";
import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { blogs, comments, likes, users } from "@/src/lib/drizzle/schema";
import { cn, formatDate, shortenNumber } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { and, desc, eq } from "drizzle-orm";
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

    const blog = await db.query.blogs.findFirst({
        where: eq(blogs.id, Number(params.blogId)),
    });
    if (!blog) notFound();

    const postedComments = await db.query.comments.findMany({
        where: eq(comments.blogId, Number(params.blogId)),
        orderBy: [desc(comments.createdAt)],
    });

    const blogLikes = await db.query.likes.findMany({
        where: eq(blogs.id, Number(params.blogId)),
    });

    const user = await db.query.users.findFirst({
        where: eq(users.id, session?.user.id!),
    });
    if (!user) redirect("/");

    let author = await db.query.users.findFirst({
        where: eq(users.id, blog.authorId),
    });
    if (!author) author = user;

    const commentedUsers = await db.query.users.findMany({
        with: {
            comments: true,
        },
    });

    const blogLiked = await db.query.likes.findFirst({
        where: and(
            eq(likes.blogId, Number(params.blogId)),
            eq(likes.userId, user.id)
        ),
    });

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
                            src={author.image ?? defaultUserPFP.src}
                            alt={author.name ?? author.id}
                        />
                        <AvatarFallback>
                            {(author.name ?? author.id).charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p>@{author.name ?? author.id}</p>
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
                    <p>{shortenNumber(blog.likes)} Likes</p>
                </div>
                <div className="flex items-center gap-4">
                    <p>{shortenNumber(blog.commentsCount)} Comments</p>
                    <p>{shortenNumber(blog.views)} Views</p>
                </div>
            </div>
            <Separator className="w-full" />

            <BlogViewOperations
                params={params}
                blog={blog}
                comments={postedComments}
                likes={blogLikes}
                user={user}
                users={commentedUsers}
                like={blogLiked}
                className="space-y-3"
            />
        </div>
    );
}

export default BlogViewPage;
