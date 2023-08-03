import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { convertMstoTimeElapsed } from "@/src/lib/utils";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogCommentOperation from "./blog-comment-operation";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
    user: User | null;
    params: {
        blogId: string;
    };
}

function BlogViewComments({ className, user, params, blog }: PageProps) {
    return (
        <div className={className}>
            {blog.comments.map((comment) => {
                return (
                    <div key={comment.id} className="flex items-start gap-4">
                        <>
                            {" "}
                            <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                <AvatarImage
                                    src={
                                        comment.user.image ?? defaultUserPFP.src
                                    }
                                    alt={comment.user.name ?? comment.user.id}
                                />
                                <AvatarFallback>
                                    {(comment.user.name ?? comment.user.id)
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-full cursor-default space-y-2">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm md:text-base">
                                        @{comment.user.name ?? comment.user.id}
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
                            {user ? (
                                <BlogCommentOperation
                                    user={user}
                                    params={params}
                                    comment={comment}
                                    blog={blog}
                                />
                            ) : null}
                        </>
                    </div>
                );
            })}
        </div>
    );
}

export default BlogViewComments;
