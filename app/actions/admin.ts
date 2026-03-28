"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matches, predictions, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function createMatch(formData: FormData) {
  if (!await isAdmin()) throw new Error("Unauthorized");

  const team1 = formData.get("team1") as string;
  const team2 = formData.get("team2") as string;
  const matchTime = formData.get("matchTime") as string;

  const parsedDate = new Date(matchTime);
  if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid match date/time provided: ${matchTime}`);
  }

  await db.insert(matches).values({
    team1,
    team2,
    matchTime: parsedDate,
    status: "upcoming"
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function resolveMatch(formData: FormData) {
  if (!await isAdmin()) throw new Error("Unauthorized");

  const matchId = formData.get("matchId") as string;
  const tossWinner = formData.get("tossWinner") as string;
  const topScorer = formData.get("topScorer") as string;
  const totalRuns = formData.get("totalRuns") as string;
  const matchResult = formData.get("matchResult") as string;
  const playerPerf = formData.get("playerPerf") as string;

  const actualResults = { tossWinner, topScorer, totalRuns, matchResult, playerPerf };

  // Update match status & results
  await db.update(matches).set({
    status: "completed",
    actualResults
  }).where(eq(matches.id, matchId));

  // Fetch all predictions for this match to calculate and distribute points
  const allPredictions = await db.select().from(predictions).where(eq(predictions.matchId, matchId));

  for (const p of allPredictions) {
    let points = 0;
    if (p.tossWinner === tossWinner) points += 10;
    if (p.topScorer?.toLowerCase() === topScorer.toLowerCase()) points += 10;
    if (p.totalRuns === totalRuns) points += 10;
    if (p.matchResult === matchResult) points += 10;
    if (p.playerPerf?.toLowerCase() === playerPerf.toLowerCase()) points += 10;

    if (points > 0) {
      await db.update(predictions).set({ pointsEarned: points }).where(eq(predictions.id, p.id));
      await db.update(users).set({ totalPoints: sql`${users.totalPoints} + ${points}` }).where(eq(users.id, p.userId));
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
}
