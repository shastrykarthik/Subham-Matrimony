import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";
import { z } from "zod/v4";

export const connectionsTable = pgTable(
  "connections",
  {
    id: serial("id").primaryKey(),
    fromUserId: text("from_user_id").notNull(),
    toProfileId: integer("to_profile_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("connections_sender_target_unique").on(table.fromUserId, table.toProfileId),
  ],
);

export const insertConnectionSchema = createInsertSchema(connectionsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connectionsTable.$inferSelect;
