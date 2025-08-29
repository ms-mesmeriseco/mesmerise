#!/usr/bin/env node
/* eslint-disable no-console */
require("dotenv").config({ path: ".env.local" });
const contentful = require("contentful-management");

const {
  CONTENTFUL_MANAGEMENT_TOKEN,
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID = "master",
} = process.env;

if (!CONTENTFUL_MANAGEMENT_TOKEN || !NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
  console.error("Missing env vars");
  process.exit(1);
}

async function paged(fn, opts = {}) {
  const out = [];
  let skip = 0;
  const limit = 100;
  while (true) {
    const page = await fn({ ...opts, skip, limit });
    out.push(...page.items);
    if (skip + limit >= page.total) break;
    skip += limit;
  }
  return out;
}

async function removeTagFromItems(env, tagId) {
  // Entries
  const entries = await paged(env.getEntries.bind(env), {
    "metadata.tags.sys.id[in]": tagId,
  });
  for (const entry of entries) {
    entry.metadata.tags = (entry.metadata.tags || []).filter(
      (t) => t.sys.id !== tagId
    );
    const updated = await entry.update();
    if (entry.isPublished()) await updated.publish();
    console.log(`  • Removed from entry ${entry.sys.id}`);
  }

  // Assets
  const assets = await paged(env.getAssets.bind(env), {
    "metadata.tags.sys.id[in]": tagId,
  });
  for (const asset of assets) {
    asset.metadata.tags = (asset.metadata.tags || []).filter(
      (t) => t.sys.id !== tagId
    );
    const updated = await asset.update();
    if (asset.isPublished()) await updated.publish();
    console.log(`  • Removed from asset ${asset.sys.id}`);
  }
}

async function run() {
  const client = contentful.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  });
  const space = await client.getSpace(NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID);

  const allTags = await paged(env.getTags.bind(env));
  console.log(`Found ${allTags.length} tags to delete…`);

  for (const tag of allTags) {
    const tagId = tag.sys.id;
    console.log(`Deleting [${tagId}] ${tag.name}`);

    await removeTagFromItems(env, tagId);
    const fresh = await env.getTag(tagId);
    await fresh.delete();
    console.log(`  ✓ Deleted ${tagId}`);
  }

  console.log("All tags deleted.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
