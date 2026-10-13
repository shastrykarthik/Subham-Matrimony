import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { and, count, eq, gte, gt, ilike, lte, sql } from "drizzle-orm";
import {
  ApproveProfileBody,
  ApproveProfileParams,
  ApproveProfileResponse,
  CreateProfileBody,
  CreateProfileResponse,
  GetProfileParams,
  GetProfileResponse,
  GetProfileStatsResponse,
  ListPendingProfilesResponse,
  ListProfilesQueryParams,
  ListProfilesResponse,
} from "@workspace/api-zod";
import { db, profilesTable } from "@workspace/db";
import type { Request, Response, NextFunction } from "express";

const router: IRouter = Router();

function publicProfile(profile: typeof profilesTable.$inferSelect) {
  return {
    id: profile.id,
    fullName: profile.fullName,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    gothra: profile.gothra,
    nakshatra: profile.nakshatra,
    rashi: profile.rashi,
    familyValues: profile.familyValues,
    educationQualification: profile.educationQualification,
    currentOccupation: profile.currentOccupation,
    annualIncomeInr: profile.annualIncomeInr,
    currentCity: profile.currentCity,
    isAdminApproved: profile.isAdminApproved,
    createdAt: profile.createdAt.toISOString(),
  };
}

function privateProfile(profile: typeof profilesTable.$inferSelect) {
  return {
    ...publicProfile(profile),
    email: profile.email,
    phoneNumber: profile.phoneNumber,
  };
}

function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

function isModerator(req: Request): boolean {
  const claims = getAuth(req).sessionClaims as
    | { metadata?: { role?: string }; publicMetadata?: { role?: string } }
    | null;
  const userId = getAuth(req).userId;
  const allowedUserIds = (process.env.MATRIMONY_MODERATOR_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    claims?.metadata?.role === "admin" ||
    claims?.publicMetadata?.role === "admin" ||
    (!!userId && allowedUserIds.includes(userId))
  );
}

function requireModerator(req: Request, res: Response, next: NextFunction): void {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (!isModerator(req)) {
    res.status(403).json({ error: "Moderator access required" });
    return;
  }
  next();
}

function ageCutoff(age: number): string {
  const now = new Date();
  const year = now.getUTCFullYear() - age;
  const month = now.getUTCMonth();
  const day = Math.min(now.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

router.get("/profiles", async (req, res): Promise<void> => {
  const parsed = ListProfilesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const query = parsed.data;
  const filters = [eq(profilesTable.isAdminApproved, true)];
  if (query.gender) filters.push(eq(profilesTable.gender, query.gender));
  if (query.city) filters.push(ilike(profilesTable.currentCity, `%${query.city}%`));
  if (query.gothra) filters.push(eq(profilesTable.gothra, query.gothra));
  if (query.rashi) filters.push(eq(profilesTable.rashi, query.rashi));
  if (query.minAge !== undefined) {
    filters.push(lte(profilesTable.dateOfBirth, ageCutoff(query.minAge)));
  }
  if (query.maxAge !== undefined) {
    filters.push(gt(profilesTable.dateOfBirth, ageCutoff(query.maxAge + 1)));
  }
  if (query.minIncome !== undefined) {
    filters.push(gte(profilesTable.annualIncomeInr, query.minIncome));
  }
  if (query.maxIncome !== undefined) {
    filters.push(lte(profilesTable.annualIncomeInr, query.maxIncome));
  }

  const profiles = await db
    .select()
    .from(profilesTable)
    .where(and(...filters))
    .orderBy(sql`${profilesTable.createdAt} DESC`)
    .limit(60);
  res.json(ListProfilesResponse.parse(profiles.map(publicProfile)));
});

router.post("/profiles", requireUser, async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = getAuth(req).userId!;
  if (parsed.data.dateOfBirth.toISOString().slice(0, 10) > ageCutoff(18)) {
    res.status(400).json({ error: "Members must be at least 18 years old" });
    return;
  }
  const existing = await db
    .select({ id: profilesTable.id })
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "A profile already exists for this account" });
    return;
  }

  try {
    const [profile] = await db
      .insert(profilesTable)
      .values({
        ...parsed.data,
        dateOfBirth: parsed.data.dateOfBirth.toISOString().slice(0, 10),
        userId,
        isAdminApproved: false,
      })
      .returning();
    res.status(201).json(CreateProfileResponse.parse(publicProfile(profile)));
  } catch (error) {
    req.log.warn({ error }, "Profile creation rejected");
    res.status(409).json({ error: "This phone number is already registered" });
  }
});

router.get("/profiles/stats", async (_req, res): Promise<void> => {
  const [approved] = await db
    .select({ value: count() })
    .from(profilesTable)
    .where(eq(profilesTable.isAdminApproved, true));
  const [pending] = await db
    .select({ value: count() })
    .from(profilesTable)
    .where(eq(profilesTable.isAdminApproved, false));
  res.json(GetProfileStatsResponse.parse({ approved: approved.value, pending: pending.value }));
});

router.get("/profiles/pending", requireModerator, async (_req, res): Promise<void> => {
  const pending = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.isAdminApproved, false))
    .orderBy(sql`${profilesTable.createdAt} ASC`);
  res.json(ListPendingProfilesResponse.parse(pending.map(privateProfile)));
});

router.get("/profiles/:id", async (req, res): Promise<void> => {
  const parsed = GetProfileParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, parsed.data.id))
    .limit(1);
  if (!profile || (!profile.isAdminApproved && getAuth(req).userId !== profile.userId)) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(GetProfileResponse.parse(publicProfile(profile)));
});

router.patch("/profiles/:id/approve", requireModerator, async (req, res): Promise<void> => {
  const params = ApproveProfileParams.safeParse(req.params);
  const body = ApproveProfileBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: params.error?.message ?? body.error?.message ?? "Invalid request" });
    return;
  }

  const [profile] = await db
    .update(profilesTable)
    .set({ isAdminApproved: body.data.isAdminApproved })
    .where(eq(profilesTable.id, params.data.id))
    .returning();
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(ApproveProfileResponse.parse(publicProfile(profile)));
});

export default router;
