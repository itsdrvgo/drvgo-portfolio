"use client";

import { cn, parseJSONToObject, wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { CachedBlog } from "@/src/types/cache";
import { Button, Divider, Input } from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import BlogItem from "./blog-item";

interface PageProps extends DefaultProps {
    blogs: CachedBlog[];
}

const fetchBlogs = async (page: number) => {
    await wait(1000);
    const {
        data: { data },
    } = await axios.get<ResponseData>("/api/blogs");
    return parseJSONToObject<CachedBlog[]>(data).slice(
        (page - 1) * 6,
        page * 6
    );
};

function BlogSearch({ blogs, className }: PageProps) {
    const [searchText, setSearchText] = useState("");
    const [matchingIds, setMatchingIds] = useState<string[]>([]);

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["blogs_query"],
        async ({ pageParam = 1 }) => {
            const response = await fetchBlogs(pageParam);
            return response;
        },
        {
            getNextPageParam: (_, pages) => {
                if (!pages[pages.length - 1].length) return undefined;
                return pages.length + 1;
            },
            initialData: {
                pages: [blogs.slice(0, 6)],
                pageParams: [1],
            },
        }
    );

    const handleSearch = (text: string) => {
        setSearchText(text);

        const matching = blogs
            .filter((blog) =>
                blog.title.toLowerCase().includes(text.toLowerCase())
            )
            .map((blog) => blog.id);
        setMatchingIds(matching);
    };

    return (
        <div className={cn("flex flex-col gap-5", className)}>
            <Input
                size="lg"
                isClearable
                radius="sm"
                variant="faded"
                classNames={{
                    inputWrapper: "border border-gray-700 bg-background",
                }}
                onClear={() => handleSearch("")}
                placeholder="Enter the Blog Title here"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <Divider />

            {searchText === "" ? (
                <>
                    {data?.pages.map((page, index) => {
                        return (
                            <div
                                key={index}
                                className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3"
                            >
                                {page.map((p) => {
                                    const blog = blogs.find(
                                        (x) => x.id === p.id
                                    );
                                    if (!blog) return null;

                                    return <BlogItem blog={blog} key={p.id} />;
                                })}
                            </div>
                        );
                    })}
                    <div className="flex flex-col items-center justify-center gap-5">
                        {!data?.pages[data?.pages.length - 1].length ? (
                            <p className="cursor-default text-sm text-red-600">
                                Nothing more to show
                            </p>
                        ) : null}
                        {blogs.length > 6 && (
                            <Button
                                onPress={() => fetchNextPage()}
                                disabled={
                                    isFetchingNextPage ||
                                    !data?.pages[data?.pages.length - 1].length
                                }
                                isLoading={isFetchingNextPage}
                                color="primary"
                            >
                                {isFetchingNextPage ? "Loading" : "Load More"}
                            </Button>
                        )}
                    </div>
                </>
            ) : matchingIds.length > 0 ? (
                <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                    {matchingIds.map((id) => {
                        const blog = blogs.find((x) => x.id === id);
                        if (!blog) return null;

                        return <BlogItem blog={blog} key={id} />;
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <EmptyPlaceholder
                        icon="document"
                        title="No blogs found"
                        description="Seems like DRVGO has not posted any blogs with this name."
                        endContent={<GoBackButton />}
                    />
                </div>
            )}
        </div>
    );
}

export default BlogSearch;
