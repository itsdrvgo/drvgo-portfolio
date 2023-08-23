import { InferModel, relations, sql } from "drizzle-orm";
import {
    boolean,
    index,
    int,
    longtext,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

// SCHEMAS

export const users = mysqlTable(
    "users",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        username: varchar("username", { length: 191 }).unique().notNull(),
        email: varchar("email", { length: 191 }).notNull().unique(),
        image: varchar("image", { length: 191 }),
        createdAt: timestamp("created_at")
            .notNull()
            .default(sql`current_timestamp()`),
        updatedAt: timestamp("updated_at")
            .notNull()
            .default(sql`current_timestamp()`)
            .onUpdateNow(),
        role: mysqlEnum("role", [
            "user",
            "guest",
            "moderator",
            "admin",
            "owner",
        ])
            .default("user")
            .notNull(),
    },
    (user) => ({
        emailIndex: uniqueIndex("email_idx").on(user.email),
        usernameIndex: uniqueIndex("name_idx").on(user.username),
    })
);

export const images = mysqlTable(
    "images",
    {
        key: varchar("key", { length: 191 }).notNull().primaryKey(),
        url: varchar("url", { length: 191 }).notNull(),
        uploaderId: varchar("uploaderId", { length: 191 }).notNull(),
        createdAt: timestamp("created_at")
            .default(sql`current_timestamp()`)
            .notNull(),
        type: mysqlEnum("type", ["avatar", "blog", "other"]),
    },
    (image) => ({
        uploaderIdIndex: uniqueIndex("uploader_id_idx").on(image.uploaderId),
    })
);

export const blogs = mysqlTable("blogs", {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    title: varchar("title", { length: 191 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 191 }),
    description: varchar("description", { length: 150 }).notNull(),
    content: longtext("content"),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at")
        .default(sql`current_timestamp()`)
        .notNull(),
    updatedAt: timestamp("updated_at"),
    authorId: varchar("authorId", { length: 191 }).notNull(),
});

export const views = mysqlTable("views", {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    blogId: varchar("blogId", { length: 191 }).notNull(),
});

export const likes = mysqlTable("likes", {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    blogId: varchar("blogId", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
});

export const comments = mysqlTable(
    "comments",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        parentId: varchar("parentId", { length: 191 }),
        blogId: varchar("blogId", { length: 191 }).notNull(),
        content: text("text").notNull(),
        createdAt: timestamp("created_at")
            .default(sql`current_timestamp()`)
            .notNull(),
        authorId: varchar("authorId", { length: 191 }).notNull(),
        pinned: boolean("pinned").default(false).notNull(),
        edited: boolean("edited").default(false).notNull(),
    },
    (comment) => ({
        blogIdIndex: index("blog_id_idx").on(comment.blogId),
    })
);

export const commentLoves = mysqlTable("comment_loves", {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    commentId: varchar("commentId", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    likes: many(likes),
    blogs: many(blogs),
    comments: many(comments),
    images: many(images),
}));

export const imageRelations = relations(images, ({ one }) => ({
    user: one(users, {
        fields: [images.uploaderId],
        references: [users.id],
    }),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
    author: one(users, {
        fields: [blogs.authorId],
        references: [users.id],
    }),
    likes: many(likes),
    comments: many(comments),
    views: many(views),
}));

export const viewRelations = relations(views, ({ one }) => ({
    blog: one(blogs, {
        fields: [views.blogId],
        references: [blogs.id],
    }),
}));

export const likeRelations = relations(likes, ({ one }) => ({
    blog: one(blogs, {
        fields: [likes.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    blog: one(blogs, {
        fields: [comments.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
    loves: many(commentLoves),
}));

export const commentLovesRelations = relations(commentLoves, ({ one }) => ({
    comment: one(comments, {
        fields: [commentLoves.commentId],
        references: [comments.id],
    }),
    user: one(users, {
        fields: [commentLoves.userId],
        references: [users.id],
    }),
}));

// TYPES

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Blog = InferModel<typeof blogs>;
export type NewBlog = InferModel<typeof blogs, "insert">;

export type View = InferModel<typeof views>;
export type NewView = InferModel<typeof views, "insert">;

export type Like = InferModel<typeof likes>;
export type NewLike = InferModel<typeof likes, "insert">;

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, "insert">;

export type CommentLove = InferModel<typeof commentLoves>;
export type NewCommentLove = InferModel<typeof commentLoves, "insert">;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

export const insertBlogSchema = createInsertSchema(blogs);

export const insertViewSchema = createInsertSchema(views);

export const insertLikeSchema = createInsertSchema(likes);

export const insertCommentSchema = createInsertSchema(comments);

export const insertCommentLoveSchema = createInsertSchema(commentLoves);
