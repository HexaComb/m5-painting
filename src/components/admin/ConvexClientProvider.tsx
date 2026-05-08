"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { type ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Lazy-init to avoid crashing build when env var isn't set yet
let _convex: ConvexReactClient | null = null;
function getConvex() {
  if (!_convex) {
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set. Add it to .env.local");
    }
    _convex = new ConvexReactClient(convexUrl);
  }
  return _convex;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convexUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">CMS not configured — NEXT_PUBLIC_CONVEX_URL is missing.</p>
      </div>
    );
  }
  return <ConvexAuthProvider client={getConvex()}>{children}</ConvexAuthProvider>;
}
