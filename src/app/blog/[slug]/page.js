// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
// import { motion } from "framer-motion"
import HeroBanner from "@/components/cms-blocks/HeroBanner";
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

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

  const renderOptions = {
    renderNode: {
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
    <div className="wrapper flex flex-col items-center justify-center min-h-screen gap-16">
      <main className="flex flex-col gap-8 rounded-3xl">
        <HeroBanner heroMedia={page.heroImage} mediaHeight={false} />
        <div className="lg:w-[720px] md:w-full sm:w-full m-auto">
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
        </div>
      </main>
    </div>
  );
}
