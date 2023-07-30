import { defaultUserPFP } from "@/src/config/const";
import { Comment, User } from "@/src/lib/drizzle/schema";
import { convertMstoTimeElapsed } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PageProps extends DefaultProps {
    comments: Comment[];
    users: User[];
}

function BlogViewComments({ className, comments, users }: PageProps) {
    return (
        <div className={className}>
            {comments.map((comment) => {
                const user = users.find((x) => x.id === comment.authorId);

                return (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                            <AvatarImage
                                src={user?.image ?? defaultUserPFP.src}
                                alt={user?.name ?? user?.id}
                            />
                            <AvatarFallback>
                                {(user?.name ?? user?.id!)
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-full cursor-default space-y-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm md:text-base">
                                    @{user?.name ?? user?.id}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {convertMstoTimeElapsed(
                                        comment.createdAt.getTime()
                                    )}
                                </p>
                            </div>
                            <p className="text-sm font-light">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default BlogViewComments;
