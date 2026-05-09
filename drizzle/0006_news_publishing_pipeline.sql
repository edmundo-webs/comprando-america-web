-- =====================================================================
-- Migration 0006: News publishing pipeline foundation
-- Adds editorial workflow + raw payload + AI/image enrichment fields to
-- ca_news_articles, plus health/priority columns to ca_news_feeds, plus
-- two new tables: ca_social_posts and ca_ingestion_runs.
--
-- Idempotency note: Drizzle migrations are typically not idempotent. If you
-- need to re-run, drop the affected columns/tables first.
-- =====================================================================

-- ---------- ca_news_articles: add editorial workflow ----------
ALTER TABLE `ca_news_articles` ADD `status` enum('candidate','draft','approved','published','rejected','archived') NOT NULL DEFAULT 'published';--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `relevanceScore` tinyint;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `rejectionReason` varchar(256);--> statement-breakpoint

-- ---------- ca_news_articles: capture raw feed payload ----------
ALTER TABLE `ca_news_articles` ADD `rawTitle` text;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `rawSummary` text;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `rawContent` text;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `rawAuthor` varchar(256);--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `rawImageUrl` varchar(1024);--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `externalHash` varchar(64);--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `feedId` int;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD CONSTRAINT `ca_news_articles_externalHash_unique` UNIQUE(`externalHash`);--> statement-breakpoint

-- ---------- ca_news_articles: AI / image enrichment ----------
ALTER TABLE `ca_news_articles` ADD `heroImagePrompt` text;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `tags` text;--> statement-breakpoint

-- ---------- ca_news_articles: workflow timestamps ----------
ALTER TABLE `ca_news_articles` ADD `publishedAtInternal` timestamp NULL;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `draftedAt` timestamp NULL;--> statement-breakpoint
ALTER TABLE `ca_news_articles` ADD `approvedAt` timestamp NULL;--> statement-breakpoint

-- ---------- ca_news_feeds: ingestion health & priority ----------
ALTER TABLE `ca_news_feeds` ADD `language` enum('es','en') NOT NULL DEFAULT 'es';--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `priority` tinyint NOT NULL DEFAULT 5;--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `isActive` varchar(5) NOT NULL DEFAULT 'true';--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `lastFetchedAt` timestamp NULL;--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `lastError` text;--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `consecutiveFailures` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `ca_news_feeds` ADD `updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint

-- ---------- ca_social_posts (NEW) ----------
CREATE TABLE `ca_social_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int,
	`network` enum('facebook','instagram','tiktok','linkedin','threads','x','youtube') NOT NULL,
	`postType` enum('carousel','reel','short','post','story') NOT NULL,
	`language` enum('es','en') NOT NULL DEFAULT 'es',
	`caption` text,
	`mediaUrls` text,
	`metricoolId` varchar(128),
	`scheduledAt` timestamp NULL,
	`postedAt` timestamp NULL,
	`status` enum('queued','scheduled','posted','failed') NOT NULL DEFAULT 'queued',
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ca_social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint

-- ---------- ca_ingestion_runs (NEW) ----------
CREATE TABLE `ca_ingestion_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedId` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`finishedAt` timestamp NULL,
	`itemsFound` int NOT NULL DEFAULT 0,
	`itemsNew` int NOT NULL DEFAULT 0,
	`itemsSkipped` int NOT NULL DEFAULT 0,
	`error` text,
	CONSTRAINT `ca_ingestion_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint

-- ---------- Indexes for query patterns we'll add in Fase 1 ----------
CREATE INDEX `ca_news_articles_status_idx` ON `ca_news_articles` (`status`);--> statement-breakpoint
CREATE INDEX `ca_news_articles_cat_status_idx` ON `ca_news_articles` (`category`, `status`);--> statement-breakpoint
CREATE INDEX `ca_news_articles_published_internal_idx` ON `ca_news_articles` (`publishedAtInternal`);--> statement-breakpoint
CREATE INDEX `ca_social_posts_article_idx` ON `ca_social_posts` (`articleId`);--> statement-breakpoint
CREATE INDEX `ca_social_posts_status_idx` ON `ca_social_posts` (`status`);--> statement-breakpoint
CREATE INDEX `ca_ingestion_runs_feed_idx` ON `ca_ingestion_runs` (`feedId`, `startedAt`);
