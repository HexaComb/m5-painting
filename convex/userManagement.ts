import {
  createAccount,
  getAuthUserId,
  modifyAccountCredentials,
  retrieveAccount,
  invalidateSessions,
} from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalAction,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { ADMIN_CREDENTIALS_PROVIDER } from "./adminAuth";

const MIN_PASSWORD_LENGTH = 6;

function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

export const getCredentialsAccountId = internalQuery({
  args: { userId: v.id("users") },
  returns: v.string(),
  handler: async (ctx, { userId }) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", userId).eq("provider", ADMIN_CREDENTIALS_PROVIDER),
      )
      .unique();
    if (!account) {
      throw new Error("No admin credentials found for this user");
    }
    return account.providerAccountId;
  },
});

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
        provider: ADMIN_CREDENTIALS_PROVIDER,
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

// ─── Change own password (requires current password) ─────────────────
export const changeOwnPassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { currentPassword, newPassword }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, message: "Not authenticated" };
    }

    const passwordError = validateNewPassword(newPassword);
    if (passwordError) {
      return { success: false, message: passwordError };
    }
    if (currentPassword === newPassword) {
      return { success: false, message: "New password must be different" };
    }

    const accountId = await ctx.runQuery(
      internal.userManagement.getCredentialsAccountId,
      { userId },
    );

    try {
      await retrieveAccount(ctx, {
        provider: ADMIN_CREDENTIALS_PROVIDER,
        account: { id: accountId, secret: currentPassword },
      });
    } catch {
      return { success: false, message: "Current password is incorrect" };
    }

    try {
      await modifyAccountCredentials(ctx, {
        provider: ADMIN_CREDENTIALS_PROVIDER,
        account: { id: accountId, secret: newPassword },
      });
      return { success: true, message: "Password updated" };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to update password";
      return { success: false, message: msg };
    }
  },
});

// ─── Admin reset another user's password ─────────────────────────────
export const resetUserPassword = action({
  args: {
    userId: v.id("users"),
    newPassword: v.string(),
    userName: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { userId: targetUserId, newPassword, userName }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      return { success: false, message: "Not authenticated" };
    }

    if (targetUserId === currentUserId) {
      return {
        success: false,
        message: "Use “Change your password” to update your own password",
      };
    }

    const passwordError = validateNewPassword(newPassword);
    if (passwordError) {
      return { success: false, message: passwordError };
    }

    const accountId = await ctx.runQuery(
      internal.userManagement.getCredentialsAccountId,
      { userId: targetUserId },
    );

    try {
      await modifyAccountCredentials(ctx, {
        provider: ADMIN_CREDENTIALS_PROVIDER,
        account: { id: accountId, secret: newPassword },
      });
      await invalidateSessions(ctx, { userId: targetUserId });
      return {
        success: true,
        message: `Password reset for ${userName ?? "user"}. They must sign in again.`,
      };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to reset password";
      return { success: false, message: msg };
    }
  },
});
