export type Notification = {
    id: string;
    userId?: string;
    title: string;
    content: string;
    notifierId: string;
    read: boolean;
    props:
        | NewBlogNotificationProps
        | BlogCommentNotificationProps
        | BlogLikeNotificationProps
        | BlogReplyNotificationProps
        | BlogCommentLoveNotificationProps
        | BlogCommentReplyLoveProps
        | BlogCommenPinProps;
    createdAt: Date;
};

export type NewBlogNotificationProps = {
    type: "newBlog";
    blogId: string;
    blogTitle: string;
    blogThumbnailUrl: string;
};

export type BlogLikeNotificationProps = {
    type: "blogLike";
    blogId: string;
    blogTitle: string;
    blogThumbnailUrl: string;
};

export type BlogCommentNotificationProps = {
    type: "blogComment";
    commentId: string;
    commentContent: string;
    blogId: string;
    blogThumbnailUrl: string;
};

export type BlogCommentLoveNotificationProps = {
    type: "blogCommentLove";
    commentId: string;
    commentContent: string;
    blogId: string;
    blogThumbnailUrl: string;
};

export type BlogReplyNotificationProps = {
    type: "blogCommentReply";
    replyId: string;
    replyContent: string;
    commentId: string;
    commentContent: string;
    blogId: string;
    blogThumbnailUrl: string;
};

export type BlogCommentReplyLoveProps = {
    type: "blogCommentReplyLove";
    replyId: string;
    replyContent: string;
    commentId: string;
    commentContent: string;
    blogId: string;
    blogThumbnailUrl: string;
};

export type BlogCommenPinProps = {
    type: "blogCommentPin";
    commentId: string;
    commentContent: string;
    blogId: string;
    blogThumbnailUrl: string;
};
