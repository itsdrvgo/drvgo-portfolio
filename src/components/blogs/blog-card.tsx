import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { Blog } from "@/src/lib/validation/blog";
import { Avatar, Tooltip } from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { getAuthorAvatars } from "./utils";

function BlogCard({ blog }: { blog: Blog }) {
    const blogAuthors = blog.meta.authors;

    const authorAvatars = getAuthorAvatars(
        blogAuthors
            .slice(0, 2)
            .map((author) => author.name.toLowerCase().replace(" ", "-"))
    );

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
            href={"/blogs/" + blog.slug}
            className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-white/15 shadow-md"
        >
            <Image
                src={thumbnail}
                alt={blog.meta.title}
                height={1920}
                width={1080}
                className="size-full object-cover"
            />

            <div className="absolute bottom-0 left-0 flex size-full flex-col justify-end gap-2 bg-gradient-to-t from-black/80 to-transparent p-2">
                <h3 className="text-lg font-bold md:text-xl">
                    {blog.meta.title}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {authorAvatars.map((avatar, index) => (
                            <Tooltip
                                key={index}
                                content={blogAuthors[index].name}
                            >
                                <Avatar
                                    src={avatar}
                                    alt={blog.meta.title}
                                    classNames={{
                                        base: cn(
                                            index !== 0 && "-ml-3",
                                            "!size-6 border border-white/20"
                                        ),
                                    }}
                                    showFallback
                                    size="sm"
                                />
                            </Tooltip>
                        ))}

                        {blogAuthors.length > 2 && (
                            <Tooltip
                                content={blogAuthors
                                    .slice(2)
                                    .map((author) => author.name)
                                    .join(", ")}
                            >
                                <p className="text-white/60">
                                    +{blogAuthors.length - 2}
                                </p>
                            </Tooltip>
                        )}
                    </div>

                    <p className="text-sm font-light text-white/60">
                        {format(new Date(blog.meta.date), "do MMMM, yyyy")}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default BlogCard;
