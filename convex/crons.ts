import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync google reviews",
  { hours: 24 },
  internal.googleReviews.syncGoogleReviews,
  {},
);

crons.interval(
  "sync instagram posts",
  { hours: 24 },
  internal.instagramPosts.syncInstagramPosts,
  {},
);

export default crons;
