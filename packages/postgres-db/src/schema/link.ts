import { relations } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  timestamp,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const links = pgTable("links", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  target: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
});

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));
