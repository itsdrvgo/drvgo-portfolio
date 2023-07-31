import { defaultUserPFP } from "@/src/config/const";
import { Comment, User } from "@/src/lib/drizzle/schema";
import { convertMstoTimeElapsed } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogCommentOperation from "./blog-comment-operation";

interface PageProps extends DefaultProps {
    comments: Comment[];
    users: User[];
    user: User;
    params: {
        blogId: string;
    };
}

function BlogViewComments({
    className,
    comments,
    users,
    user,
    params,
}: PageProps) {
    return (
        <div className={className}>
            {comments.map((comment) => {
                const author = users.find((x) => x.id === comment.authorId);

                return (
                    <div key={comment.id} className="flex items-start gap-4">
                        {author ? (
                            <>
                                {" "}
                                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                    <AvatarImage
                                        src={author.image ?? defaultUserPFP.src}
                                        alt={author.name ?? author.id}
                                    />
                                    <AvatarFallback>
                                        {(author?.name ?? author.id)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full cursor-default space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm md:text-base">
                                            @{author.name ?? author.id}
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
                                <BlogCommentOperation
                                    user={user}
                                    params={params}
                                    author={author}
                                    comment={comment}
                                />
                            </>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

export default BlogViewComments;
