"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { challenges, predictions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createChallenge(matchId: string, stakesDescription: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [newChallenge] = await db.insert(challenges).values({
    matchId,
    creatorId: session.user.id,
    stakesDescription,
    status: "open",
  }).returning();

  // Auto-link the creator's existing prediction for this match to the new challenge
  // so it appears on the VS board when the friend opens the link
  await db.update(predictions)
    .set({ challengeId: newChallenge.id })
    .where(
      and(
        eq(predictions.userId, session.user.id),
        eq(predictions.matchId, matchId)
      )
    );

  revalidatePath("/dashboard");
  return newChallenge.id;
}

