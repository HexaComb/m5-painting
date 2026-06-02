import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 10 days = 240 hours (Convex crons support hours, not days)
crons.interval(
  "sync google reviews",
  { hours: 240 },
  internal.googleReviews.syncGoogleReviews,
  {},
);

export default crons;
