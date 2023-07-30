"use client";

import { Blog } from "@/src/lib/drizzle/schema";
import { wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { EmptyPlaceholder } from "../global/empty-placeholder";
import { GoBackButton } from "../global/go-back-button";
import { Icons } from "../icons/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import BlogItem from "./blog-item";

interface PageProps extends DefaultProps {
    blogData: Blog[];
}

const fetchBlogs = async (page: number) => {
    await wait(1000);
    const {
        data: { data },
    } = await axios.get<ResponseData>("/api/blogs");
    return (JSON.parse(data) as Blog[]).slice((page - 1) * 6, page * 6);
};

function BlogSearch({ blogData }: PageProps) {
    const [searchText, setSearchText] = useState("");
    const [matchingIds, setMatchingIds] = useState<number[]>([]);

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
                pages: [blogData.slice(0, 6)],
                pageParams: [1],
            },
        }
    );

    const handleSearch = (text: string) => {
        setSearchText(text);

        const matching = blogData
            .filter((blog) =>
                blog.title.toLowerCase().includes(text.toLowerCase())
            )
            .map((blog) => blog.id);
        setMatchingIds(matching);
    };

    return (
        <>
            <Input
                type="search"
                placeholder="Enter the Blog Title here"
                className="h-14 p-4"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <Separator />

            {searchText === "" ? (
                <>
                    {data?.pages.map((page, index) => {
                        return (
                            <div
                                key={index}
                                className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3"
                            >
                                {page.map((blog) => (
                                    <BlogItem
                                        blogData={blogData}
                                        blogId={blog.id}
                                        key={blog.id}
                                    />
                                ))}
                            </div>
                        );
                    })}
                    <div className="flex flex-col items-center justify-center gap-5">
                        {!data?.pages[data?.pages.length - 1].length && (
                            <p className="cursor-default text-sm text-red-600">
                                Nothing more to show
                            </p>
                        )}
                        {blogData.length > 6 && (
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={
                                    isFetchingNextPage ||
                                    !data?.pages[data?.pages.length - 1].length
                                }
                            >
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2">
                                        <Icons.spinner className="h-4 w-4 animate-spin" />
                                        <p>Loading</p>
                                    </div>
                                ) : (
                                    <p>Load More</p>
                                )}
                            </Button>
                        )}
                    </div>
                </>
            ) : matchingIds.length > 0 ? (
                <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                    {matchingIds.map((id) => (
                        <BlogItem blogData={blogData} blogId={id} key={id} />
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="document" />
                    <EmptyPlaceholder.Title>
                        No blogs found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        Seems like DRVGO has not posted any blogs with this
                        name.
                    </EmptyPlaceholder.Description>
                    <GoBackButton />
                </EmptyPlaceholder>
            )}
        </>
    );
}

export default BlogSearch;
