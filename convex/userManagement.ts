import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  query,
  mutation,
  internalAction,
} from "./_generated/server";
import { internal } from "./_generated/api";

// ─── List all users ──────────────────────────────────────────────────
export const listUsers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      _creationTime: u._creationTime,
      name: u.name as string | undefined,
      email: u.email as string | undefined,
    }));
  },
});

// ─── Create a new admin user (action — required by createAccount) ────
export const createUser = internalAction({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { username, password, name }) => {
    try {
      await createAccount(ctx, {
        provider: "admin-credentials",
        account: {
          id: username.toLowerCase(),
          secret: password,
        },
        profile: {
          email: username.toLowerCase(),
          name,
          emailVerificationTime: Date.now(),
        },
        shouldLinkViaEmail: false,
      });
      return { success: true, message: "User created successfully" };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to create user";
      return { success: false, message: msg };
    }
  },
});

// ─── Wrapper mutation that schedules the action (frontend-callable) ──
export const addUser = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.scheduler.runAfter(0, internal.userManagement.createUser, args);
    return null;
  },
});

// ─── Delete user mutation ────────────────────────────────────────────
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    if (userId === currentUserId) {
      throw new Error("You cannot delete your own account");
    }

    // Delete auth accounts
    const authAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const account of authAccounts) {
      await ctx.db.delete(account._id);
    }

    // Delete auth sessions
    const authSessions = await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const session of authSessions) {
      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(userId);
    return null;
  },
});
