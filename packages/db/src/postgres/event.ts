import { relations } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  timestamp,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  content: text("content").notNull(),
  partyId: integer("party_id")
    .notNull()
    .references((): AnyPgColumn => users.id),
  happenedAt: timestamp("created_at", { precision: 3 }).notNull().defaultNow(),
});

export const eventsRelations = relations(events, ({ one }) => ({
  party: one(users, { fields: [events.partyId], references: [users.id] }),
}));
