"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { predictions, matches } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

export async function submitPrediction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const matchId = formData.get("matchId") as string;
  const challengeId = formData.get("challengeId") as string | null;
  const tossWinner = formData.get("tossWinner") as string;
  const topScorer = formData.get("topScorer") as string;
  const totalRuns = formData.get("totalRuns") as string;
  const matchResult = formData.get("matchResult") as string;
  const playerPerf = formData.get("playerPerf") as string;

  // Verify match is still upcoming (locking mechanism)
  const matchRes = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  const match = matchRes[0];
  
  if (!match || match.status !== "upcoming") {
    return { error: "Match predictions are locked!" };
  }

  if (new Date() >= new Date(match.matchTime)) {
    // Auto-update to live if somehow missed by admin, and lock
    await db.update(matches).set({ status: "live" }).where(eq(matches.id, matchId));
    return { error: "Match has already started. Predictions locked!" };
  }

  // Check if existing prediction
  const existingRes = await db.select().from(predictions).where(
    and(eq(predictions.userId, session.user.id), eq(predictions.matchId, matchId))
  ).limit(1);
  
  const existing = existingRes[0];

  if (existing) {
    await db.update(predictions).set({
      tossWinner, topScorer, totalRuns, matchResult, playerPerf,
      ...(challengeId ? { challengeId } : {})
    }).where(eq(predictions.id, existing.id));
  } else {
    await db.insert(predictions).values({
      userId: session.user.id,
      matchId,
      ...(challengeId ? { challengeId } : {}),
      tossWinner, topScorer, totalRuns, matchResult, playerPerf,
      isLocked: false // Automatic lock when match starts
    });
  }

  redirect("/dashboard");
}
