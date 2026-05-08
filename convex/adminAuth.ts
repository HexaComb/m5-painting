import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { retrieveAccount } from "@convex-dev/auth/server";
import { Scrypt } from "lucia";
import type { DataModel } from "./_generated/dataModel";

/**
 * Simple admin credentials provider.
 * Accepts username (treated as email internally) + password.
 * No signup — admin accounts are seeded via the seedAdmin mutation.
 */
export const AdminCredentials = ConvexCredentials<DataModel>({
  id: "admin-credentials",
  crypto: {
    async hashSecret(password: string) {
      return await new Scrypt().hash(password);
    },
    async verifySecret(password: string, hash: string) {
      return await new Scrypt().verify(hash, password);
    },
  },
  authorize: async (params, ctx) => {
    const username = params.email as string;
    const password = params.password as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Lookup using the username as the account ID
    const result = await retrieveAccount(ctx, {
      provider: "admin-credentials",
      account: {
        id: username.toLowerCase(),
        secret: password,
      },
    });

    return { userId: result.user._id };
  },
});
