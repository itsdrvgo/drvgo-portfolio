"use client";

import { defaultUserPFP } from "@/src/config/const";
import { Blog, User } from "@/src/lib/drizzle/schema";
import { formatDate } from "@/src/lib/utils";
import { BlogPatchData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { UploadButton } from "../../global/uploadthing";
import { Icons } from "../../icons/icons";
import { Mdx } from "../../md/mdx-comp";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
    data: Blog;
    user: User;
    author: User;
}

function BlogWriteUp({ data, user, author }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [previewEnabled, setPreviewEnable] = useState(false);
    const [blogTitle, setBlogTitle] = useState(data.title);
    const [blogContent, setBlogContent] = useState(data.content ?? "");
    const [thumbnailURL, setThumbnailURL] = useState(data.thumbnailUrl);

    const handleSave = () => {
        setIsSaving(true);

        const body: BlogPatchData = {
            thumbnailUrl: thumbnailURL,
            title: blogTitle,
            content: blogContent,
            published: data.published,
            action: "edit",
        };

        axios
            .patch<ResponseData>(`/api/blogs/${data.id}`, JSON.stringify(body))
            .then(({ data: resData }) => {
                setIsSaving(false);

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Blog has been saved",
                });

                router.push("/admin/blogs");
            })
            .catch((err) => {
                setIsSaving(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Internal Server Error, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="relative flex w-full flex-col gap-10">
            {previewEnabled ? (
                <div className="flex w-full flex-col gap-4">
                    <p className="text-2xl font-bold md:text-5xl">
                        {blogTitle}
                    </p>
                    <Separator className="w-full" />
                    <div className="flex items-center gap-3 text-xs md:text-sm">
                        <Avatar>
                            <AvatarImage
                                src={author.image ?? defaultUserPFP.src}
                                alt={author.name ?? author.id}
                            />
                            <AvatarFallback>
                                {(author.name ?? author.id)
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p>@{author.name ?? author.id}</p>
                            <p className="text-gray-400">
                                Published on {formatDate(Date.now())}
                            </p>
                        </div>
                    </div>
                    {thumbnailURL ? (
                        <Image
                            src={thumbnailURL}
                            alt="thumbnail"
                            width={2000}
                            height={2000}
                            className="h-full w-full rounded"
                        />
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
                                                {
                                                    type: "text",
                                                    value: " ",
                                                },
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
                        {blogContent}
                    </Mdx>
                    <Separator className="w-full" />
                </div>
            ) : (
                <div className="mx-auto flex w-full flex-col gap-4">
                    <Input
                        defaultValue={blogTitle}
                        placeholder="Blog Title"
                        className="h-auto rounded-sm border border-white bg-zinc-950 text-2xl font-bold md:text-5xl"
                        onChange={(e) => setBlogTitle(e.target.value)}
                    />
                    <div className="flex h-auto flex-col items-center justify-center gap-4 rounded-sm border border-white bg-zinc-950 p-5 px-3 md:flex-row md:gap-20">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <p className="text-lg font-semibold">
                                Upload Thumbnail
                            </p>
                            <UploadButton
                                endpoint="blogThumbnail"
                                onClientUploadComplete={(res) => {
                                    if (!res)
                                        return toast({
                                            title: "Oops!",
                                            description:
                                                "Error uploading your image",
                                            variant: "destructive",
                                        });

                                    setThumbnailURL(res[0].fileUrl);
                                    toast({
                                        description: "Upload complete",
                                    });
                                }}
                                onUploadError={(error: Error) => {
                                    toast({
                                        title: "Oops!",
                                        description: error.message,
                                        variant: "destructive",
                                    });
                                }}
                            />
                        </div>
                        {thumbnailURL ? (
                            <Image
                                src={thumbnailURL}
                                alt="thumbnail"
                                width={500}
                                height={500}
                                className="rounded"
                            />
                        ) : null}
                    </div>
                    <TextareaAutosize
                        autoFocus
                        defaultValue={blogContent}
                        placeholder="Type here to write your blog"
                        className="min-h-[300px] resize-none overflow-hidden rounded-sm border border-white bg-zinc-950 px-3 py-2 text-sm md:text-base"
                        onChange={(e) => setBlogContent(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                        Use general markdown syntax
                    </p>
                </div>
            )}
            <div className="flex w-full items-center justify-center gap-2">
                <Button onClick={handleSave}>
                    {isSaving ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.document className="mr-2 h-4 w-4" />
                    )}
                    <span>
                        {data.published ? "Save & Publish" : "Save as Draft"}
                    </span>
                </Button>
            </div>
            <Button
                variant={"secondary"}
                type="button"
                onClick={() => setPreviewEnable(!previewEnabled)}
                className="fixed right-0 top-[5rem] w-min rounded-r-none bg-gray-800 hover:bg-gray-900"
            >
                {isSaving ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : previewEnabled ? (
                    <Icons.view className="h-4 w-4" />
                ) : (
                    <Icons.hide className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}

export default BlogWriteUp;
