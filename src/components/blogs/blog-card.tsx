import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { Blog } from "@/src/lib/validation/blog";
import { Image, Link, LinkProps } from "@nextui-org/react";
import NextImage from "next/image";

interface BlogCardProps extends LinkProps {
    blog: Blog;
}

function BlogCard({ blog, className, ...props }: BlogCardProps) {
    const thumbnailExt = IMAGE_EXTENSIONS.find((extension) =>
        fs.existsSync(
            path.join("public", "thumbnails", blog.slug + "." + extension)
        )
    );
    if (!thumbnailExt) return null;

    const avatarPath = path.join("public", "thumbnails");

    const imageBuffer = fs.readFileSync(
        path.join(avatarPath, blog.slug + "." + thumbnailExt)
    );

    const base64Thumbnail = Buffer.from(imageBuffer).toString("base64");
    const thumbnail =
        "data:image/" + thumbnailExt + ";base64," + base64Thumbnail;

    return (
        <Link
            className={cn(
                "group relative overflow-hidden rounded-lg shadow-md",
                className
            )}
            color="foreground"
            {...props}
        >
            <Image
                src={thumbnail}
                radius="sm"
                alt={blog.meta.title}
                as={NextImage}
                height={1000}
                width={1000}
            />

            <p className="absolute bottom-0 left-0 z-10 flex size-full items-end bg-gradient-to-t from-black/80 to-transparent p-2 text-sm font-semibold transition-all ease-in-out md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                {blog.meta.title}
            </p>
        </Link>
    );
}

export default BlogCard;
