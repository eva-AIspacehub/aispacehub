CREATE TABLE `partner_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(256) NOT NULL,
	`contactName` varchar(128) NOT NULL,
	`contactInfo` varchar(320) NOT NULL,
	`cooperationIntent` enum('技术合作','市场推广','投资对接','教育合作','其他') NOT NULL,
	`additionalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partner_applications_id` PRIMARY KEY(`id`)
);
