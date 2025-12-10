// src/lib/utils/BlockRenderer.jsx
"use client";

import ListIcons from "@/components/sanity-blocks/ListIcons";
import IconRow from "@/components/sanity-blocks/IconRow";
import AccordionWidget from "@/components/sanity-blocks/Accordion";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

function ensureUniqueKeys(blocks) {
  const seen = new Set();
  return blocks.map((b, index) => {
    const safeKey =
      b._key && !seen.has(b._key) ? b._key : `${b._key || "block"}-${index}`;

    seen.add(safeKey);
    return { ...b, _key: safeKey };
  });
}

export default function BlockRenderer({ block, center }) {
  if (!block) return null;

  const textAlign = center
    ? "m-auto prose max-w-none text-center w-10/12 gap-4 flex flex-col"
    : "prose max-w-none lg:w-12/12 md:w-12/12 sm:w-12/12";

  const widgetAlign = center ? "" : "w-full";

  // 🧩 If we get an array (SingleColumn content, TwoColumn column1/2),
  // treat it as "an array of block docs" and render each one.
  if (Array.isArray(block)) {
    return (
      <>
        {block.map((item, idx) => (
          <BlockRenderer
            key={item?._id || `blk-${idx}`}
            block={item}
            center={center}
          />
        ))}
      </>
    );
  }

  const type = block._type;

  switch (type) {
    // 💬 richText document
    case "richText": {
      const raw = block.content || [];
      if (!raw.length) return null;

      const safe = ensureUniqueKeys(raw);

      return (
        <div className={`[&>p+p]:mt-4 [&>*]:mb-4 ${textAlign}`}>
          <PortableText
            value={safe}
            components={{
              // Block-level stuff (headings, paragraphs)
              block: {
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-semibold mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mb-3">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-medium mb-2">{children}</h4>
                ),
                normal: ({ children }) => (
                  <p className="mb-3 leading-relaxed">{children}</p>
                ),
              },

              // ✅ Inline marks (decorators + annotations)
              marks: {
                // schema.marks.decorators: [{ title: "Strong", value: "strong" }]
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),

                // schema.marks.annotations: { name: "link", ... }
                link: ({ children, value }) => {
                  const href = value?.href || "#";
                  const target = value?.target || "_self";
                  const rel =
                    target === "_blank" ? "noopener noreferrer" : undefined;

                  const isInternal =
                    href.startsWith("/") || href.startsWith("#");

                  const content = (
                    <span className="underline decoration-dotted underline-offset-2 hover:decoration-solid">
                      {children}
                    </span>
                  );

                  // use next/link for internal URLs
                  if (isInternal) {
                    return <Link href={href}>{content}</Link>;
                  }

                  // normal <a> for externals
                  return (
                    <a href={href} target={target} rel={rel}>
                      {content}
                    </a>
                  );
                },

                // schema.marks.annotations: { name: "reference", type: "reference" }
                reference: ({ children, value }) => {
                  // You'll need slug projected in your GROQ for this:
                  // e.g. ...,"slug": slug.current
                  const slug = value?.slug?.current || value?.slug;
                  const docType = value?._type;

                  if (!slug) {
                    return <span>{children}</span>;
                  }

                  // map referenced types to your site routes
                  let href = `/${slug}`;
                  if (docType === "blogPostPage") href = `/blog/${slug}`;
                  if (docType === "landingPage") href = `/landing/${slug}`;
                  if (docType === "projectPage") href = `/work/${slug}`;

                  return (
                    <Link href={href}>
                      <span className="underline underline-offset-2 hover:decoration-solid">
                        {children}
                      </span>
                    </Link>
                  );
                },
              },
            }}
          />
        </div>
      );
    }

    // 🌄 Image doc
    case "contentful_image": {
      const img = block.image;
      if (!img?.url) return null;

      const width = img.dimensions?.width || 1200;
      const height = img.dimensions?.height || 800;

      return (
        <Image
          src={img.url}
          alt={block.entryTitle || ""}
          width={width}
          height={height}
          className="w-full h-auto shadow rounded-xs"
        />
      );
    }

    // 🎥 Video doc
    case "video": {
      const videoUrl = block.videoFile || null;
      if (!videoUrl) return null;

      return (
        <video
          src={videoUrl}
          controls
          className="w-full md:w-1/2 h-auto shadow"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    case "listIcons": {
      const items = block.listItems || [];
      if (!items.length) return null;

      return (
        <div className={`m-auto ${widgetAlign}`}>
          <ListIcons items={items} />
        </div>
      );
    }

    // 💯 iconRow (if nested)
    case "iconRow": {
      const rawIconItems = block.iconItems || [];

      const iconItems = rawIconItems.map((item) => ({
        ...item,
        icon:
          typeof item.icon === "string"
            ? { url: item.icon }
            : item.icon || null,
      }));

      return (
        <IconRow
          titleText={block.titleText}
          iconItems={iconItems}
          displayTwo={block.displayTwo}
        />
      );
    }

    case "accordionWidget":
      return (
        <AccordionWidget
          icon={block.icon} // URL string
          accordionItems={block.accordionItems || []}
        />
      );

    default:
      return null;
  }
}
