// src/db/schema.js
import {
  pgEnum,
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]); // [web:2]

// Tables
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(), // [web:2]
  sport: varchar("sport", { length: 64 }).notNull(), // [web:3]
  homeTeam: varchar("home_team", { length: 255 }).notNull(), // [web:1][web:3]
  awayTeam: varchar("away_team", { length: 255 }).notNull(), // [web:1][web:3]
  status: matchStatusEnum("status").notNull().default("scheduled"), // [web:2]
  startTime: timestamp("start_time", { withTimezone: true }).notNull(), // [web:2][web:13]
  endTime: timestamp("end_time", { withTimezone: true }), // [web:2]
  homeScore: integer("home_score").notNull().default(0), // [web:2]
  awayScore: integer("away_score").notNull().default(0), // [web:2]
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(), // [web:13]
});

export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(), // [web:2]
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }), // [web:2]
  minute: integer("minute").notNull(), // [web:2]
  sequence: integer("sequence").notNull(), // [web:2]
  period: varchar("period", { length: 32 }).notNull(), // [web:2]
  eventType: varchar("event_type", { length: 64 }).notNull(), // [web:2]
  actor: varchar("actor", { length: 255 }), // [web:2]
  team: varchar("team", { length: 255 }), // [web:2]
  message: varchar("message", { length: 1024 }).notNull(), // [web:2]
  metadata: jsonb("metadata")
    .$type()
    .default(sql`'{}'::jsonb`), // [web:3][web:9][web:12]
  tags: varchar("tags", { length: 255 }), // could be comma-separated or handled via a join table later [web:2]
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(), // [web:13]
});
