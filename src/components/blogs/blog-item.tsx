import { defaultBlogThumbnail } from "@/src/config/const";
import { formatDate, shortenNumber } from "@/src/lib/utils";
import { ExtendedBlog } from "@/src/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Icons } from "../icons/icons";
import { Separator } from "../ui/separator";

interface PageProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    blogId: number;
    blogData: ExtendedBlog[];
}

function BlogItem({ blogId, blogData, ref }: PageProps) {
    const router = useRouter();

    return (
        <div
            key={blogId}
            className={
                "flex h-full flex-col items-center gap-2 overflow-hidden rounded-md border border-gray-500"
            }
            ref={ref}
        >
            <div
                className="cursor-pointer"
                onClick={() => router.push(`/blogs/${blogId}`)}
            >
                <Image
                    src={
                        blogData.find((x) => x.id === blogId)?.thumbnailUrl ??
                        defaultBlogThumbnail.src
                    }
                    alt={blogId.toString()}
                    width={500}
                    height={500}
                    className="aspect-video object-cover"
                />
                <div className="flex w-full flex-col justify-between gap-2 p-5 pb-2">
                    <p className="font-semibold">
                        {blogData.find((x) => x.id === blogId)?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(
                            blogData
                                .find((x) => x.id === blogId)
                                ?.createdAt.toDateString()!
                        )}
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid w-full cursor-default grid-cols-3 justify-items-stretch p-1 pb-3 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                    <Icons.heart
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => router.push(`/blogs/${blogId}`)}
                    />
                    {shortenNumber(
                        blogData.find((x) => x.id === blogId)?.likes.length!
                    )}
                </div>
                <button className="flex items-center justify-center gap-2">
                    <Icons.comment
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => router.push(`/blogs/${blogId}`)}
                    />
                    {shortenNumber(
                        blogData.find((x) => x.id === blogId)?.comments.length!
                    )}
                </button>
                <div className="flex items-center justify-center gap-2">
                    <Icons.analytics className="h-4 w-4" />
                    {shortenNumber(
                        blogData.find((x) => x.id === blogId)?.views.length!
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlogItem;
