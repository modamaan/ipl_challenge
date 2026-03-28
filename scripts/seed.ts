import { db } from "../lib/db/index";
import { users, matches, challenges, predictions } from "../lib/db/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");
  
  // Get your actual user account
  const allUsers = await db.select().from(users);
  const realUser = allUsers.find(u => !u.email.includes("dummy.com"));
  
  if (!realUser) {
    console.log("Could not find your user account! Please log in to the app first.");
    process.exit(1);
  }
  
  console.log(`Found your account: ${realUser.name}`);

  // Insert a completed match
  const [match] = await db.insert(matches).values({
    team1: "CSK",
    team2: "MI",
    matchTime: new Date(Date.now() - 86400000), // Yesterday
    status: "completed",
    actualResults: { tossWinner: "CSK", matchResult: "CSK", totalRuns: "190+", topScorer: "MS Dhoni", playerPerf: "Jadeja 3W" }
  }).returning();

  console.log(`Created completed Match: ${match.team1} vs ${match.team2}`);

  // Insert a challenge created by you
  const [challenge] = await db.insert(challenges).values({
    matchId: match.id,
    creatorId: realUser.id,
    stakesDescription: "Loser buys Biryani",
    status: "resolved",
  }).returning();

  console.log(`Created Challenge for the match!`);

  // Insert a prediction FOR YOU so it shows up in "Reveal Results"
  await db.insert(predictions).values({
    userId: realUser.id,
    matchId: match.id,
    challengeId: challenge.id,
    tossWinner: "CSK", // Correct
    matchResult: "MI", // Incorrect
    totalRuns: "190+", // Correct
    topScorer: "MS Dhoni", // Correct
    playerPerf: "Jadeja 3W", // Correct
    isLocked: true,
    pointsEarned: 40
  });
  
  // Give you some points so you appear on leaderboard
  await db.update(users).set({ totalPoints: sql`${users.totalPoints} + 40` }).where(sql`id = ${realUser.id}`);

  console.log(`Generated predictions for you!`);

  // Add 2 dummy users who also predicted on your challenge
  const ts = Date.now();
  const [dummy1, dummy2] = await db.insert(users).values([
    { name: "VIPER_STRIKER", email: `viper${ts}@dummy.com`, image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80", totalPoints: 1450 },
    { name: "NEON_PHANTOM", email: `neon${ts}@dummy.com`, image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80", totalPoints: 1380 }
  ]).returning();

  await db.insert(predictions).values([
    { userId: dummy1.id, matchId: match.id, challengeId: challenge.id, tossWinner: "NAVI ALLIANCE", matchResult: "NAVI ALLIANCE", totalRuns: "190+", topScorer: "S1MPLE_X", playerPerf: "AWP 3K", isLocked: true, pointsEarned: 0 },
    { userId: dummy2.id, matchId: match.id, challengeId: challenge.id, tossWinner: "G2 LEGION", matchResult: "G2 LEGION", totalRuns: "<150", topScorer: "NIKO_PRIME", playerPerf: "Clutch 1v3", isLocked: true, pointsEarned: 0 }
  ]);

  console.log("Added 2 dummy friends to your challenge!");

  // Create an upcoming match so you can test locking predictions manually
  const [upcoming] = await db.insert(matches).values({
    team1: "RR",
    team2: "SRH",
    matchTime: new Date(Date.now() + 86400000 * 2), // 2 days in future
    status: "upcoming"
  }).returning();

  console.log(`Created upcoming Match: ${upcoming.team1} vs ${upcoming.team2}`);

  console.log("✅ Seed complete! Refresh your dashboard.");
  process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
