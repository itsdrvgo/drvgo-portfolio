"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { Project } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Avatar, Chip } from "@nextui-org/react";
import {
    statusColorMap,
    statusOptions,
} from "../../admin/projects/projects-table";

interface PageProps extends DefaultProps {
    image?: string | null;
    ownerName: string;
    createdAt: Date;
    projectStatus: Project["status"];
}

function ProjectOwner({
    className,
    image,
    ownerName,
    createdAt,
    projectStatus,
    ...props
}: PageProps) {
    return (
        <div className={cn("flex items-center gap-4", className)} {...props}>
            <Avatar
                isBordered
                showFallback
                as="span"
                size="md"
                src={image || DEFAULT_USER_IMAGE.src}
            />
            <div className="space-y-1">
                <div className="flex gap-2">
                    <p>@{ownerName}</p>
                    <Chip
                        className="capitalize"
                        color={statusColorMap[projectStatus]}
                        size="sm"
                        variant="flat"
                    >
                        {statusOptions.find((x) => x.uid === projectStatus)
                            ?.name ?? "Unknown"}
                    </Chip>
                </div>

                <div className="flex gap-1 text-sm text-gray-600">
                    <p>Requested on {formatDate(createdAt.getTime())}</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectOwner;
