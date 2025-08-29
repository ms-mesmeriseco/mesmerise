#!/usr/bin/env node
/* eslint-disable no-console */
require("dotenv").config({ path: ".env.local" });
const contentful = require("contentful-management");

try {
  require("dotenv").config({ path: ".env.local" });
  console.log("Loaded environment variables from .env.local");
} catch (e) {
  console.error("Failed to load .env.local", e);
}

const {
  CONTENTFUL_MANAGEMENT_TOKEN,
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID = "master",
  TAG_VISIBILITY = "public",
} = process.env;

if (!CONTENTFUL_MANAGEMENT_TOKEN || !NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
  console.error(
    "Please set CONTENTFUL_MANAGEMENT_TOKEN and NEXT_PUBLIC_CONTENTFUL_SPACE_ID in your .env"
  );
  process.exit(1);
}

/**
 * Your taxonomy
 * Feel free to edit or extend.
 */
const TAXONOMY = {
  Strategy: [
    "Business Consulting",
    "Competitor Analysis",
    "Positioning",
    "Interviews & Workshops",
    "Customer Research",
    "Content Strategy",
    "Personas & Archetypes",
    "Conversion Rate Optimisation",
    "Marketing Funnel",
    "Go-to-Market Strategy",
    "Customer Journey Maps",
    "Systems & Processes",
    "Product Development",
  ],
  Branding: [
    "Brand Strategy & Positioning",
    "Tone of Voice",
    "Brand Identity",
    "Logo",
    "Typography",
    "Style Guide",
    "Colour Palette",
    "Creative Direction",
    "Motion Graphics",
  ],
  Website: [
    "Front-end Development",
    "Back-end Development",
    "User Experience",
    "UI Design",
    "CMS Integration",
    "Systems Architecture",
    "E-Commerce",
    "Website Builders",
    "Applications",
    "Accessibility",
    "Performance Testing",
    "Ongoing Support",
    "Security",
    "Hosting & Deployment",
    "Web Design",
    "Prototyping",
    "Search Engine Optimisation",
  ],
  Performance: [
    "Ad creative",
    "Marketing Materials",
    "Paid Media Management",
    "Content Marketing",
    "Local SEO & Geo Targeting",
    "SEO",
    "Customer Lifecycle",
    "Omni-Channel Marketing",
  ],
  Analytics: ["Analytics Setup & Audit", "Web Traffic", "Reporting", "GA4"],
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build a flat list of { id, name } to create.
 * We prefix IDs with the category so you can keep them unique & human-readable.
 * Example: "growth--go-to-market-strategy"
 */
function buildTagsFromTaxonomy(taxonomy) {
  const out = [];
  Object.entries(taxonomy).forEach(([category, tags]) => {
    const categoryId = slugify(category);
    // also create the category tag itself for quick grouping/filtering if you want
    out.push({
      id: categoryId,
      name: category,
    });

    tags.forEach((tagName) => {
      out.push({
        id: `${categoryId}--${slugify(tagName)}`,
        name: tagName,
      });
    });
  });
  return out;
}

async function run() {
  const client = contentful.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  });

  const space = await client.getSpace(NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID);

  const tagsToCreate = buildTagsFromTaxonomy(TAXONOMY);
  console.log(`Preparing to upsert ${tagsToCreate.length} tags...\n`);

  const created = [];
  const skipped = [];
  const failed = [];

  for (const { id, name } of tagsToCreate) {
    try {
      // Try creating
      await env.createTag(id, name, TAG_VISIBILITY);
      console.log(`Created tag: [${id}] ${name}`);
      created.push(id);
    } catch (err) {
      if (err && err.name === "Conflict") {
        console.log(`↷ Skipped (already exists): [${id}] ${name}`);
        skipped.push(id);
      } else {
        console.error(`Failed: [${id}] ${name}`);
        console.error(err?.message || err);
        failed.push(id);
      }
    }
  }

  console.log("\nDone!");
  console.log(`  Created: ${created.length}`);
  console.log(`  Skipped: ${skipped.length}`);
  console.log(`  Failed : ${failed.length}`);
  if (failed.length) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
