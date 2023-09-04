"use client";

import CanvasBlog from "@/public/canvas_blog_draw.jpg";
import CanvasSocialMedia from "@/public/canvas_social_media.jpg";
import CanvasCourse from "@/public/course_audio.jpeg";
import CanvasUsers from "@/public/database_users.webp";
import { DefaultProps } from "@/src/types";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";

interface AdminTabItem {
    name: string;
    icon: keyof typeof Icons;
    href: string;
    image: StaticImageData;
}

const adminTabItems: AdminTabItem[] = [
    {
        name: "Blog Creation Tool",
        icon: "pencil",
        href: "/admin/blogs",
        image: CanvasBlog,
    },
    {
        name: "Course Creation Tool",
        icon: "bookopencheck",
        href: "/admin/courses",
        image: CanvasCourse,
    },
    {
        name: "Users Panel",
        icon: "users",
        href: "/admin/users",
        image: CanvasUsers,
    },
    {
        name: "Patch Note Creation Tool",
        icon: "bookopencheck",
        href: "/admin/patches",
        image: CanvasSocialMedia,
    },
];

function AdminButtons({ className }: DefaultProps) {
    const router = useRouter();

    return (
        <div className={className}>
            {adminTabItems.map((item) => {
                const Icon = Icons[item.icon];

                return (
                    <div
                        key={item.name}
                        className="group relative h-52 cursor-pointer overflow-hidden rounded-lg border border-white bg-zinc-800 p-5"
                        onClick={() => router.push(item.href)}
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            className="opacity-30 transition-all ease-in-out group-hover:opacity-20"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 font-semibold drop-shadow-xl">
                            <Icon />
                            <p>{item.name}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AdminButtons;
