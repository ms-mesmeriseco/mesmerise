"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * TeamBlock
 * @param {Array} team - [{ id, name, title, photo: { url, width, height, alt? }, href? }]
 * @param {string} heading - Optional section heading
 */
export default function TeamBlock({ team = [], heading = "The Team" }) {
  if (!team?.length) return null;

  return (
    <section className="py-10 md:py-14">
      {/* Optional heading */}
      {heading ? <h2 className="page-title-medium ">{heading}</h2> : null}

      <ul
        className="
          grid gap-2
          grid-cols-2 lg:grid-cols-4
          border-y-1 border-[var(--mesm-grey-dk)] py-4
        "
      >
        {team.map((person, idx) => {
          const key = person.id || `${person.name}-${idx}`;
          const alt =
            person?.photo?.alt ||
            `${person?.name || "Team member"} — ${person?.title || ""}`.trim();

          const CardWrapper = person.href ? "a" : "div";
          const wrapperProps = person.href
            ? { href: person.href, target: "_self", rel: "noopener" }
            : {};

          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="no-list"
            >
              <CardWrapper
                {...wrapperProps}
                className="
                  group block bg-black/10
                  overflow-hidden shadow-sm hover:shadow-md transition-shadow
                "
              >
                {/* Image */}
                <div className="relative aspect-[4/6] w-full overflow-hidden">
                  {person?.photo?.url ? (
                    <Image
                      src={person.photo.url}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="focus:outline-none
                  ring-1 ring-[var(--mesm-grey-dk)] rounded-lg object-cover will-change-transform transition-transform duration-300"
                      priority={idx < 2 ? false : undefined}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-white/40">
                      <span className="text-sm">Photo coming soon</span>
                    </div>
                  )}

                  {/* Subtle top gradient to match site aesthetic */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-black/0 to-black/0" />
                </div>

                {/* Caption */}
                <div className="py-4">
                  <p className="text-base md:text-lg text-white leading-tight p2">
                    {person.name || "Unnamed"}
                  </p>
                  <h5 className="mt-1 text-sm text-white/60">
                    {person.title || "—"}
                  </h5>
                </div>
              </CardWrapper>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
