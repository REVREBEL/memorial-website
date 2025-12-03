import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Memories table - stores photos, videos, and stories
export const memoriesTable = sqliteTable("memories", {
  id: text("id").primaryKey(),
  headline: text("headline").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  memory: text("memory").notNull(),        // Full memory text
  memoryDate: text("memory_date"),         // Optional date (YYYY-MM format)
  location: text("location"),              // Optional location
  mediaKey: text("media_key"),             // R2 storage key for photo/video
  mediaType: text("media_type").default("none"), // photo | video | none
  tags: text("tags").notNull(),            // JSON string array
  createdAt: text("created_at").notNull(),
});

// Likes table - tracks likes per memory
export const likesTable = sqliteTable("likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memoryId: text("memory_id")
    .notNull()
    .references(() => memoriesTable.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
});

// Guestbook table - stores guest messages
export const guestbookTable = sqliteTable("guestbook", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  location: text("location"),
  relationship: text("relationship").notNull(),
  firstMet: text("first_met"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
