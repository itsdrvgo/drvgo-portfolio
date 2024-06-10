import fs from "fs";
import path from "path";
import { IMAGE_EXTENSIONS } from "@/config/const";
import { cn } from "@/lib/utils";
import { Blog } from "@/lib/validation/blog";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { getAuthorAvatars } from "./utils";

interface BlogCardProps {
    blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
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
            className="group relative aspect-[3/2] overflow-hidden rounded-lg shadow-md"
        >
            <Image
                src={thumbnail}
                alt={blog.meta.title}
                height={1920}
                width={1080}
                className="size-full object-cover"
            />

            <div className="absolute bottom-0 left-0 flex size-full flex-col justify-end gap-2 bg-gradient-to-t from-black/80 to-transparent p-2">
                <h3 className="font-medium text-background">
                    {blog.meta.title}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {authorAvatars.map((avatar, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar
                                            className={cn(
                                                "size-6 rounded-full border border-border/20",
                                                index !== 0 && "-ml-3"
                                            )}
                                        >
                                            <AvatarImage
                                                src={avatar}
                                                alt={blog.meta.title}
                                            />
                                            <AvatarFallback>
                                                {blogAuthors[
                                                    index
                                                ].name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        {blogAuthors[index].name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}

                        {blogAuthors.length > 2 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-muted-foreground">
                                            +{blogAuthors.length - 2}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {blogAuthors
                                            .slice(2)
                                            .map((author) => author.name)
                                            .join(", ")}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <p className="text-sm font-light text-muted-foreground">
                        {format(new Date(blog.meta.date), "do MMMM, yyyy")}
                    </p>
                </div>
            </div>
        </Link>
    );
}
