const fs = require("fs");
const path = require("path");

// Load .env.local if present (Node 20+)
try {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, "utf-8");
    for (const line of env.split("\n")) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2];
      }
    }
  }
} catch {
  // ignore
}

async function main() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  const siteUrl =
    convexSiteUrl || convexUrl?.replace(".convex.cloud", ".convex.site");

  if (!siteUrl) {
    console.error(
      "ERROR: NEXT_PUBLIC_CONVEX_URL or NEXT_PUBLIC_CONVEX_SITE_URL must be set"
    );
    process.exit(1);
  }

  console.log(`Fetching content from ${siteUrl}/api/content …`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let res;
  try {
    res = await fetch(`${siteUrl}/api/content`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    clearTimeout(timeout);
    console.error("ERROR: Fetch failed:", err.message);
    process.exit(1);
  }

  if (!res.ok) {
    console.error(
      `ERROR: Convex returned ${res.status} ${res.statusText}`
    );
    process.exit(1);
  }

  const content = await res.json();
  const outPath = path.join(__dirname, "..", "src", "lib", "build-content.json");
  fs.writeFileSync(outPath, JSON.stringify(content, null, 2));
  console.log(`✓ Content baked into ${outPath}`);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
