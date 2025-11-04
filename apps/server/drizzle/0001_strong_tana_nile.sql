ALTER TABLE "generations" RENAME COLUMN "result_url" TO "style";--> statement-breakpoint
ALTER TABLE "generations" ALTER COLUMN "status" SET DEFAULT 'completed';--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "image_url" varchar(1024);