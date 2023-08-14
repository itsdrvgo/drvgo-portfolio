import { User } from "@/src/lib/drizzle/schema";
import { DefaultProps, ExtendedBlog } from "@/src/types";
import RecursiveComment from "./blog-recursive-comments";

interface PageProps extends DefaultProps {
    blog: ExtendedBlog;
    user: User | null;
    params: {
        blogId: string;
    };
}

function BlogViewComments({ className, user, params, blog }: PageProps) {
    const allComments = blog.comments;
    const rootComments = allComments.filter(
        (comment) => !comment.parentId && !comment.pinned
    );
    const pinnedComment = allComments.find((comment) => comment.pinned);

    return (
        <div className={className}>
            {pinnedComment && (
                <RecursiveComment
                    key={pinnedComment.id}
                    comment={pinnedComment}
                    allComments={allComments}
                    user={user}
                    params={params}
                    blog={blog}
                    isReply={false}
                    isPinned={true}
                />
            )}
            {rootComments.map((comment) => (
                <RecursiveComment
                    key={comment.id}
                    comment={comment}
                    allComments={allComments}
                    user={user}
                    params={params}
                    blog={blog}
                    isReply={false}
                    isPinned={false}
                />
            ))}
        </div>
    );
}

export default BlogViewComments;
