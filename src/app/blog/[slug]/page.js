// "use client";

import { getClient } from "../../../lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/queries/getBlogPosts";
// import { motion } from "framer-motion"
import HeroBanner from "@/components/blocks/HeroBanner";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderRichTextWithBreaks from "@/lib/renderRichTextWithBreaks";

export default async function BlogPost({ params }) {
      const { slug } = await params;
      const { data } = await getClient().query({ query: GET_BLOG_POSTS });
      const page = data.blogPostPageCollection.items.find(
        (post) => post.slug === slug
      );
      const formattedDate = new Date(page.postDate).toLocaleString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
            
      if (!page) return <p>Blog post not found.</p>;

      return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-16">
        <main className="flex flex-col gap-8">
            <HeroBanner heroMedia={page.heroImage} mediaHeight={false} />
            <div  className="lg:w-[50vw] md:w-[80vw] sm:w-[100vw] m-auto">
            <div className="text-xs">
                <p>{formattedDate}</p>
                <p>By {page.postAuthor}</p>
            </div>
            {page.blogContent?.json && (
                <div>
                    {renderRichTextWithBreaks(page.blogContent.json)}
                </div>
            )}
            </div>
        </main>
    </div>
      )
    

}