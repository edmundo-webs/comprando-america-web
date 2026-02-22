CREATE TABLE `news_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`content` text,
	`url` varchar(1000) NOT NULL,
	`source` varchar(255) NOT NULL,
	`category` enum('visas-migracion','economia-finanzas','bienes-raices','llc-negocios','inversiones') NOT NULL,
	`image_url` varchar(1000),
	`published_at` timestamp NOT NULL,
	`fetched_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_articles_url_unique` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `news_feeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`category` enum('visas-migracion','economia-finanzas','bienes-raices','llc-negocios','inversiones') NOT NULL,
	`is_active` enum('true','false') NOT NULL DEFAULT 'true',
	`last_fetched_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_feeds_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_feeds_url_unique` UNIQUE(`url`)
);
