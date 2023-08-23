"use client";

import CanvasBlog from "@/public/canvas_blog_draw.jpg";
import CanvasSocialMedia from "@/public/canvas_social_media.jpg";
import CanvasCourse from "@/public/course_audio.jpeg";
import CanvasUsers from "@/public/database_users.webp";
import { DefaultProps } from "@/src/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

function AdminButtons({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <div className={className}>
            <div
                className="group relative h-52 cursor-pointer overflow-hidden rounded-lg border border-white bg-zinc-800 p-5"
                onClick={() => router.push("/admin/blogs")}
            >
                <Image
                    src={CanvasBlog}
                    alt="blog"
                    className="opacity-50 transition-all ease-in-out group-hover:opacity-30"
                    loading="lazy"
                    fill
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 font-semibold drop-shadow-xl">
                    <Icons.pencil />
                    <p>Blog Creation Tool</p>
                </div>
            </div>

            <div
                className="group relative h-52 cursor-pointer overflow-hidden rounded-lg border border-white bg-zinc-800 p-5"
                onClick={() => router.push("/admin/courses")}
            >
                <Image
                    src={CanvasCourse}
                    alt="blog"
                    className="opacity-50 transition-all ease-in-out group-hover:opacity-30"
                    loading="lazy"
                    fill
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 font-semibold drop-shadow-xl">
                    <Icons.bookopencheck />
                    <p>Course Creation Tool</p>
                </div>
            </div>

            <div
                className="group relative h-52 cursor-pointer overflow-hidden rounded-lg border border-white bg-zinc-800 p-5"
                onClick={() => router.push("/admin/users")}
            >
                <Image
                    src={CanvasUsers}
                    alt="blog"
                    className="opacity-50 transition-all ease-in-out group-hover:opacity-30"
                    loading="lazy"
                    fill
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 font-semibold drop-shadow-xl">
                    <Icons.users />
                    <p>Users Panel</p>
                </div>
            </div>

            <div
                className="group relative h-52 cursor-pointer overflow-hidden rounded-lg border border-white bg-zinc-800 p-5"
                onClick={() => router.push("/admin/autopost")}
            >
                <Image
                    src={CanvasSocialMedia}
                    alt="blog"
                    className="opacity-50 transition-all ease-in-out group-hover:opacity-30"
                    loading="lazy"
                    fill
                    style={{ objectFit: "cover" }}
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 font-semibold drop-shadow-xl">
                    <Icons.globe />
                    <p>Auto Post Tool</p>
                </div>
            </div>
        </div>
    );
}

export default AdminButtons;
