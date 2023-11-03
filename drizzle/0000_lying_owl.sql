CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`roles` json NOT NULL DEFAULT ('["user"]'),
	`strikes` int NOT NULL DEFAULT 0,
	`permissions` int NOT NULL DEFAULT 1,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `birthday_participants_2023` (
	`id` varchar(191) NOT NULL,
	`isParticipating` boolean NOT NULL DEFAULT false,
	CONSTRAINT `birthday_participants_2023_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `chats` (
	`id` varchar(191) NOT NULL,
	`senderId` varchar(191) NOT NULL,
	`receiverId` varchar(191) NOT NULL,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
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
CREATE TABLE `messages` (
	`id` varchar(191) NOT NULL,
	`chatId` varchar(191) NOT NULL,
	`senderId` varchar(191) NOT NULL,
	`receiverId` varchar(191) NOT NULL,
	`status` varchar(191) NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT current_timestamp(),
	`seenAt` timestamp,
	`editedAt` timestamp,
	`text` longtext NOT NULL,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`notifierId` varchar(191) NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`props` json NOT NULL,
	`type` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(500) NOT NULL,
	`requirements` longtext NOT NULL,
	`purchaserId` varchar(191) NOT NULL,
	`price` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`deadline` timestamp,
	`accepted_at` timestamp,
	`rejected_at` timestamp,
	`completed_at` timestamp,
	`cancelled_at` timestamp,
	`paid_at` timestamp,
	`rejectedReason` varchar(191),
	`status` enum('pending','accepted','rejected','in_progress','paid','completed','cancelled') NOT NULL DEFAULT 'pending',
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects_state` (
	`id` varchar(191) NOT NULL,
	`state` boolean NOT NULL DEFAULT true,
	CONSTRAINT `projects_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`key` varchar(191) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`permissions` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`),
	CONSTRAINT `roles_key_unique` UNIQUE(`key`),
	CONSTRAINT `name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`image` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
	`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
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
CREATE INDEX `blog_id_idx` ON `comments` (`blogId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `purchaser_id_idx` ON `projects` (`purchaserId`);