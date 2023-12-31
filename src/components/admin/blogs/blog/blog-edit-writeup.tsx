"use client";

import { handleBlogUpdate } from "@/src/actions/blogs";
import UploadZone from "@/src/components/ui/uploadzone";
import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, handleClientError } from "@/src/lib/utils";
import { blogUpdateSchema } from "@/src/lib/validation/blogs";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import {
    Accordion,
    AccordionItem,
    Button,
    ButtonGroup,
    Divider,
    Image,
    Input,
    Link,
    Textarea,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import BlogAuthor from "../../../global/blogs/blog-author";
import BlogImage from "../../../global/blogs/blog-image";
import { useUploadThing } from "../../../global/uploadthing";
import { Icons } from "../../../icons/icons";
import { Mdx } from "../../../md/mdx-comp";

interface PageProps extends DefaultProps {
    blog: CachedBlog;
    author: CachedUser;
    roles: CachedRole[];
    user: ClerkUserWithoutEmail;
}

function BlogWriteUp({
    blog,
    roles,
    author,
    user,
    className,
    ...props
}: PageProps) {
    const [previewEnabled, setPreviewEnable] = useState(false);
    const [blogTitle, setBlogTitle] = useState(blog.title);
    const [blogContent, setBlogContent] = useState(blog.content ?? "");
    const [blogDescription, setBlogDescription] = useState(
        blog.description ?? ""
    );
    const [thumbnailURL, setThumbnailURL] = useState<string | null>(
        blog.thumbnailUrl
    );

    const [uploadProgress, setUploadProgress] = useState(0);

    const { mutate: editAndSaveBlog, isLoading: isSaving } = useMutation({
        onMutate() {
            const toastId = toast.loading("Saving blog...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            if (blog.authorId !== user.id)
                throw new Error("You are not the author of this blog!");

            blogUpdateSchema.parse({
                title: blogTitle,
                description: blogDescription,
                content: blogContent,
                thumbnailUrl: thumbnailURL,
            });

            await handleBlogUpdate({
                blog,
                props: {
                    content: blogContent,
                    description: blogDescription,
                    title: blogTitle,
                    thumbnailUrl: thumbnailURL,
                },
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Blog saved successfully!", {
                id: ctx?.toastId,
            });
        },
        onError(err, __, ctx) {
            handleClientError(err, ctx?.toastId);
        },
    });

    const authorRolesRaw = author.roles.map((x) => {
        const role = roles.find((r) => r.key === x);
        if (!role) return null;
        return role;
    });

    const authorHighestRole = authorRolesRaw.reduce((prev, curr) => {
        if (!prev) return curr;
        if (!curr) return prev;
        return prev.position > curr.position ? curr : prev;
    }, null);

    const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
        "blogThumbnail",
        {
            onUploadBegin: () => {
                return toast.success(
                    "Uploading image, this may take a while..."
                );
            },
            onUploadProgress: (p) => {
                setUploadProgress(p);
            },
            onUploadError: (err) => {
                console.error(err);
                return toast.error(err.message);
            },
            onClientUploadComplete: (res) => {
                if (!res) return toast.error("Something went wrong!");
                const upload = res[0];

                const { url } = upload;
                setThumbnailURL(url);
                return toast.success("Image uploaded");
            },
        }
    );

    const fileTypes = permittedFileInfo?.config
        ? Object.keys(permittedFileInfo?.config)
        : [];

    return (
        <div
            className={cn(
                "relative flex w-full flex-col items-center gap-10",
                className
            )}
            {...props}
        >
            {previewEnabled ? (
                <div className="flex w-full flex-col gap-4">
                    <p className="text-2xl font-bold md:text-5xl">
                        {blogTitle}
                    </p>

                    <Divider />

                    <BlogAuthor
                        authorName={author.username}
                        createdAt={blog.createdAt}
                        image={author.image ?? DEFAULT_USER_IMAGE.src}
                        authorRole={authorHighestRole}
                    />

                    {thumbnailURL ? <BlogImage src={thumbnailURL} /> : null}

                    {blogContent.split("\n").length! > 1 ? (
                        <div className="flex cursor-default flex-col gap-4 rounded-lg border border-gray-400 bg-stone-950 p-5">
                            <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                                Table of Contents
                            </p>

                            <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                                {blogContent.split("\n").map((x, index) => {
                                    if (x.startsWith("## ")) {
                                        return (
                                            <li key={index}>
                                                <Link
                                                    as={NextLink}
                                                    color="foreground"
                                                    href={`#${x
                                                        .replace("## ", "")
                                                        .replace(/:$/, "")
                                                        .toLowerCase()
                                                        .replace(/\s/g, "-")}`}
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
                                                    as={NextLink}
                                                    color="foreground"
                                                    className="opacity-80"
                                                    href={`#${x
                                                        .replace("### ", "")
                                                        .replace(/:$/, "")
                                                        .toLowerCase()
                                                        .replace(/\s/g, "-")}`}
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

                    <Mdx>{blogContent}</Mdx>

                    <Divider />
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
                            defaultValue={blogTitle}
                            placeholder="Enter blog title"
                            classNames={{
                                inputWrapper:
                                    "border border-gray-700 bg-background",
                            }}
                            onValueChange={setBlogTitle}
                        />
                    </AccordionItem>

                    <AccordionItem
                        key="thumbnail"
                        title="Thumbnail"
                        aria-label="thumbnail"
                    >
                        <UploadZone
                            isUploading={isUploading}
                            fileTypes={fileTypes}
                            maxFiles={
                                permittedFileInfo?.config.image?.maxFileCount
                            }
                            maxFileSize={
                                permittedFileInfo?.config.image?.maxFileSize
                            }
                            isDisabled={isSaving}
                            uploadProgress={uploadProgress}
                            onDrop={(acceptedFiles) =>
                                startUpload(acceptedFiles)
                            }
                            content={
                                thumbnailURL ? (
                                    <Image
                                        src={thumbnailURL}
                                        alt="Blog thumbnail"
                                        classNames={{
                                            wrapper: "border",
                                        }}
                                        radius="sm"
                                        as={NextImage}
                                        className="h-full w-full"
                                        width={1000}
                                        height={1000}
                                    />
                                ) : null
                            }
                        />
                    </AccordionItem>

                    <AccordionItem
                        key="description"
                        title="Description"
                        aria-label="description"
                    >
                        <Textarea
                            radius="sm"
                            minRows={3}
                            aria-label="description"
                            defaultValue={blogDescription}
                            maxLength={150}
                            minLength={3}
                            placeholder="Enter the blog description in short"
                            onValueChange={setBlogDescription}
                            classNames={{
                                inputWrapper:
                                    "border border-gray-700 bg-background",
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
                            minRows={10}
                            aria-label="content"
                            maxRows={400}
                            defaultValue={blogContent}
                            placeholder="Enter the blog content"
                            onValueChange={setBlogContent}
                            classNames={{
                                inputWrapper:
                                    "border border-gray-700 bg-background",
                            }}
                        />
                    </AccordionItem>
                </Accordion>
            )}

            <ButtonGroup className="sticky bottom-10 z-50" variant="flat">
                <Button
                    onPress={() => editAndSaveBlog()}
                    className="bg-default-100 first:rounded-s-full"
                    startContent={
                        !isSaving && <Icons.document className="h-4 w-4" />
                    }
                    isLoading={isSaving}
                >
                    {blog.published ? "Save & Publish" : "Save as Draft"}
                </Button>

                <Button
                    onPress={() => setPreviewEnable(!previewEnabled)}
                    className="bg-default-100 last:rounded-e-full"
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
