import { InferModel, relations } from "drizzle-orm";
import {
    boolean,
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
        index: int("index").autoincrement().primaryKey(),
        id: varchar("id", { length: 255 }).notNull(),
        username: varchar("username", { length: 255 }),
        email: varchar("email", { length: 255 }).notNull(),
        icon: varchar("icon", { length: 255 }),
        createdAt: timestamp("createdAt", { mode: "string" })
            .notNull()
            .defaultNow(),
        role: mysqlEnum("role", ["user", "moderator", "admin", "owner"])
            .default("user")
            .notNull(),
    },
    (table) => {
        return {
            userIdIdx: uniqueIndex("id_Idx").on(table.id),
            emailIdx: uniqueIndex("email_Idx").on(table.email),
        };
    }
);

export const blogs = mysqlTable("blogs", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 255 }),
    content: longtext("content"),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    authorId: varchar("authorId", { length: 255 }).notNull(),
    likes: int("likes").default(0).notNull(),
    views: int("views").default(0).notNull(),
    commentsCount: int("commentsCount").default(0).notNull(),
});

export const likes = mysqlTable("likes", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
});

export const comments = mysqlTable("comments", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    content: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    authorId: varchar("authorId", { length: 255 }).notNull(),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    blogs: many(blogs),
    comments: many(comments),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
    author: one(users, {
        fields: [blogs.authorId],
        references: [users.id],
    }),
    likes: many(likes),
    comments: many(comments),
}));

export const likeRelations = relations(likes, ({ one }) => ({
    blog: one(blogs, {
        fields: [likes.blogId],
        references: [blogs.id],
    }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    blog: one(blogs, {
        fields: [comments.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [comments.blogId],
        references: [users.id],
    }),
}));

// TYPES

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export type Blog = InferModel<typeof blogs>;
export type NewBlog = InferModel<typeof blogs, "insert">;

export type Like = InferModel<typeof likes>;
export type NewLike = InferModel<typeof likes, "insert">;

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, "insert">;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

export const insertBlogSchema = createInsertSchema(blogs);

export const insertLikeSchema = createInsertSchema(likes);

export const insertCommentSchema = createInsertSchema(comments);
