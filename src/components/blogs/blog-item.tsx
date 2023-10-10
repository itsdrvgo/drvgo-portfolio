import { DEFAULT_BLOG_THUMBNAIL } from "@/src/config/const";
import { formatDate, shortenNumber } from "@/src/lib/utils";
import { CachedBlog } from "@/src/types/cache";
import { Card, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Icons } from "../icons/icons";

interface PageProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    blog: CachedBlog;
}

function BlogItem({ blog, ref }: PageProps) {
    const router = useRouter();

    return (
        <div key={blog.id} ref={ref}>
            <Card
                radius="sm"
                isPressable
                className="h-full"
                onPress={() => router.push(`/blogs/${blog.id}`)}
            >
                <CardBody className="p-3">
                    <Image
                        as={NextImage}
                        radius="sm"
                        src={blog.thumbnailUrl ?? DEFAULT_BLOG_THUMBNAIL.src}
                        isZoomed
                        alt={blog.id}
                        width={500}
                        height={500}
                        className="aspect-video object-cover"
                    />
                </CardBody>

                <CardFooter className="flex flex-col items-start gap-4 px-4 text-start">
                    <div className="space-y-2">
                        <p className="font-semibold">{blog.title}</p>
                        <p className="text-sm text-gray-400">
                            {formatDate(blog.createdAt)}
                        </p>
                    </div>

                    <Divider />

                    <div className="grid w-full grid-flow-col justify-items-stretch text-sm text-gray-400">
                        <BlogStats icon="heart" count={blog.likes} />
                        <BlogStats icon="comment" count={blog.comments} />
                        <BlogStats icon="analytics" count={blog.views} />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default BlogItem;

interface BlogStats {
    icon: keyof typeof Icons;
    count: number;
}

function BlogStats({ icon, count }: BlogStats) {
    const Icon = Icons[icon];

    return (
        <div className="flex items-center justify-center gap-2">
            <Icon className="h-4 w-4 cursor-pointer" />
            {shortenNumber(count)}
        </div>
    );
}
