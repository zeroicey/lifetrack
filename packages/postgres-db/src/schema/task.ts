import { relations } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  timestamp,
  AnyPgColumn,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const taskGroups = pgTable("task_groups", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  userId: integer("user_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
});

export const taskStateEnum = pgEnum("task_state", ["TODO", "DONE"]);

export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  content: text("content").notNull(),
  state: taskStateEnum("state").notNull().default("TODO"),
  groupId: integer("group_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  deadline: timestamp("deadline", { precision: 3 }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  group: one(taskGroups, {
    fields: [tasks.groupId],
    references: [taskGroups.id],
  }),
}));

export const taskGroupsRelations = relations(taskGroups, ({ many, one }) => ({
  tasks: many(tasks),
  user: one(users, { fields: [taskGroups.userId], references: [users.id] }),
}));
