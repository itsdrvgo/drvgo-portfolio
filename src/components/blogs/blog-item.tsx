import { defaultBlogThumbnail } from "@/src/config/const";
import { formatDate, shortenNumber } from "@/src/lib/utils";
import { ExtendedBlog } from "@/src/types";
import { Card, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Icons } from "../icons/icons";

interface PageProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    blogId: string;
    blogData: ExtendedBlog[];
}

function BlogItem({ blogId, blogData, ref }: PageProps) {
    const router = useRouter();

    return (
        <div key={blogId} ref={ref}>
            <Card
                radius="sm"
                isPressable
                className="h-full"
                onPress={() => router.push(`/blogs/${blogId}`)}
            >
                <CardBody className="p-3">
                    <Image
                        as={NextImage}
                        radius="sm"
                        src={
                            blogData.find((x) => x.id === blogId)
                                ?.thumbnailUrl ?? defaultBlogThumbnail.src
                        }
                        isZoomed
                        alt={blogId.toString()}
                        width={500}
                        height={500}
                        className="aspect-video object-cover"
                    />
                </CardBody>

                <CardFooter className="flex flex-col items-start gap-4 px-4 text-start">
                    <div className="space-y-2">
                        <p className="font-semibold">
                            {blogData.find((x) => x.id === blogId)?.title}
                        </p>
                        <p className="text-sm text-gray-400">
                            {formatDate(
                                blogData
                                    .find((x) => x.id === blogId)
                                    ?.createdAt.getTime()!
                            )}
                        </p>
                    </div>

                    <Divider />

                    <div className="grid w-full grid-cols-3 justify-items-stretch text-sm text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                            <Icons.heart className="h-4 w-4 cursor-pointer" />
                            {shortenNumber(
                                blogData.find((x) => x.id === blogId)?.likes
                                    .length!
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Icons.comment className="h-4 w-4 cursor-pointer" />
                            {shortenNumber(
                                blogData.find((x) => x.id === blogId)?.comments
                                    .length!
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Icons.analytics className="h-4 w-4" />
                            {shortenNumber(
                                blogData.find((x) => x.id === blogId)?.views
                                    .length!
                            )}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default BlogItem;
