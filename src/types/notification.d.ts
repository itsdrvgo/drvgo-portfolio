export type Notification = {
    /** The notification ID */
    id: string;
    /** The user ID of the user who the notification is for, if omitted, the notification will be sent to everyone */
    userId?: string;
    /** The notification title */
    title: string;
    /** The notification content */
    content: string;
    /** The notifier ID */
    notifierId: string;
    /** Whether the notificattion has been read or not */
    read: boolean;
    /** The notification props */
    props:
        | NewBlogNotificationProps
        | BlogCommentNotificationProps
        | BlogLikeNotificationProps
        | BlogReplyNotificationProps
        | BlogCommentLoveNotificationProps
        | BlogCommentReplyLoveProps
        | BlogCommenPinProps
        | NewMessageProps
        | NewProjectProps;
    /** The notification creation date */
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

export type NewMessageProps = {
    type: "newMessage";
    message: string;
    senderId: string;
    senderUsername: string;
    senderImage: string;
};

export type NewProjectProps = {
    type: "newProject";
    projectId: string;
    projectTitle: string;
    purchaserId: string;
    purchaserUsername: string;
    purchaserImage: string | null;
    sellerId: string;
};
