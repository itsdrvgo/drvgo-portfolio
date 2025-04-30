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

        // Search in title
        if (blog.meta.title.toLowerCase().includes(query)) return true;

        // Search in description
        if (blog.meta.description.toLowerCase().includes(query)) return true;

        // Search in tags
        if (blog.meta.tags.some((tag) => tag.toLowerCase().includes(query)))
            return true;

        // Search in authors
        if (
            blog.meta.authors.some((author) =>
                author.name.toLowerCase().includes(query)
            )
        )
            return true;

        return false;
    });

    if (blogs.length === 0)
        return (
            <motion.div
                className="flex justify-center"
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
                            <Button size="sm" asChild className="border">
                                <Link href="/">Go Back</Link>
                            </Button>
                        </EmptyPlaceholderFooter>
                    </EmptyPlaceholderContent>
                </EmptyPlaceholder>
            </motion.div>
        );

    return (
        <div className="space-y-6">
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative">
                    <Icons.Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search blogs by title, tags, or authors..."
                        className="h-10 w-full border-border py-2 pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setSearchQuery("")}
                        >
                            <Icons.X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </motion.div>

            {filteredBlogs.length === 0 ? (
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
                                    keywords or clear the search.
                                </EmptyPlaceholderDescription>
                            </EmptyPlaceholderHeader>

                            <EmptyPlaceholderFooter>
                                <Button
                                    size="sm"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Clear Search
                                </Button>
                            </EmptyPlaceholderFooter>
                        </EmptyPlaceholderContent>
                    </EmptyPlaceholder>
                </motion.div>
            ) : (
                <motion.div
                    className="grid gap-2 py-2 md:grid-cols-3 md:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {filteredBlogs
                        .sort(
                            (a, b) =>
                                new Date(b.meta.date).getTime() -
                                new Date(a.meta.date).getTime()
                        )
                        .map((blog, index) => (
                            <BlogCard
                                key={blog.slug}
                                blog={blog}
                                index={index}
                            />
                        ))}
                </motion.div>
            )}
        </div>
    );
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
                ease: "easeOut",
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
            }}
        >
            <Link
                href={`/blogs/${blog.slug}`}
                className="group block overflow-hidden rounded-lg border bg-card shadow-md transition-all"
            >
                <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                        src={blog.meta.thumbnail}
                        alt={blog.meta.title}
                        height={1920}
                        width={1080}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 font-medium opacity-60 group-hover:opacity-100">
                        {blog.meta.title}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {blog.meta.authors.slice(0, 2).map((author, i) => (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar
                                                className={cn(
                                                    "size-6 rounded-full border border-border/20",
                                                    i !== 0 && "-ml-3"
                                                )}
                                            >
                                                <AvatarImage
                                                    src={author.image}
                                                    alt={author.name}
                                                />
                                                <AvatarFallback>
                                                    {author.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            {author.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}

                            {blog.meta.authors.length > 2 && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-xs text-muted-foreground">
                                                +{blog.meta.authors.length - 2}
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {blog.meta.authors
                                                .slice(2)
                                                .map((author) => author.name)
                                                .join(", ")}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {format(new Date(blog.meta.date), "MMM d, yyyy")}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
