"use client";

import { defaultUserPFP } from "@/src/config/const";
import { Blog, User } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { BlogPatchData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { UploadButton, UploadDropzone } from "../../global/uploadthing";
import { Icons } from "../../icons/icons";
import { Mdx } from "../../md/mdx-comp";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    params: {
        blogId: string;
    };
    data: Blog;
    author: User;
}

function BlogWriteUp({ data, author }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [previewEnabled, setPreviewEnable] = useState(false);
    const [blogTitle, setBlogTitle] = useState(data.title);
    const [blogContent, setBlogContent] = useState(data.content ?? "");
    const [blogDescription, setBlogDescription] = useState(
        data.description ?? ""
    );
    const [thumbnailURL, setThumbnailURL] = useState(data.thumbnailUrl);

    const [showTitle, setShowTitle] = useState(false);
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const handleSave = () => {
        setIsSaving(true);

        const body: BlogPatchData = {
            thumbnailUrl: thumbnailURL,
            title: blogTitle,
            content: blogContent,
            published: data.published,
            description: blogDescription,
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
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="relative flex w-full flex-col items-center gap-10">
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
                                alt={author.username}
                            />
                            <AvatarFallback>
                                {author.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p>@{author.username}</p>
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
                    {blogContent.split("\n").length! > 1 ? (
                        <div className="flex cursor-default flex-col gap-4 rounded-md border border-gray-400 bg-stone-950 p-5">
                            <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                                Table of Contents
                            </p>

                            <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                                {blogContent.split("\n").map((x, index) => {
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
                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showTitle },
                            { "gap-0": !showTitle }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowTitle(!showTitle)}
                        >
                            <p className="text-2xl font-bold">Title</p>
                            <Icons.chevronDown
                                className={cn(
                                    "transition-all ease-in-out",
                                    showTitle ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showTitle },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showTitle,
                                }
                            )}
                        >
                            <Separator />
                            <Input
                                defaultValue={blogTitle}
                                placeholder="Enter blog title"
                                className="h-auto text-xl font-bold"
                                onChange={(e) => setBlogTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showThumbnail },
                            { "gap-0": !showThumbnail }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowThumbnail(!showThumbnail)}
                        >
                            <p className="text-2xl font-bold">Thumbnail</p>
                            <Icons.chevronDown
                                className={cn(
                                    "transition-all ease-in-out",
                                    showThumbnail ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showThumbnail },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showThumbnail,
                                }
                            )}
                        >
                            <Separator />
                            {thumbnailURL ? (
                                <div className="flex flex-col items-center gap-5">
                                    <Image
                                        src={thumbnailURL}
                                        alt="thumbnail"
                                        width={2000}
                                        height={2000}
                                        className="rounded"
                                    />
                                    <UploadButton
                                        endpoint="blogThumbnail"
                                        appearance={{
                                            button: "ut-ready:bg-gray-950 bg-gray-900 text-secondary-foreground border border-gray-700 font-semibold",
                                            allowedContent: "text-gray-400",
                                        }}
                                        content={{
                                            button({ ready, isUploading }) {
                                                return isUploading
                                                    ? "Uploading..."
                                                    : ready
                                                    ? "Change Thumbnail"
                                                    : "Loading...";
                                            },
                                        }}
                                        onClientUploadComplete={(res) => {
                                            if (!res)
                                                return toast({
                                                    title: "Oops!",
                                                    description:
                                                        "Error uploading your image",
                                                    variant: "destructive",
                                                });

                                            setThumbnailURL(res[0].url);
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
                            ) : (
                                <UploadDropzone
                                    endpoint="blogThumbnail"
                                    appearance={{
                                        label: "text-xl font-semibold",
                                        allowedContent: "text-base",
                                        container:
                                            "bg-background min-h-[300px]",
                                        uploadIcon: "text-accent-foreground",
                                        button: "ut-ready:bg-blue-800 ut-uploading:cursor-not-allowed bg-red-500",
                                    }}
                                    content={{
                                        label({
                                            isDragActive,
                                            isUploading,
                                            ready,
                                        }) {
                                            return isUploading
                                                ? "Uploading..."
                                                : ready
                                                ? "Drop your thumbnail here"
                                                : isDragActive
                                                ? "Drop your thumbnail here"
                                                : "Drag and drop your thumbnail here";
                                        },
                                    }}
                                    onClientUploadComplete={(res) => {
                                        if (!res)
                                            return toast({
                                                title: "Oops!",
                                                description:
                                                    "Error uploading your image",
                                                variant: "destructive",
                                            });

                                        setThumbnailURL(res[0].url);
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
                            )}
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showDescription },
                            { "gap-0": !showDescription }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            <p className="text-2xl font-bold">Description</p>
                            <Icons.chevronDown
                                className={cn(
                                    "transition-all ease-in-out",
                                    showDescription ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showDescription },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showDescription,
                                }
                            )}
                        >
                            <Separator />
                            <TextareaAutosize
                                defaultValue={blogDescription}
                                maxLength={150}
                                minLength={3}
                                placeholder="Enter the blog description in short"
                                className="min-h-[100px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-base"
                                onChange={(e) =>
                                    setBlogDescription(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showContent },
                            { "gap-0": !showContent }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowContent(!showContent)}
                        >
                            <p className="text-2xl font-bold">Content</p>
                            <Icons.chevronDown
                                className={cn(
                                    "transition-all ease-in-out",
                                    showContent ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showContent },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showContent,
                                }
                            )}
                        >
                            <Separator />
                            <TextareaAutosize
                                autoFocus
                                defaultValue={blogContent}
                                placeholder="Enter the blog content"
                                className="min-h-[300px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-base"
                                onChange={(e) => setBlogContent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="sticky bottom-10 flex w-auto items-center justify-center gap-3 rounded-full border border-gray-600 bg-card p-5 py-3">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.document className="h-4 w-4" />
                    )}
                    <span>
                        {data.published ? "Save & Publish" : "Save as Draft"}
                    </span>
                </button>

                <Separator orientation="vertical" className="h-5 bg-gray-600" />

                <button
                    type="button"
                    onClick={() => setPreviewEnable(!previewEnabled)}
                    className="flex items-center gap-2 text-sm"
                >
                    {isSaving ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : previewEnabled ? (
                        <Icons.view className="h-4 w-4" />
                    ) : (
                        <Icons.hide className="h-4 w-4" />
                    )}
                    <span>
                        {previewEnabled ? "Hide Preview" : "Show Preview"}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default BlogWriteUp;
