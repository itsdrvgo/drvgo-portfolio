CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`provider_account_id` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `provider_idx` UNIQUE(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`thumbnailUrl` varchar(255),
	`content` longtext,
	`published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`authorId` varchar(255) NOT NULL,
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blogId` int NOT NULL,
	`text` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`authorId` varchar(255) NOT NULL,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`uploaderId` varchar(255) NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blogId` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`user_id` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`session_token` varchar(191) NOT NULL,
	CONSTRAINT `sessions_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191) NOT NULL,
	`email_verified` timestamp,
	`image` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`role` enum('user','moderator','admin','owner') NOT NULL DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `identifier_token_idx` UNIQUE(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blogId` int NOT NULL,
	CONSTRAINT `views_id` PRIMARY KEY(`id`)
);
