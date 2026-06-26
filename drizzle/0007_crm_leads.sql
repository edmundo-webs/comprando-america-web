-- Migration 0007: CRM Leads table
-- Stores pre-registrations from landing page forms (cumbre-digital, etc.)

CREATE TABLE IF NOT EXISTS `ca_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombreCompleto` varchar(255) NOT NULL,
	`whatsapp` varchar(50) NOT NULL,
	`email` varchar(320) NOT NULL,
	`fuente` varchar(100) NOT NULL DEFAULT 'general',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ca_leads_id` PRIMARY KEY(`id`)
);
