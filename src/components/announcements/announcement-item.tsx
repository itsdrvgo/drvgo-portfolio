"use client";

import { Notification } from "@/src/lib/drizzle/schema";
import { CustomNotificationProps } from "@/src/types/notification";
import { Divider, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { Mdx } from "../md/mdx-comp";

interface PageProps {
    announcement: Notification;
}

function AnnouncementItem({ announcement }: PageProps) {
    const announcementProps = announcement.props as CustomNotificationProps;

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold">{announcementProps.title}</h1>

            <Divider />

            {announcementProps.imageUrl && (
                <>
                    <Image
                        src={announcementProps.imageUrl}
                        alt="announcement image"
                        width={2000}
                        height={2000}
                        className="h-full w-full border"
                        as={NextImage}
                        radius="sm"
                    />

                    <Divider />
                </>
            )}

            <div>
                <Mdx>{announcementProps.content}</Mdx>
            </div>
        </div>
    );
}

export default AnnouncementItem;
