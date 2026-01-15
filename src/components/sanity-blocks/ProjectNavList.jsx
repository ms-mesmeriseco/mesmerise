"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ServiceTags from "../services/ServiceTags";
import Image from "next/image";

const FILTER_MAP = {
  Strategy: [
    "Strategy",
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
    "Branding",
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
    "Front-end development",
    "Website",
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
    "Performance",
    "Ad creative",
    "Marketing Materials",
    "Paid Media Management",
    "Content Marketing",
    "Local SEO & Geo Targeting",
    "SEO",
    "Customer Lifecycle",
    "Omni-Channel Marketing",
  ],
  Analytics: [
    "Analytics",
    "Analytics Setup & Audit",
    "Web Traffic",
    "Reporting",
    "GA4",
  ],
};

const normalize = (s) =>
  decodeURIComponent((s ?? "").toString())
    .trim()
    .toLowerCase();

// ---- Sanity tag helpers ----
const getTagTitle = (t) =>
  typeof t === "string" ? t : t?.title || t?.name || "";
const getTagSlug = (t) => {
  if (typeof t === "string") return "";
  // Sanity slug shape is usually { current: "my-slug" }
  return t?.slug?.current || t?.slug || "";
};
const tagTokens = (t) => {
  const title = normalize(getTagTitle(t));
  const slug = normalize(getTagSlug(t));
  return [title, slug].filter(Boolean);
};

export default function ProjectNavigationList({
  activeTag = null,
  projects = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedRaw, setSelectedRaw] = useState(null);
  const [noMatchMessage, setNoMatchMessage] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Build a map that lets “Strategy”, or any alias, map to the label “Strategy”
  const aliasToLabel = useMemo(() => {
    const map = new Map();
    Object.keys(FILTER_MAP).forEach((label) => {
      map.set(normalize(label), label);
      (FILTER_MAP[label] || []).forEach((alias) =>
        map.set(normalize(alias), label)
      );
    });
    return map;
  }, []);

  // Read URL tag + decide whether it maps to a quick-filter label or a raw tag/slug
  useEffect(() => {
    const urlTag = searchParams.get("tag") ?? activeTag;
    const clean = urlTag ? normalize(urlTag) : "";

    if (!clean) {
      setSelectedLabel(null);
      setSelectedRaw(null);
      return;
    }

    const mapped = aliasToLabel.get(clean);
    if (mapped) {
      setSelectedLabel(mapped);
      setSelectedRaw(null);
    } else {
      // raw could be a Sanity slug like "performance" or an actual tag title
      setSelectedLabel(null);
      setSelectedRaw(urlTag);
    }
  }, [searchParams, activeTag, aliasToLabel]);

  // Build a set of all tag tokens present in your dataset (titles + slugs)
  const presentTagSet = useMemo(() => {
    const set = new Set();
    for (const p of projects) {
      for (const t of p.serviceTags || []) {
        for (const token of tagTokens(t)) set.add(token);
      }
    }
    return set;
  }, [projects]);

  // Only show quick-filter buttons if at least one alias actually exists in your data
  const availableFilterLabels = useMemo(() => {
    return Object.keys(FILTER_MAP).filter((label) =>
      (FILTER_MAP[label] || []).some((alias) =>
        presentTagSet.has(normalize(alias))
      )
    );
  }, [presentTagSet]);

  // Compute candidate tokens based on selection:
  // - If selectedLabel, candidates are that label + aliases (titles)
  // - If selectedRaw, candidates is the raw token (slug or title)
  const candidateTokens = useMemo(() => {
    if (!selectedLabel && !selectedRaw) return null;

    if (selectedLabel) {
      const aliases = FILTER_MAP[selectedLabel] || [];
      return new Set([selectedLabel, ...aliases].map(normalize));
    }

    return new Set([normalize(selectedRaw)]);
  }, [selectedLabel, selectedRaw]);

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) => new Date(b.projectDate) - new Date(a.projectDate)
    );

    if (!candidateTokens) return sorted;

    return sorted.filter((p) =>
      (p.serviceTags || []).some((t) => {
        const tokens = tagTokens(t);
        return tokens.some((tok) => candidateTokens.has(tok));
      })
    );
  }, [projects, candidateTokens]);

  useEffect(() => {
    const display = selectedLabel || selectedRaw;
    if (display && filteredProjects.length === 0) {
      setNoMatchMessage(`No projects tagged "${display}".`);
    } else {
      setNoMatchMessage(null);
    }
  }, [selectedLabel, selectedRaw, filteredProjects.length]);

  const handleSelectLabel = (label) => {
    setSelectedLabel(label);
    setSelectedRaw(null);
    router.push(label ? `/work?tag=${encodeURIComponent(label)}` : "/work");
  };

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)] nav-list">
      {/* Raw filter chip */}
      {selectedRaw && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-lg bg-[var(--mesm-grey)] text-gray-800">
            Filtering by “{selectedRaw}”
            <button
              onClick={() => handleSelectLabel(null)}
              className="underline decoration-dotted"
              type="button"
            >
              clear
            </button>
          </span>
        </div>
      )}

      {/* Quick filters */}
      {availableFilterLabels.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-1 mb-4 text-md"
        >
          <motion.button
            variants={item}
            className={`px-3 py-0 rounded-xl h-full hover:bg-[var(--mesm-yellow)] ${
              !selectedLabel && !selectedRaw
                ? "bg-[var(--mesm-yellow)] text-[var(--background)]"
                : "bg-[var(--mesm-grey)] text-gray-800 cursor-pointer"
            }`}
            onClick={() => handleSelectLabel(null)}
            type="button"
          >
            All
          </motion.button>

          {availableFilterLabels.map((label) => (
            <motion.button
              key={label}
              variants={item}
              className={`px-3 py-0 rounded-xl duration-100 h-full hover:bg-[var(--mesm-red)] hover:text-[var(--background)] ${
                selectedLabel === label
                  ? "bg-[var(--mesm-red)] text-[var(--background)]"
                  : "bg-[var(--mesm-grey-dk)] text-[var(--mesm-grey)] cursor-pointer"
              }`}
              onClick={() => handleSelectLabel(label)}
              type="button"
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {noMatchMessage && (
        <p className="mb-4 text-sm text-gray-500">{noMatchMessage}</p>
      )}

      {/* Projects */}
      <AnimatePresence>
        {filteredProjects.map((project) => (
          <motion.div
            key={project._id || project.slug}
            layout
            variants={item}
            initial="hidden"
            animate="show"
            exit="hidden"
            whileHover={{ x: 2 }}
            onMouseEnter={() => setHoveredProject(project)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <Link href={`/work/${project.slug}`}>
              <div className="border-b border-[var(--mesm-grey)] py-[var(--global-margin-xs)] cursor-pointer hover:opacity-80 transition duration-100">
                <div className="flex flex-row md:flex-row justify-between items-center my-2">
                  <span className="md:text-5xl">{project.projectTitle}</span>
                  <span className="md:text-5xl">
                    {project.projectDate
                      ? new Date(project.projectDate).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                          }
                        )
                      : ""}
                  </span>
                </div>

                {/* Visible per-project tags */}
                <div className="mt-0 md:mt-0 pointer-events-none">
                  {(() => {
                    const tags = (project.serviceTags || [])
                      .map((t) => getTagTitle(t))
                      .filter(Boolean);

                    const visible = tags.slice(0, 3);
                    const hasMore = tags.length > 2;

                    return (
                      <ServiceTags
                        items={hasMore ? [...visible, "..."] : visible}
                        large={false}
                        clickable={false}
                        highlight={true}
                      />
                    );
                  })()}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hover preview (desktop only) */}
      <div className="hidden md:block">
        <AnimatePresence>
          {hoveredProject?.heroMedia?.url && (
            <motion.div
              key={hoveredProject._id || hoveredProject.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden rounded-xl border border-[var(--mesm-grey-dk)] bg-[var(--background)] shadow-lg"
              style={{ aspectRatio: "3 / 2" }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={hoveredProject.heroMedia.url}
                  alt={
                    hoveredProject.heroMedia.alt ||
                    hoveredProject.projectTitle ||
                    "Project preview"
                  }
                  fill
                  sizes="360px"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
