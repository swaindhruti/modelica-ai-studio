import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 512 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull().default("free"),
  credits: integer("credits").notNull().default(1000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  prompt: varchar("prompt", { length: 1024 }).notNull(),
  style: varchar("style", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("completed"),
  imageUrl: varchar("image_url", { length: 1024 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
