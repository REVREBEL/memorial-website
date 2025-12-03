-- Memory Wall Application - Initial Schema
-- Created for Webflow Cloud Deployment

CREATE TABLE `memories` (
	`id` text PRIMARY KEY NOT NULL,
	`headline` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`memory` text NOT NULL,
	`memory_date` text,
	`location` text,
	`media_key` text,
	`media_type` text DEFAULT 'none',
	`tags` text NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE `likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`memory_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`memory_id`) REFERENCES `memories`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `guestbook` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`location` text,
	`relationship` text NOT NULL,
	`first_met` text,
	`message` text NOT NULL,
	`created_at` text NOT NULL
);

CREATE INDEX `idx_memories_created_at` ON `memories`(`created_at` DESC);
CREATE INDEX `idx_likes_memory_id` ON `likes`(`memory_id`);
CREATE INDEX `idx_guestbook_created_at` ON `guestbook`(`created_at` DESC);
