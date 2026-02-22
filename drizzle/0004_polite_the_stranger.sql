CREATE TABLE `news_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`categories` text NOT NULL,
	`is_active` enum('true','false') NOT NULL DEFAULT 'true',
	`verification_token` varchar(255),
	`is_verified` enum('true','false') NOT NULL DEFAULT 'false',
	`unsubscribe_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_subscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `news_subscribers_unsubscribe_token_unique` UNIQUE(`unsubscribe_token`)
);
