import { relations } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  timestamp,
  AnyPgColumn,
  json,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const memos = pgTable("memos", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  attachs:
    json("attachs").$type<
      Array<{
        type: "image" | "video" | "audio";
        url: string;
        position: number;
      }>
    >(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull().defaultNow(),
});

export const memosRelations = relations(memos, ({ one }) => ({
  user: one(users, { fields: [memos.userId], references: [users.id] }),
}));
