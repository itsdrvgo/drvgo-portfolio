"use client";

import Pattern1 from "@/public/patterns/1.png";
import Pattern2 from "@/public/patterns/2.png";
import Pattern3 from "@/public/patterns/3.png";
import Pattern4 from "@/public/patterns/4.png";
import Pattern5 from "@/public/patterns/5.png";
import Pattern6 from "@/public/patterns/6.png";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
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
        image: Pattern1,
    },
    {
        name: "Announcement Manager",
        icon: "flag",
        href: "/admin/announcements",
        image: Pattern2,
    },
    {
        name: "User Manager",
        icon: "users",
        href: "/admin/users",
        image: Pattern3,
    },
    {
        name: "Project Manager",
        icon: "folder",
        href: "/admin/projects",
        image: Pattern4,
    },
    {
        name: "Role Manager",
        icon: "dashboard",
        href: "/admin/roles",
        image: Pattern5,
    },
    {
        name: "Cache Manager",
        icon: "globe",
        href: "/admin/cache",
        image: Pattern6,
    },
];

function AdminButtons({ className, ...props }: DefaultProps) {
    const router = useRouter();

    return (
        <div
            className={cn(
                "grid w-full grid-cols-2 items-center justify-items-stretch gap-5 text-center md:grid-cols-3 md:gap-10",
                className
            )}
            {...props}
        >
            {adminTabItems.map((item) => {
                const Icon = Icons[item.icon];

                return (
                    <Card
                        shadow="sm"
                        key={item.name}
                        className="h-full"
                        isPressable
                        onPress={() => router.push(item.href)}
                    >
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="none"
                                width="100%"
                                alt={item.name}
                                className="h-[140px] w-full object-cover"
                                src={item.image.src}
                            />
                        </CardBody>

                        <CardFooter className="h-full justify-center text-small md:justify-start">
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <p className="font-semibold">{item.name}</p>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

export default AdminButtons;
