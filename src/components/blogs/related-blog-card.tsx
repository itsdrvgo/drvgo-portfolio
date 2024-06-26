import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS } from "@/config/const";
import { cn } from "@/lib/utils";
import { Blog } from "@/lib/validation/blog";
import Image from "next/image";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

interface BlogCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    blog: Blog;
}

export function RelatedBlogCard({
    blog,
    className,
    href,
    ...props
}: BlogCardProps) {
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
            href={href!}
            {...props}
        >
            <Image
                src={thumbnail}
                alt={blog.meta.title}
                height={1000}
                width={1000}
            />

            <p className="absolute bottom-0 left-0 z-10 flex size-full items-end bg-gradient-to-t from-black/80 to-transparent p-2 text-sm font-semibold text-background transition-all ease-in-out md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                {blog.meta.title}
            </p>
        </Link>
    );
}
