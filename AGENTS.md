<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Cursor Cloud specific instructions

### Services overview

| Service | Command | Notes |
|---------|---------|-------|
| Next.js dev server | `bun run dev` | Runs on port 3000 |
| Convex backend | `npx convex dev` | Requires `NEXT_PUBLIC_CONVEX_URL` in `.env.local` |

### Key gotchas

- **Bun is the package manager.** The lockfile is `bun.lock`. Use `bun install` (not npm/yarn/pnpm).
- **Public site works without Convex.** Pages fall back to hardcoded defaults in `src/lib/default-content.ts`. Only the admin CMS (`/admin/*`) requires a live Convex deployment.
- **ConvexClientProvider blocks rendering** when `NEXT_PUBLIC_CONVEX_URL` is unset. For local dev without Convex, set a placeholder value in `.env.local` so the public pages render (the Convex client will fail to connect silently on the public pages since they don't use subscriptions).
- **`bun run build` runs a `prebuild` step** (`node scripts/fetch-content.js`) that requires `NEXT_PUBLIC_CONVEX_URL` or `NEXT_PUBLIC_CONVEX_SITE_URL`. To build without Convex, run `npx next build` directly — the missing `build-content.json` warning is harmless.
- **Lint:** `bun run lint` (runs `next lint`).
- **Static export:** `next.config.ts` sets `output: "export"`, so the production build generates static HTML in `out/`.
