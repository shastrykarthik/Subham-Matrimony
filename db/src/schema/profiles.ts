import { createInsertSchema } from "drizzle-zod";
import { boolean, date, index, numeric, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const profilesTable = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    fullName: text("full_name").notNull(),
    gender: text("gender").notNull(),
    dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    gothra: text("gothra").notNull(),
    nakshatra: text("nakshatra"),
    rashi: text("rashi"),
    familyValues: text("family_values").notNull().default("Moderate"),
    educationQualification: text("education_qualification").notNull(),
    currentOccupation: text("current_occupation").notNull(),
    annualIncomeInr: numeric("annual_income_inr", { precision: 12, scale: 2, mode: "number" }).notNull(),
    currentCity: text("current_city").notNull(),
    isAdminApproved: boolean("is_admin_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("profiles_user_id_unique").on(table.userId),
    uniqueIndex("profiles_phone_number_unique").on(table.phoneNumber),
    index("profiles_filter_idx").on(table.gender, table.isAdminApproved, table.gothra),
  ],
);

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  id: true,
  isAdminApproved: true,
  createdAt: true,
});
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
