# M5 Painting contact form — Cloudflare Turnstile

This site uses one managed Cloudflare Turnstile widget to protect the contact / quote form on the homepage and /contact. A valid token is **mandatory before a lead is saved**, not just before the email notification.

## Widget

- Cloudflare account: M5 Painting's connected Cloudflare account
- Widget: `M5 Painting — Estimate Form`
- Public site key: `0x4AAAAAAF9Jmwk4KUuWGe2-`
- Registered hosts: `www.m5painting.com`, `m5painting.com`, `localhost`, `127.0.0.1`
- Action validated by the backend: `contact`

## Deployment configuration (never commit the secret)

1. In the **Convex production deployment** environment variables, set:
   - `TURNSTILE_SECRET` — the private secret from Cloudflare Turnstile → M5 Painting — Estimate Form. Never put this in `NEXT_PUBLIC_*`, source control, or a chat.
   - `TURNSTILE_HOSTNAMES=www.m5painting.com,m5painting.com` — the exact approved production frontend hostnames. **Do not** include localhost here.
2. In **Netlify** (or whichever service builds the Next.js frontend), set:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAF9Jmwk4KUuWGe2-`
3. Deploy Convex backend functions **and** rebuild/redeploy the Next.js frontend. Setting the environment variables alone does not publish the code changes. Ensure the Convex production deployment used by the frontend has the new action.
4. For local development, a non-production Convex deployment may use `TURNSTILE_HOSTNAMES=localhost,127.0.0.1` with the same widget secret. Do not allow local hostnames in production.

## Why the Convex action matters

The old frontend called the public `content.submitLead` mutation directly, creating a lead before any email was sent. Merely validating the email notification would allow bots to bypass Turnstile and keep filling the leads database.

The public `content.submitLead` endpoint is now a Convex **action** that calls Cloudflare Siteverify and checks `success === true`, `action === "contact"`, and the expected hostname. Only after verification may it invoke the private `content.insertVerifiedLead` mutation. The original email notification flow is preserved.

Requests with a missing, expired, invalid, replayed or wrong-host token fail closed, as do missing secrets or Siteverify outages. The widget resets after every submission attempt.

## Validation checklist

- Open both the homepage and /contact and confirm the Turnstile widget loads.
- Submit a valid test inquiry: exactly one new Convex lead and one notification email.
- Check that a request with no token is rejected before any lead is saved.
- Reuse the same token: Turnstile should reject the replay.
- Verify that `TURNSTILE_HOSTNAMES` contains **production hosts only** in production.
- Confirm the cookie banner no longer appears automatically; users can still open preferences from the footer.

**Do not claim end-to-end protection until the Convex environment and both deployments are configured and a fresh real token has been tested.**
