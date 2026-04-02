import { pgTable, text, timestamp, integer, uuid, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  totalPoints: integer("total_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  team1: text("team1").notNull(), // e.g., CSK, MI
  team2: text("team2").notNull(),
  matchTime: timestamp("match_time").notNull(),
  status: text("status", { enum: ["upcoming", "live", "completed"] }).default("upcoming").notNull(),
  actualResults: jsonb("actual_results"), // Stores actual toss winner, top scorer, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  creatorId: uuid("creator_id").references(() => users.id).notNull(),
  stakesDescription: text("stakes_description").notNull(),
  status: text("status", { enum: ["open", "locked", "resolved"] }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  matchId: uuid("match_id").references(() => matches.id).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id),
  tossWinner: text("toss_winner"),
  topScorer: text("top_scorer"),
  totalRuns: text("total_runs"), // e.g., "160-180", "180+"
  matchResult: text("match_result"), // Which team wins
  topWicketTaker: text("top_wicket_taker"), // e.g., "Bumrah 3+ Wickets"
  isLocked: boolean("is_locked").default(false).notNull(),
  pointsEarned: integer("points_earned").default(0), // Calculated after match completion
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  predictions: many(predictions),
  challengesCreated: many(challenges),
}));

export const matchesRelations = relations(matches, ({ many }) => ({
  predictions: many(predictions),
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  match: one(matches, {
    fields: [challenges.matchId],
    references: [matches.id],
  }),
  creator: one(users, {
    fields: [challenges.creatorId],
    references: [users.id],
  }),
  predictions: many(predictions),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  user: one(users, {
    fields: [predictions.userId],
    references: [users.id],
  }),
  match: one(matches, {
    fields: [predictions.matchId],
    references: [matches.id],
  }),
  challenge: one(challenges, {
    fields: [predictions.challengeId],
    references: [challenges.id],
  }),
}));
