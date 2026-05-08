import { createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedAdmin = internalAction({
  args: {
    username: v.string(),
    password: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { username, password }) => {
    // Check if admin already exists
    try {
      await retrieveAccount(ctx, {
        provider: "admin-credentials",
        account: { id: username.toLowerCase() },
      });
      // Delete existing and recreate to ensure password is correct
    } catch {
      // Does not exist, proceed to create
    }

    try {
      // Pass raw password — the provider's crypto.hashSecret handles hashing
      await createAccount(ctx, {
        provider: "admin-credentials",
        account: {
          id: username.toLowerCase(),
          secret: password,
        },
        profile: {
          email: `${username.toLowerCase()}@m5painting.com`,
          name: "Admin",
          emailVerificationTime: Date.now(),
        },
        shouldLinkViaEmail: false,
      });

      // Also seed the content data
      await ctx.runMutation(internal.content.seed);

      return { success: true, message: "Admin user and content seeded" };
    } catch (error) {
      return {
        success: false,
        message: `Failed to seed admin: ${error}`,
      };
    }
  },
});
