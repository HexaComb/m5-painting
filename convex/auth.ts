import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { AdminCredentials } from "./adminAuth";

declare const process: { env: Record<string, string | undefined> };

function decodePrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  if (key.includes("\n")) return key;
  if (key.startsWith("-----BEGIN")) {
    const body = key
      .replace(/^-----BEGIN PRIVATE KEY-----\s*/, "")
      .replace(/\s*-----END PRIVATE KEY-----$/, "");
    return [
      "-----BEGIN PRIVATE KEY-----",
      ...body.split(/\s+/),
      "-----END PRIVATE KEY-----",
    ].join("\n");
  }
  try {
    return atob(key);
  } catch {
    return key;
  }
}

const authPrivateKey = process.env.AUTH_PRIVATE_KEY;
if (authPrivateKey) {
  process.env.AUTH_PRIVATE_KEY = decodePrivateKey(authPrivateKey);
}

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
if (jwtPrivateKey) {
  process.env.JWT_PRIVATE_KEY = decodePrivateKey(jwtPrivateKey);
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [AdminCredentials],
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});
