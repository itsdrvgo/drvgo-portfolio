CREATE TABLE `blogs` (
	`id` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`thumbnailUrl` varchar(191),
	`description` varchar(150) NOT NULL,
	`content` longtext,
	`published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`updated_at` timestamp,
	`authorId` varchar(191) NOT NULL,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comment_loves` (
	`id` varchar(191) NOT NULL,
	`commentId` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `comment_loves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(191) NOT NULL,
	`parentId` varchar(191),
	`blogId` varchar(191) NOT NULL,
	`text` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`authorId` varchar(191) NOT NULL,
	`pinned` boolean NOT NULL DEFAULT false,
	`edited` boolean NOT NULL DEFAULT false,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`key` varchar(191) NOT NULL,
	`url` varchar(191) NOT NULL,
	`uploaderId` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`type` enum('avatar','blog','other'),
	CONSTRAINT `images_key` PRIMARY KEY(`key`),
	CONSTRAINT `uploader_id_idx` UNIQUE(`uploaderId`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` varchar(191) NOT NULL,
	`blogId` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`image` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
	`role` enum('user','guest','moderator','admin','owner') NOT NULL DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`),
	CONSTRAINT `name_idx` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `views` (
	`id` varchar(191) NOT NULL,
	`blogId` varchar(191) NOT NULL,
	CONSTRAINT `views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `blog_id_idx` ON `comments` (`blogId`);