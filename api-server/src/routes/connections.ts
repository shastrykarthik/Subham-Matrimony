import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { and, eq, sql } from "drizzle-orm";
import {
  CreateConnectionBody,
  CreateConnectionResponse,
  ListConnectionsResponse,
  RespondToConnectionBody,
  RespondToConnectionParams,
  RespondToConnectionResponse,
} from "@workspace/api-zod";
import { connectionsTable, db, profilesTable } from "@workspace/db";
import type { Request, Response, NextFunction } from "express";

const router: IRouter = Router();

type ProfileRow = typeof profilesTable.$inferSelect;
type ConnectionRow = typeof connectionsTable.$inferSelect;

function publicProfile(profile: ProfileRow) {
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

function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!getAuth(req).userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

router.get("/connections", requireUser, async (req, res): Promise<void> => {
  const userId = getAuth(req).userId!;
  const [ownProfile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);
  if (!ownProfile) {
    res.json([]);
    return;
  }

  const outgoing = await db
    .select()
    .from(connectionsTable)
    .where(eq(connectionsTable.fromUserId, userId))
    .orderBy(sql`${connectionsTable.createdAt} DESC`);
  const incoming = await db
    .select()
    .from(connectionsTable)
    .where(eq(connectionsTable.toProfileId, ownProfile.id))
    .orderBy(sql`${connectionsTable.createdAt} DESC`);

  const items: Array<Record<string, unknown>> = [];
  for (const connection of outgoing) {
    const [target] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id, connection.toProfileId))
      .limit(1);
    if (target) items.push(formatConnection(connection, "sent", target));
  }
  for (const connection of incoming) {
    const [sender] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, connection.fromUserId))
      .limit(1);
    if (sender) items.push(formatConnection(connection, "received", sender));
  }
  items.sort((a, b) => {
    const first = a.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(String(a.createdAt));
    const second = b.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(String(b.createdAt));
    return second - first;
  });
  res.json(ListConnectionsResponse.parse(items));
});

function formatConnection(connection: ConnectionRow, direction: "sent" | "received", profile: ProfileRow) {
  return {
    id: connection.id,
    toProfileId: connection.toProfileId,
    status: connection.status,
    createdAt: connection.createdAt.toISOString(),
    direction,
    profile: publicProfile(profile),
  };
}

router.post("/connections", requireUser, async (req, res): Promise<void> => {
  const parsed = CreateConnectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = getAuth(req).userId!;
  const [ownProfile] = await db
    .select()
    .from(profilesTable)
    .where(and(eq(profilesTable.userId, userId), eq(profilesTable.isAdminApproved, true)))
    .limit(1);
  if (!ownProfile) {
    res.status(403).json({ error: "Your profile must be approved before sending requests" });
    return;
  }
  const [target] = await db
    .select()
    .from(profilesTable)
    .where(and(eq(profilesTable.id, parsed.data.toProfileId), eq(profilesTable.isAdminApproved, true)))
    .limit(1);
  if (!target) {
    res.status(404).json({ error: "Approved profile not found" });
    return;
  }
  if (target.id === ownProfile.id) {
    res.status(400).json({ error: "You cannot send a request to your own profile" });
    return;
  }

  const [existing] = await db
    .select()
    .from(connectionsTable)
    .where(and(eq(connectionsTable.fromUserId, userId), eq(connectionsTable.toProfileId, target.id)))
    .limit(1);
  if (existing) {
    res.status(409).json({ error: "A request already exists for this profile" });
    return;
  }

  const [connection] = await db
    .insert(connectionsTable)
    .values({ fromUserId: userId, toProfileId: target.id, status: "pending" })
    .returning();
  res.status(201).json(CreateConnectionResponse.parse(formatConnection(connection, "sent", target)));
});

router.patch("/connections/:id/respond", requireUser, async (req, res): Promise<void> => {
  const params = RespondToConnectionParams.safeParse(req.params);
  const body = RespondToConnectionBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: params.error?.message ?? body.error?.message ?? "Invalid request" });
    return;
  }
  const userId = getAuth(req).userId!;
  const [ownProfile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);
  if (!ownProfile) {
    res.status(403).json({ error: "Create a profile before responding to requests" });
    return;
  }
  const [connection] = await db
    .update(connectionsTable)
    .set({ status: body.data.status })
    .where(
      and(
        eq(connectionsTable.id, params.data.id),
        eq(connectionsTable.toProfileId, ownProfile.id),
        eq(connectionsTable.status, "pending"),
      ),
    )
    .returning();
  if (!connection) {
    res.status(404).json({ error: "Pending request not found" });
    return;
  }
  const [sender] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, connection.fromUserId))
    .limit(1);
  if (!sender) {
    res.status(404).json({ error: "Requesting profile not found" });
    return;
  }
  res.json(
    RespondToConnectionResponse.parse(
      formatConnection(connection, "received", sender),
    ),
  );
});

export default router;
