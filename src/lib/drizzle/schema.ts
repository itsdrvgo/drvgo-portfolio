import { InferModel, relations } from "drizzle-orm";
import {
    boolean,
    int,
    longtext,
    mysqlEnum,
    mysqlTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { AdapterAccount } from "next-auth/adapters";

// SCHEMAS

export const users = mysqlTable(
    "users",
    {
        id: varchar("id", { length: 255 }).notNull().primaryKey(),
        name: varchar("name", { length: 255 }),
        email: varchar("email", { length: 255 }).notNull(),
        emailVerified: timestamp("emailVerified", {
            mode: "date",
        }).defaultNow(),
        image: varchar("icon", { length: 255 }),
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

export const accounts = mysqlTable(
    "accounts",
    {
        userId: varchar("userId", { length: 255 }).notNull(),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", {
            length: 255,
        }).notNull(),
        refresh_token: varchar("refresh_token", { length: 255 }),
        access_token: varchar("access_token", { length: 255 }),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: longtext("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId),
    })
);

export const sessions = mysqlTable("sessions", {
    sessionToken: varchar("sessionToken", { length: 255 })
        .notNull()
        .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    })
);

export const images = mysqlTable("images", {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    uploaderId: varchar("uploaderId", { length: 255 }).notNull(),
});

export const blogs = mysqlTable("blogs", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    thumbnailUrl: varchar("thumbnailUrl", { length: 255 }),
    content: longtext("content"),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    authorId: varchar("authorId", { length: 255 }).notNull(),
});

export const views = mysqlTable("views", {
    id: int("id").autoincrement().primaryKey(),
    blogId: int("blogId").notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
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
    views: many(views),
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
    user: one(users, {
        fields: [views.userId],
        references: [users.id],
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

export const commentsRelations = relations(comments, ({ one }) => ({
    blog: one(blogs, {
        fields: [comments.blogId],
        references: [blogs.id],
    }),
    user: one(users, {
        fields: [comments.authorId],
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

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

export const insertBlogSchema = createInsertSchema(blogs);

export const insertViewSchema = createInsertSchema(views);

export const insertLikeSchema = createInsertSchema(likes);

export const insertCommentSchema = createInsertSchema(comments);
