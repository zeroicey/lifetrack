import { relations } from "drizzle-orm";
import { integer, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { taskGroups } from "./task";
import { memos } from "./memo";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  taskGroups: many(taskGroups),
  memos: many(memos),
}));
