import { defaultUserPFP } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { blogs, comments, User, users } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import BlogViewOperations from "./blog-view-operations";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
}

async function BlogViewPage({ params, className }: PageProps) {
    const authUser = await currentUser();

    const blog = await db.query.blogs.findFirst({
        with: {
            author: true,
            comments: {
                orderBy: [desc(comments.createdAt)],
                with: {
                    user: true,
                    loves: true,
                    blog: true,
                },
            },
            likes: true,
            views: true,
        },
        where: eq(blogs.id, params.blogId),
    });

    if (!blog) notFound();

    let user: User | null;
    let blogIsLiked: boolean;

    if (authUser) {
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });

        if (!dbUser) redirect("/signin");
        user = dbUser;

        blogIsLiked = blog.likes.find((like) => like.userId === user?.id)
            ? true
            : false;
    } else {
        user = null;
        blogIsLiked = false;
    }

    return (
        <article
            className={cn(
                "relative flex flex-col items-center gap-3",
                className
            )}
        >
            <div className="flex w-full flex-col gap-4">
                <p className="text-2xl font-bold md:text-5xl md:leading-tight">
                    {blog.title}
                </p>
                <Separator className="w-full" />
                <div className="z-10 flex items-center gap-3 text-xs md:text-sm">
                    <Avatar>
                        <AvatarImage
                            src={blog.author.image ?? defaultUserPFP.src}
                            alt={blog.author.username}
                        />
                        <AvatarFallback>
                            {blog.author.username[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p>@{blog.author.username}</p>
                        <div className="flex gap-1">
                            <p className="text-gray-400">
                                Published on{" "}
                                {formatDate(blog.createdAt.toDateString())}
                            </p>
                            {blog.updatedAt ? (
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-gray-400">
                                                (Updated)
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {formatDate(
                                                    blog.updatedAt.toDateString()
                                                )}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : null}
                        </div>
                    </div>
                </div>
                <Image
                    src={blog.thumbnailUrl!}
                    alt="thumbnail"
                    width={1920}
                    height={1080}
                    className="rounded object-cover"
                />
                {blog.content?.split("\n").length! > 1 ? (
                    <div className="flex cursor-default flex-col gap-4 rounded-md border border-gray-400 bg-stone-950 p-5">
                        <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                            Table of Contents
                        </p>

                        <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                            {blog.content?.split("\n").map((x, index) => {
                                if (x.startsWith("## ")) {
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={`#${x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-300 transition-all ease-in-out hover:text-white"
                                            >
                                                {x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                } else if (x.startsWith("### ")) {
                                    return (
                                        <li key={index} className="ml-5">
                                            <Link
                                                href={`#${x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-400 transition-all ease-in-out hover:text-gray-300"
                                            >
                                                {x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ol>
                    </div>
                ) : null}
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

            <Separator className="w-full" />

            <BlogViewOperations
                params={params}
                blog={blog}
                user={user}
                blogIsLiked={blogIsLiked}
            />
        </article>
    );
}

export default BlogViewPage;
