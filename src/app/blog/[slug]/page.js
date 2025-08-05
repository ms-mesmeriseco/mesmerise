import { getClient } from "../../../lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
// import { motion } from "framer-motion"
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderRichTextWithBreaks from "@/lib/utils/renderRichTextWithBreaks";
import Image from "next/image";
import BlogTOC from "@/components/blog/BlogTOC";
import ExpandingCard from "@/components/ui/ExpandingCard";
import ListCard from "@/components/ui/ListCard";

// function handleAnchorClick(e, id) {
//   e.preventDefault();
//   const headerHeight =
//     parseInt(
//       getComputedStyle(document.documentElement).getPropertyValue(
//         "--header-height"
//       )
//     ) || 80; // fallback to 80px
//   const el = document.getElementById(id);
//   if (el) {
//     const y =
//       el.getBoundingClientRect().top + window.scrollY - headerHeight - 16; // 16px extra spacing
//     window.scrollTo({ top: y, behavior: "smooth" });
//   }
// }

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
  const entryMap = {};
  if (page.blogContent?.links?.entries?.block) {
    page.blogContent.links.entries.block.forEach((entry) => {
      entryMap[entry.sys.id] = entry;
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
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entryId = node.data.target.sys.id;
        const entry = entryMap[entryId];
        if (!entry) return null;

        switch (entry.__typename) {
          case "AccordionItem":
            return (
              <ExpandingCard
                title={entry.entryTitle}
                expandedContent={documentToReactComponents(
                  entry.textContent?.json
                )}
              />
            );

          case "ListIconItem":
            return (
              <ListCard icon={entry.icon}>
                {documentToReactComponents(entry.textContent?.json)}
              </ListCard>
            );

          default:
            return null;
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-0">
      {/* Hero Image */}
      {/* <div className="w-full aspect-[16/5] rounded-4xl h-[60vh] overflow-hidden mb-0 p-[var(--global-margin-sm)]">
        <img
          src={page.heroImage?.url || ""}
          alt={page.heroImage?.title || ""}
          className="w-full h-full object-cover rounded-3xl"
        />
      </div> */}

      {/* Main Content */}

      <main className="flex flex-col md:flex-row md:gap-8 gap-0 rounded-3xl w-full mx-auto px-4 pb-[30vh]">
        {h3Anchors?.length > 0 && (
          <aside
            className="
        hidden md:block
        md:sticky
        md:top-[calc(var(--header-height)+16px)]
        md:h-[calc(100vh-var(--header-height)-32px)]
        md:w-64
        self-start
        z-20
      "
          >
            <BlogTOC anchors={h3Anchors} />
          </aside>
        )}

        <article className="max-w-xl w-full flex flex-col gap-2">
          <h1 className="text-sm">{page.postHeading}</h1>
          <span className="text-sm text-[var(--mesm-l-grey)]">
            {formattedDate}
            <br />
            By {page.postAuthor}
          </span>

          <br />
          {page.blogContent?.json && (
            <div className="[&>p+p]:mt-4 flex flex-col gap-4">
              {renderRichTextWithBreaks(page.blogContent.json, assetMap, {
                blog: true,
                entryMap,
              })}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
