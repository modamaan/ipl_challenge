"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
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

  revalidatePath("/dashboard");
  return newChallenge.id;
}
