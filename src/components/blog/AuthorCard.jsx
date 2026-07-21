import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

// --- Author card wired to Sanity ---
// normalizePortableTextKeys and portableTextComponents are passed in from the
// parent page so this component doesn't need its own copy of that logic.
const EXCLUDED_TAGS = ["Show Blog In Footer"];

export default function AuthorCard({
  author,
  tags = [],
  date,
  readingTime,
  showBio = true,
  showBlogDetails = false,
  showBorder = true,
  showPadding = true,
  normalizePortableTextKeys,
  portableTextComponents,
}) {
  if (!author) return null;
  const avatarUrl = author.authorAvatar?.url;
  const authorBio = normalizePortableTextKeys(author.authorBio);
  const visibleTags = tags.filter((tag) => !EXCLUDED_TAGS.includes(tag.title));

  return (
    <section
      className={[
        "mt-12 rounded-md flex flex-col gap-4",
        showBorder ? "border border-[var(--mesm-grey-dk)]" : "",
        showPadding ? "p-6" : "",
      ].join(" ")}
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Top: avatar, name, date/reading time */}
      <div className="flex items-start gap-4 pb-4 border-b border-[var(--mesm-grey-dk)]">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={`Avatar of ${author.name ?? "author"}`}
            width={96}
            height={96}
            className="rounded-full shrink-0 w-14 h-14 object-cover ring-1 ring-[var(--mesm-grey-dk)]"
          />
        )}
        {author?.name && (
          <div className="flex flex-col">
            <div className="flex items-center text-md text-[var(--mesm-l-grey)] font-400">
              {author.name}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-2 text-sm text-[var(--mesm-l-grey)]/80 font-400">
                {author.role}
              </span>
              <span aria-hidden="true">·</span>
              {author?.linkedin && (
                <span className="flex  items-center gap-2 text-sm text-[var(--mesm-blue)] font-400 underline hover:opacity-60 opacity-100 duration-250">
                  <a target="_blank" href={author.linkedin}>
                    LinkedIn
                  </a>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Bio */}
      {showBio && authorBio && (
        <div className="prose max-w-none text-[var(--foreground)]">
          <PortableText value={authorBio} components={portableTextComponents} />
        </div>
      )}
      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibleTags.map((tag) => (
            <Link
              key={tag._id}
              href={`/blog?tag=${tag.slug}`}
              className="px-3 py-1 rounded-lg text-sm transition whitespace-nowrap bg-[var(--mesm-red)] text-[var(--background)] hover:bg-[var(--mesm-grey)] hover:text-[var(--background)]"
            >
              {tag.title}
            </Link>
          ))}
        </div>
      )}

      {/* Date / reading time (currently unused — left commented in original) */}
      {showBlogDetails && (
        <div className="flex flex-col gap-1">
          {(date || readingTime) && (
            <div className="flex items-center gap-2 text-sm text-[var(--mesm-l-grey)] font-light">
              {date && <span>{date}</span>}
              {date && readingTime && <span aria-hidden="true">·</span>}
              {readingTime && <span>{readingTime}</span>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
