// src/validation/matches.js
import { z } from "zod"; // [web:18]

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(), // [web:18][web:20]
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(), // [web:18][web:20]
});

const isoDateTimeRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/; // [web:27]

const baseMatchTimeFields = {
  startTime: z.string().refine((value) => isoDateTimeRegex.test(value), {
    message: "startTime must be a valid ISO datetime string",
  }), // [web:21][web:27]
  endTime: z.string().refine((value) => isoDateTimeRegex.test(value), {
    message: "endTime must be a valid ISO datetime string",
  }), // [web:21][web:27]
};

export const createMatchSchema = z
  .object({
    sport: z.string().min(1, "sport is required"),
    homeTeam: z.string().min(1, "homeTeam is required"),
    awayTeam: z.string().min(1, "awayTeam is required"),
    ...baseMatchTimeFields,
    homeScore: z.coerce.number().int().min(0).optional(), // [web:18][web:20]
    awayScore: z.coerce.number().int().min(0).optional(), // [web:18][web:20]
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        path: ["startTime"],
        code: z.ZodIssueCode.custom,
        message: "startTime is not a valid date",
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        path: ["endTime"],
        code: z.ZodIssueCode.custom,
        message: "endTime is not a valid date",
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (end <= start) {
        ctx.addIssue({
          path: ["endTime"],
          code: z.ZodIssueCode.custom,
          message: "endTime must be after startTime",
        });
      }
    }
  }); // [web:22][web:25]

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0), // [web:18][web:20]
});
