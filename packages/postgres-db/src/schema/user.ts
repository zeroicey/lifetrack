import { relations } from "drizzle-orm";
import { integer, text, pgTable, timestamp } from "drizzle-orm/pg-core";
import { events } from "./event";
import { taskGroups } from "./task";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  taskGroups: many(taskGroups),
}));
