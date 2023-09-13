"use client";

import { Blog, User } from "@/src/lib/drizzle/schema";
import { BlogPatchData } from "@/src/lib/validation/blogs";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import {
    Accordion,
    AccordionItem,
    Button,
    ButtonGroup,
    Image,
    Input,
    Textarea,
} from "@nextui-org/react";
import axios from "axios";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BlogAuthor from "../../blogs/blog-author";
import BlogImage from "../../blogs/blog-image";
import { UploadDropzone } from "../../global/uploadthing";
import { Icons } from "../../icons/icons";
import { Mdx } from "../../md/mdx-comp";
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
                console.error(err);

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

                    <BlogAuthor
                        authorName={author.username}
                        createdAt={data.createdAt}
                        image={author.image ?? undefined}
                    />

                    {thumbnailURL ? (
                        <BlogImage imageUrl={thumbnailURL} />
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
                    <Mdx className="prose prose-lg max-w-full text-sm text-white md:text-base">
                        {blogContent}
                    </Mdx>
                    <Separator className="w-full" />
                </div>
            ) : (
                <Accordion
                    variant="splitted"
                    selectionMode="multiple"
                    defaultExpandedKeys={[
                        "title",
                        "thumbnail",
                        "description",
                        "content",
                    ]}
                >
                    <AccordionItem key="title" title="Title" aria-label="title">
                        <Input
                            radius="sm"
                            variant="bordered"
                            defaultValue={blogTitle}
                            placeholder="Enter blog title"
                            classNames={{
                                inputWrapper: "bg-background",
                            }}
                            onValueChange={(value) => setBlogTitle(value)}
                        />
                    </AccordionItem>

                    <AccordionItem
                        key="thumbnail"
                        title="Thumbnail"
                        aria-label="thumbnail"
                    >
                        <UploadDropzone
                            endpoint="blogThumbnail"
                            appearance={{
                                label: "text-xl font-semibold",
                                allowedContent: "text-base",
                                uploadIcon: "text-accent-foreground",
                                container({ isDragActive }) {
                                    return `min-h-[250px] ${
                                        isDragActive
                                            ? "bg-sky-900"
                                            : "bg-background"
                                    } rounded-md border-gray-500 overflow-hidden`;
                                },
                            }}
                            content={{
                                label({ isUploading, ready }) {
                                    return isUploading
                                        ? "Uploading..."
                                        : ready
                                        ? "Drop your thumbnail here"
                                        : "Please wait...";
                                },
                                uploadIcon() {
                                    return (
                                        thumbnailURL && (
                                            <Image
                                                as={NextImage}
                                                radius="sm"
                                                src={thumbnailURL}
                                                alt="thumbnail"
                                                width={2000}
                                                height={2000}
                                                className="rounded"
                                            />
                                        )
                                    );
                                },
                                button({ ready, isUploading }) {
                                    return (
                                        <Button>
                                            {isUploading
                                                ? "Uploading..."
                                                : ready
                                                ? thumbnailURL
                                                    ? "Change Thumbnail"
                                                    : "Upload Thumbnail"
                                                : "Loading..."}
                                        </Button>
                                    );
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
                    </AccordionItem>

                    <AccordionItem
                        key="description"
                        title="Description"
                        aria-label="description"
                    >
                        <Textarea
                            radius="sm"
                            variant="bordered"
                            minRows={3}
                            defaultValue={blogDescription}
                            maxLength={150}
                            minLength={3}
                            placeholder="Enter the blog description in short"
                            onValueChange={(value) => setBlogDescription(value)}
                            classNames={{
                                inputWrapper: "bg-background",
                            }}
                        />
                    </AccordionItem>

                    <AccordionItem
                        key="content"
                        title="Content"
                        aria-label="content"
                    >
                        <Textarea
                            radius="sm"
                            variant="bordered"
                            minRows={10}
                            maxRows={400}
                            defaultValue={blogContent}
                            placeholder="Enter the blog content"
                            onValueChange={(value) => setBlogContent(value)}
                            classNames={{
                                inputWrapper: "bg-background",
                            }}
                        />
                    </AccordionItem>
                </Accordion>
            )}

            <ButtonGroup className="sticky bottom-10 z-50">
                <Button
                    onPress={handleSave}
                    className="border border-r-0 border-gray-500 bg-white/30 backdrop-blur-sm"
                    startContent={
                        !isSaving && <Icons.document className="h-4 w-4" />
                    }
                    isLoading={isSaving}
                >
                    {data.published ? "Save & Publish" : "Save as Draft"}
                </Button>

                <Button
                    onPress={() => setPreviewEnable(!previewEnabled)}
                    className="border border-gray-500 bg-white/30 backdrop-blur-sm"
                    startContent={
                        previewEnabled ? (
                            <Icons.hide className="h-4 w-4" />
                        ) : (
                            <Icons.view className="h-4 w-4" />
                        )
                    }
                >
                    {previewEnabled ? "Hide Preview" : "Show Preview"}
                </Button>
            </ButtonGroup>
        </div>
    );
}

export default BlogWriteUp;
