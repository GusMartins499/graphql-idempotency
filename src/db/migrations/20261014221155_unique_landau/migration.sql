CREATE TABLE `idempotency_keys` (
	`key` text NOT NULL,
	`operation` text NOT NULL,
	`request_hash` text NOT NULL,
	`resource_id` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `idempotency_keys_pk` PRIMARY KEY(`key`, `operation`)
);
