// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
// import { motion } from "framer-motion"
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import BlogTOC from "@/components/blog/BlogTOC";

function handleAnchorClick(e, id) {
  e.preventDefault();
  const headerHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      )
    ) || 80; // fallback to 80px
  const el = document.getElementById(id);
  if (el) {
    const y =
      el.getBoundingClientRect().top + window.scrollY - headerHeight - 16; // 16px extra spacing
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  const { data } = await getClient().query({ query: GET_BLOG_POSTS });
  const page = data.blogPostPageCollection.items.find(
    (post) => post.slug === slug
  );

  if (!page) return <p>Blog post not found.</p>;

  // Build asset map for embedded assets
  const assetMap = {};
  if (page.blogContent?.links?.assets?.block) {
    page.blogContent.links.assets.block.forEach((asset) => {
      assetMap[asset.sys.id] = asset;
    });
  }
  function getH3Anchors(json) {
    const anchors = [];
    if (!json?.content) return anchors;
    json.content.forEach((node, idx) => {
      if (node.nodeType === "heading-3") {
        const text =
          node.content?.map((c) => c.value).join("") || `Section ${idx}`;
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        anchors.push({ text, id });
      }
    });
    return anchors;
  }

  const h3Anchors = getH3Anchors(page.blogContent?.json);

  const renderOptions = {
    renderNode: {
      [BLOCKS.HEADING_3]: (node, children) => {
        const text = node.content?.map((c) => c.value).join("") || "";
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        return <h3 id={id}>{children}</h3>;
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];
        if (!asset) return null;
        const { url, title, description, width, height, contentType } = asset;

        if (contentType && contentType.startsWith("image/")) {
          return (
            <div className="my-6">
              <Image
                src={`${url}`}
                alt={title || description || "Embedded image"}
                width={width}
                height={height}
                className="w-full h-auto rounded-xl"
              />
            </div>
          );
        }

        if (contentType && contentType.startsWith("video/")) {
          return (
            <div className="my-6">
              <video
                controls
                width={width}
                height={height}
                className="w-full h-auto rounded-x max-h-[80vh] w-auto"
                style={{ maxHeight: "80vh" }}
              >
                <source src={`${url}`} type={contentType} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }

        // fallback for other asset types
        return null;
      },
    },
  };

  const formattedDate = new Date(page.postDate).toLocaleString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="wrapper flex flex-col items-center max-w-3xl justify-center min-h-screen gap-0">
      {/* Hero Image */}
      <div className="w-full aspect-[16/5] rounded-3xl overflow-hidden mb-0">
        <img
          src={page.heroImage?.url || ""}
          alt={page.heroImage?.title || ""}
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>

      <BlogTOC anchors={h3Anchors} />

      {/* Main Content */}
      <main className="flex flex-col gap-8 rounded-3xl w-full max-w-3xl mx-auto px-4">
        <div>
          <h3>{page.postHeading}</h3>
          <span className="text-sm">
            {formattedDate}
            <br />
            By {page.postAuthor}
          </span>
        </div>
        <br />
        {page.blogContent?.json && (
          <div>
            {documentToReactComponents(page.blogContent.json, renderOptions)}
          </div>
        )}
      </main>
    </div>
  );
}
