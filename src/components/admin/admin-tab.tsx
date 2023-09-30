"use client";

import BlogCreation from "@/public/blog_creation.jpg";
import CourseCreation from "@/public/course_creation.jpg";
import ProjectManager from "@/public/project_manager.jpg";
import UsersPanel from "@/public/users_panel.jpg";
import RoleManager from "@/public/role_manager.jpg";
import { DefaultProps } from "@/src/types";
import { Card, Image } from "@nextui-org/react";
import { StaticImageData } from "next/image";
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
        name: "Blog Manager",
        icon: "pencil",
        href: "/admin/blogs",
        image: BlogCreation,
    },
    {
        name: "Course Manager",
        icon: "bookopencheck",
        href: "/admin/courses",
        image: CourseCreation,
    },
    {
        name: "User Manager",
        icon: "users",
        href: "/admin/users",
        image: UsersPanel,
    },
    {
        name: "Project Manager",
        icon: "folder",
        href: "/admin/projects",
        image: ProjectManager,
    },
    {
        name: "Role Manager",
        icon: "dashboard",
        href: "/admin/roles",
        image: RoleManager,
    },
];

function AdminButtons({ className, ...props }: DefaultProps) {
    const router = useRouter();

    return (
        <div className={className} {...props}>
            {adminTabItems.map((item) => {
                const Icon = Icons[item.icon];

                return (
                    <Card
                        key={item.name}
                        isPressable
                        classNames={{
                            base: "h-52 border",
                        }}
                        radius="sm"
                        onPress={() => router.push(item.href)}
                    >
                        <Image
                            alt={item.name}
                            src={item.image.src}
                            className="z-0 scale-110 object-cover"
                        />
                        <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 bg-white/10 py-5 backdrop-blur-sm">
                            <Icon className="h-5 w-5" />
                            <p>{item.name}</p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

export default AdminButtons;
