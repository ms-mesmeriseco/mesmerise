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

// quick filter labels -> canonical slugs used in the URL
const LABEL_TO_SLUG = {
  Strategy: "strategy",
  Branding: "branding",
  Website: "website",
  Performance: "performance",
  Analytics: "analytics",
};

const normalize = (s) =>
  decodeURIComponent((s ?? "").toString())
    .trim()
    .toLowerCase();

// assumes dereferenced tags in shape: { title: string, slug: string }
const getTagTitle = (t) => (typeof t === "string" ? t : t?.title || "");
const getTagSlug = (t) => (typeof t === "string" ? "" : t?.slug || "");

export default function ProjectNavigationList({
  activeTag = null,
  projects = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedLabel, setSelectedLabel] = useState(null); // one of FILTER_MAP keys
  const [selectedRaw, setSelectedRaw] = useState(null); // a real tag slug/title
  const [hoveredProject, setHoveredProject] = useState(null);

  // alias/title -> label (for quick filters)
  const aliasToLabel = useMemo(() => {
    const map = new Map();
    for (const label of Object.keys(FILTER_MAP)) {
      map.set(normalize(label), label);
      for (const alias of FILTER_MAP[label] || [])
        map.set(normalize(alias), label);
    }
    return map;
  }, []);

  // which quick-filter labels are actually present in returned projects?
  const availableFilterLabels = useMemo(() => {
    const present = new Set();

    for (const p of projects) {
      for (const t of p.serviceTags || []) {
        const title = normalize(getTagTitle(t));
        const slug = normalize(getTagSlug(t));
        if (title) present.add(title);
        if (slug) present.add(slug);
      }
    }

    return Object.keys(FILTER_MAP).filter((label) => {
      const labelSlug = normalize(LABEL_TO_SLUG[label]);
      if (labelSlug && present.has(labelSlug)) return true;

      // show label if any alias exists as a title (or (rarely) slug)
      return (FILTER_MAP[label] || []).some((alias) =>
        present.has(normalize(alias)),
      );
    });
  }, [projects]);

  // sync selected state from URL (?tag=) or activeTag prop
  useEffect(() => {
    const urlTag = searchParams.get("tag") ?? activeTag;
    const clean = urlTag ? normalize(urlTag) : "";

    if (!clean) {
      setSelectedLabel(null);
      setSelectedRaw(null);
      return;
    }

    // if tag matches one of our canonical quick-filter slugs, select that label
    const labelFromSlug = Object.entries(LABEL_TO_SLUG).find(
      ([, slug]) => normalize(slug) === clean,
    )?.[0];

    if (labelFromSlug) {
      setSelectedLabel(labelFromSlug);
      setSelectedRaw(null);
      return;
    }

    // if tag matches a label/alias, select that label
    const mapped = aliasToLabel.get(clean);
    if (mapped) {
      setSelectedLabel(mapped);
      setSelectedRaw(null);
      return;
    }

    // otherwise treat as a real tag slug/title
    setSelectedLabel(null);
    setSelectedRaw(urlTag);
  }, [searchParams, activeTag, aliasToLabel]);

  const candidateTokens = useMemo(() => {
    if (!selectedLabel && !selectedRaw) return null;

    if (selectedLabel) {
      const aliases = FILTER_MAP[selectedLabel] || [];
      const labelSlug = LABEL_TO_SLUG[selectedLabel];
      return new Set(
        [selectedLabel, labelSlug, ...aliases].map(normalize).filter(Boolean),
      );
    }

    return new Set([normalize(selectedRaw)]);
  }, [selectedLabel, selectedRaw]);

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) => new Date(b.projectDate) - new Date(a.projectDate),
    );

    if (!candidateTokens) return sorted;

    return sorted.filter((p) =>
      (p.serviceTags || []).some((t) => {
        const title = normalize(getTagTitle(t));
        const slug = normalize(getTagSlug(t));
        return (
          (slug && candidateTokens.has(slug)) ||
          (title && candidateTokens.has(title))
        );
      }),
    );
  }, [projects, candidateTokens]);

  const displayFilterText = useMemo(() => {
    if (selectedLabel) return selectedLabel;
    if (!selectedRaw) return null;

    const clean = normalize(selectedRaw);
    return (
      Object.entries(LABEL_TO_SLUG).find(
        ([, slug]) => normalize(slug) === clean,
      )?.[0] ?? selectedRaw
    );
  }, [selectedLabel, selectedRaw]);

  const noMatchMessage =
    displayFilterText && filteredProjects.length === 0
      ? `No projects tagged "${displayFilterText}".`
      : null;

  const handleSelectLabel = (label) => {
    setSelectedLabel(label);
    setSelectedRaw(null);

    if (!label) {
      router.push("/work");
      return;
    }

    const slug = LABEL_TO_SLUG[label] || label;
    router.push(`/work?tag=${encodeURIComponent(slug)}`);
  };

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };
  const item = { hidden: { opacity: 0 }, show: { opacity: 1 } };

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)] nav-list">
      {/* Raw filter chip (for non-quick-filter tags/slugs) */}
      {selectedRaw && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-lg bg-[var(--mesm-grey)] text-gray-800">
            Filtering by “{displayFilterText}”
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
                          },
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
              className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden bg-[var(--background)] shadow-lg"
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
