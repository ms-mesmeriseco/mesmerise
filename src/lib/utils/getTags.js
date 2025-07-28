import { createClient } from "contentful";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export async function getAllTags() {
  const response = await client.getTags(); // Contentful Tag API
  return response.items.map((tag) => ({
    id: tag.sys.id,
    name: tag.name,
  }));
}
