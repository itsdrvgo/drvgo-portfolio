"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    EmptyPlaceholder,
    EmptyPlaceholderContent,
    EmptyPlaceholderDescription,
    EmptyPlaceholderFooter,
    EmptyPlaceholderHeader,
    EmptyPlaceholderIcon,
    EmptyPlaceholderTitle,
} from "@/components/ui/empty-placeholder";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Blog } from "@/lib/validations";
import { format } from "date-fns";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PageProps {
    blogs: Blog[];
}

export function BlogsPage({ blogs }: PageProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs.filter((blog) => {
        const query = searchQuery.toLowerCase();
        if (query === "") return true;

        if (blog.meta.title.toLowerCase().includes(query)) return true;
        if (blog.meta.description.toLowerCase().includes(query)) return true;
        if (blog.meta.tags.some((tag) => tag.toLowerCase().includes(query)))
            return true;
        if (
            blog.meta.authors.some((author) =>
                author.name.toLowerCase().includes(query)
            )
        )
            return true;

        return false;
    });

    const sorted = filteredBlogs.sort(
        (a, b) =>
            new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );

    if (blogs.length === 0)
        return (
            <motion.div
                className="flex justify-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <EmptyPlaceholder>
                    <EmptyPlaceholderIcon>
                        <Icons.AlertTriangle />
                    </EmptyPlaceholderIcon>

                    <EmptyPlaceholderContent>
                        <EmptyPlaceholderHeader>
                            <EmptyPlaceholderTitle>
                                No Blogs Found
                            </EmptyPlaceholderTitle>
                            <EmptyPlaceholderDescription>
                                No blogs have been published yet. Please check
                                back later.
                            </EmptyPlaceholderDescription>
                        </EmptyPlaceholderHeader>

                        <EmptyPlaceholderFooter>
                            <Button
                                size="sm"
                                asChild
                                className="rounded-full border"
                            >
                                <Link href="/">Go Back</Link>
                            </Button>
                        </EmptyPlaceholderFooter>
                    </EmptyPlaceholderContent>
                </EmptyPlaceholder>
            </motion.div>
        );

    return (
        <div className="space-y-10">
            {/* Search */}
            <motion.div
                className="relative mx-auto max-w-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative">
                    <Icons.Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        className="h-11 w-full rounded-full bg-card/50 py-2 pr-10 pl-10 backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full text-muted-foreground"
                            onClick={() => setSearchQuery("")}
                        >
                            <Icons.X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </motion.div>

            {sorted.length === 0 ? (
                <motion.div
                    className="flex justify-center py-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <EmptyPlaceholder>
                        <EmptyPlaceholderIcon>
                            <Icons.Search className="h-8 w-8" />
                        </EmptyPlaceholderIcon>

                        <EmptyPlaceholderContent>
                            <EmptyPlaceholderHeader>
                                <EmptyPlaceholderTitle>
                                    No results found
                                </EmptyPlaceholderTitle>
                                <EmptyPlaceholderDescription>
                                    No blogs matching your search. Try different
                                    keywords.
                                </EmptyPlaceholderDescription>
                            </EmptyPlaceholderHeader>

                            <EmptyPlaceholderFooter>
                                <Button
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear Search
                                </Button>
                            </EmptyPlaceholderFooter>
                        </EmptyPlaceholderContent>
                    </EmptyPlaceholder>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {/* Featured — first blog as hero card */}
                    <FeaturedBlogCard blog={sorted[0]} />

                    {/* Rest in grid */}
                    {sorted.length > 1 && (
                        <motion.div
                            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        >
                            {sorted.slice(1).map((blog, index) => (
                                <BlogCard
                                    key={blog.slug}
                                    blog={blog}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

function FeaturedBlogCard({ blog }: { blog: Blog }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link
                href={`/blogs/${blog.slug}`}
                className="group relative block overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-primary/5"
            >
                <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
                        <Image
                            src={blog.meta.thumbnail}
                            alt={blog.meta.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                        <span className="w-fit rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                            Latest
                        </span>

                        <h2 className="text-xl leading-tight font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                            {blog.meta.title}
                        </h2>

                        <p className="line-clamp-2 text-sm text-muted-foreground md:text-base">
                            {blog.meta.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {blog.meta.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <AuthorAvatars authors={blog.meta.authors} />
                            <span className="text-xs text-muted-foreground">
                                {format(
                                    new Date(blog.meta.date),
                                    "MMM d, yyyy"
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: 0.08 + index * 0.05,
            }}
        >
            <Link
                href={`/blogs/${blog.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={blog.meta.thumbnail}
                        alt={blog.meta.title}
                        height={1920}
                        width={1080}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap gap-1.5">
                        {blog.meta.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h3 className="line-clamp-2 text-sm leading-snug font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {blog.meta.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <AuthorAvatars authors={blog.meta.authors} />
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(blog.meta.date), "MMM d, yyyy")}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function AuthorAvatars({ authors }: { authors: Blog["meta"]["authors"] }) {
    return (
        <div className="flex items-center gap-1">
            {authors.slice(0, 2).map((author, i) => (
                <TooltipProvider key={i}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar
                                className={cn(
                                    "size-6 rounded-full border-2 border-card",
                                    i !== 0 && "-ml-2"
                                )}
                            >
                                <AvatarImage
                                    src={author.image}
                                    alt={author.name}
                                />
                                <AvatarFallback className="text-[10px]">
                                    {author.name[0]}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{author.name}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}

            {authors.length > 2 && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground">
                                +{authors.length - 2}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            {authors
                                .slice(2)
                                .map((a) => a.name)
                                .join(", ")}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}
