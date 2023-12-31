"use client";

import { Mdx } from "@/src/components/md/mdx-comp";
import { cn, convertMsIntoDays } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedProject } from "@/src/types";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { format } from "date-fns";
import { statusOptions } from "../../admin/projects/projects-table";
import ProjectOwner from "../../global/projects/project-owner";
import ProjectOperations from "./project-operations";

interface PageProps extends DefaultProps {
    project: ExtendedProject;
    isOwner: boolean;
    user: ClerkUserWithoutEmail;
}

function ProjectRead({
    className,
    project,
    isOwner,
    user,
    ...props
}: PageProps) {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col items-center gap-5",
                className
            )}
            {...props}
        >
            <div className="flex w-full flex-col gap-4">
                <p className="text-2xl font-bold md:text-5xl">{project.name}</p>

                <Divider />

                <ProjectOwner
                    ownerName={project.purchaser.username}
                    createdAt={project.createdAt}
                    image={project.purchaser.image}
                    projectStatus={project.status}
                />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Card
                        fullWidth
                        classNames={{
                            body: "text-center items-center",
                        }}
                    >
                        <CardBody>
                            <p>${project.price}</p>
                            <p className="text-gray-600">Price</p>
                        </CardBody>
                    </Card>
                    <Card
                        fullWidth
                        classNames={{
                            body: "text-center items-center",
                        }}
                    >
                        <CardBody>
                            <p>
                                {project.deadline ? (
                                    <>
                                        {format(project.deadline, "PPP")}{" "}
                                        <span className="text-gray-400">
                                            (
                                            {convertMsIntoDays(
                                                project.deadline.getTime()
                                            )}
                                            )
                                        </span>
                                    </>
                                ) : (
                                    "No deadline set"
                                )}
                            </p>
                            <p className="text-gray-600">Deadline</p>
                        </CardBody>
                    </Card>
                    <Card
                        fullWidth
                        classNames={{
                            body: "text-center items-center",
                        }}
                    >
                        <CardBody>
                            <p>
                                {statusOptions.find(
                                    (option) => option.uid === project.status
                                )?.name ?? "Unknown"}
                            </p>
                            <p className="text-gray-600">Status</p>
                        </CardBody>
                    </Card>
                </div>

                {project.rejectedReason ? (
                    <Card
                        fullWidth
                        classNames={{
                            body: "text-center items-center",
                        }}
                    >
                        <CardBody>
                            <p>
                                {project.rejectedReason.length
                                    ? project.rejectedReason
                                    : "No reason provided"}
                            </p>
                            <p className="text-gray-600">Rejection Reason</p>
                        </CardBody>
                    </Card>
                ) : null}

                <Divider />

                <Card>
                    <CardBody>{project.description}</CardBody>
                </Card>

                <Mdx>{project.requirements}</Mdx>
            </div>

            {isOwner && <ProjectOperations project={project} user={user} />}
        </div>
    );
}

export default ProjectRead;
