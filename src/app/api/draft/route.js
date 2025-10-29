import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const PREVIEW_SECRET = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug"); // e.g. "/blog/my-post"

  if (!secret || secret !== PREVIEW_SECRET || !slug) {
    return new Response("Invalid preview request", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  const path = slug.startsWith("/") ? slug : `/${slug}`;
  redirect(path);
}
