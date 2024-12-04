import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const notes = pgTable("notes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tags: text("tags").array().notNull().default([]),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertNoteSchema = createInsertSchema(notes, {
  tags: z.array(z.string()).default([])
});
export const selectNoteSchema = createSelectSchema(notes, {
  tags: z.array(z.string()).default([])
});
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = z.infer<typeof selectNoteSchema>;
