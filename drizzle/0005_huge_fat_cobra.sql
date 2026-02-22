ALTER TABLE `news_articles` DROP INDEX `news_articles_url_unique`;--> statement-breakpoint
ALTER TABLE `news_articles` ADD `slug` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `news_articles` ADD `body` text;--> statement-breakpoint
ALTER TABLE `news_articles` ADD `author` varchar(255) DEFAULT 'Equipo Comprando América' NOT NULL;--> statement-breakpoint
ALTER TABLE `news_articles` ADD `cta_type` varchar(100);--> statement-breakpoint
ALTER TABLE `news_articles` ADD CONSTRAINT `news_articles_slug_unique` UNIQUE(`slug`);