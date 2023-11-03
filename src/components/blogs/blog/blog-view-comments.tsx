import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedComment } from "@/src/types";
import { CachedBlog, CachedRole, CachedUser } from "@/src/types/cache";
import RecursiveComment from "./blog-recursive-comments";

interface PageProps extends DefaultProps {
    blog: CachedBlog;
    comments: ExtendedComment[];
    user: ClerkUserWithoutEmail | null;
    roles: CachedRole[];
    author: CachedUser;
}

function BlogViewComments({
    className,
    user,
    blog,
    roles,
    comments,
    author,
}: PageProps) {
    const rootComments = comments.filter(
        (comment) => !comment.parentId && !comment.pinned
    );
    const pinnedComment = comments.find((comment) => comment.pinned);

    return (
        <div className={className}>
            {pinnedComment && (
                <RecursiveComment
                    key={pinnedComment.id}
                    comment={pinnedComment}
                    comments={comments}
                    user={user}
                    blog={blog}
                    isReply={false}
                    isPinned={true}
                    id={pinnedComment.id}
                    roles={roles}
                    author={author}
                />
            )}
            {rootComments.map((comment) => (
                <RecursiveComment
                    key={comment.id}
                    comment={comment}
                    comments={comments}
                    user={user}
                    blog={blog}
                    isReply={false}
                    isPinned={false}
                    id={comment.id}
                    roles={roles}
                    author={author}
                />
            ))}
        </div>
    );
}

export default BlogViewComments;
