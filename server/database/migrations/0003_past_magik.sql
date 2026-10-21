CREATE TABLE "teacher_apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(60) NOT NULL,
	"group_id" integer NOT NULL,
	"title_en" varchar(120) NOT NULL,
	"title_zh" varchar(120) NOT NULL,
	"desc_en" text DEFAULT '' NOT NULL,
	"desc_zh" text DEFAULT '' NOT NULL,
	"href" varchar(500) DEFAULT '' NOT NULL,
	"icon" varchar(100) DEFAULT 'i-lucide-wrench' NOT NULL,
	"mark_en" varchar(100) DEFAULT '' NOT NULL,
	"mark_zh" varchar(100) DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'live' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"external" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(50) NOT NULL,
	"title_en" varchar(100) NOT NULL,
	"title_zh" varchar(100) NOT NULL,
	"note_en" varchar(255) DEFAULT '' NOT NULL,
	"note_zh" varchar(255) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "teacher_apps" ADD CONSTRAINT "teacher_apps_group_id_teacher_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."teacher_groups"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_apps_slug_idx" ON "teacher_apps" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "teacher_apps_group_sort_idx" ON "teacher_apps" USING btree ("group_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_groups_slug_idx" ON "teacher_groups" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "teacher_groups_active_sort_idx" ON "teacher_groups" USING btree ("is_active","sort_order");