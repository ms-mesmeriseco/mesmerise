"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import ServiceTags from "../services/ServiceTags";
import { motion, AnimatePresence } from "framer-motion";

/** ---------------- Allowlist of filterable tags ----------------
 * Left side = UI label (what users click)
 * Right side = one or more underlying Contentful tag names to match.
 * Add synonyms/variants to the arrays as needed.
 */
const FILTER_MAP = {
  "Web Design": ["Web Design"],
  "Copywriting": ["Copywriting"],
  "Search Engine Optimisation": ["Search Engine Optimisation"],
  "Local SEO / GEO Targeting": [
    "Local SEO & Geo Targeting",
    "Local SEO / GEO Targeting",
    "Local SEO / Geo Targeting"
  ],
  "Omni Channel Marketing": ["Omni-Channel Marketing", "Omni Channel Marketing"],
  "Branding": ["Branding"],
  "E-Commerce": ["E-Commerce", "E - Commerce", "Ecommerce"],
  "Web Development": [
    "Front-end Development",
    "Back-end Development",
    "CMS Integration"
  ],
};

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function ProjectNavigationList({ activeTag = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState(activeTag);
  const [noMatchMessage, setNoMatchMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
        setProjects(data.projectPageCollection.items || []);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchProjects();
  }, []);

  // Build a set of present (normalized) tag names across all projects
  const presentTagSet = useMemo(() => {
    const set = new Set();
    projects.forEach((p) =>
      p.contentfulMetadata?.tags?.forEach((t) => set.add(normalize(t?.name)))
    );
    return set;
  }, [projects]);

  // Only show allowed labels that actually exist in data
  const availableFilterLabels = useMemo(() => {
    return Object.keys(FILTER_MAP).filter((label) =>
      (FILTER_MAP[label] || []).some((canonical) =>
        presentTagSet.has(normalize(canonical))
      )
    );
  }, [presentTagSet]);

  // Sync tag with URL (canonicalize to the UI label we store)
  useEffect(() => {
    const urlTag = searchParams.get("tag");
    const fromUrl =
      Object.keys(FILTER_MAP).find((k) => normalize(k) === normalize(urlTag)) ||
      null;

    const fromProp =
      Object.keys(FILTER_MAP).find((k) => normalize(k) === normalize(activeTag)) ||
      null;

    setSelectedTag(fromUrl ?? fromProp ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeTag]);

  // Filter projects using the selected UI label mapped to canonical tag names
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    const candidates = new Set(
      (FILTER_MAP[selectedTag] || [selectedTag]).map((n) => normalize(n))
    );
    return projects.filter((p) =>
      p.contentfulMetadata?.tags?.some((t) => candidates.has(normalize(t?.name)))
    );
  }, [projects, selectedTag]);

  // No match logic
  useEffect(() => {
    if (!isLoaded) return;
    if (selectedTag && filteredProjects.length === 0) {
      setNoMatchMessage(`No projects tagged "${selectedTag}".`);
    } else {
      setNoMatchMessage(null);
    }
  }, [isLoaded, selectedTag, filteredProjects.length]);

  const handleSelectTag = (label) => {
    setSelectedTag(label);
    router.push(label ? `/work?tag=${encodeURIComponent(label)}` : "/work");
  };

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };
  const item = {
    hidden: { opacity: 0, transition: { staggerChildren: 0.0035 } },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)] nav-list">
      {/* Tag Filter Buttons (from allowlist only) */}
      {isLoaded && availableFilterLabels.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2 mb-4 text-sm"
        >
          <motion.button
            variants={item}
            className={`px-4 py-1 rounded-lg ${
              !selectedTag
                ? "bg-[var(--mesm-yellow)] text-[var(--background)]"
                : "bg-[var(--mesm-grey)] text-gray-800 cursor-pointer"
            }`}
            onClick={() => handleSelectTag(null)}
          >
            All
          </motion.button>

          {availableFilterLabels.map((label) => (
            <motion.button
              key={label}
              variants={item}
              className={`px-4 py-1 rounded-lg ${
                selectedTag === label
                  ? "bg-[var(--mesm-blue)] text-[var(--background)]"
                  : "bg-[var(--mesm-grey-dk)] text-[var(--mesm-grey)] cursor-pointer"
              }`}
              onClick={() => handleSelectTag(label)}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
          <div className="h-6 w-28 bg-gray-300 rounded"></div>
        </div>
      )}

      {noMatchMessage && isLoaded && (
        <p className="mb-4 text-sm text-gray-500">{noMatchMessage}</p>
      )}

      {/* Projects */}
      <AnimatePresence>
        {isLoaded &&
          filteredProjects.map((project) => (
            <motion.div
              key={project.slug}
              layout
              variants={item}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <Link href={`/work/${project.slug}`}>
                <div className="border-b border-[var(--mesm-grey)] py-[var(--global-margin-xs)] cursor-pointer hover:opacity-80 transition duration-100">
                  {/* Row 1: Title + Year */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[var(--global-margin-md)]">
                    <h3>{project.projectTitle}</h3>
                    <h3>
                      {new Date(project.projectDate).toLocaleDateString("en-GB", {
                        year: "numeric",
                      })}
                    </h3>
                  </div>

                  {/* Row 2: Tags (only show allowed filter labels, up to 8) */}
<div className="mt-2 md:mt-0 pointer-events-none">
  {(() => {
    const projectNames = new Set(
      (project.contentfulMetadata?.tags || [])
        .map(t => t?.name)
        .filter(Boolean)
        .map(s => s.toLowerCase().trim())
    );

    // Use the same order as the filter buttons (availableFilterLabels)
    const labelsForProject = availableFilterLabels.filter(label =>
      (FILTER_MAP[label] || []).some(alias =>
        projectNames.has((alias || "").toLowerCase().trim())
      )
    );

    const firstEight = labelsForProject.slice(0, 8);
    const extra = Math.max(0, labelsForProject.length - firstEight.length);

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <ServiceTags items={firstEight} />
        {extra > 0 && (
          <span className="text-xs opacity-70">+{extra} more</span>
        )}
      </div>
    );
  })()}
</div>

                </div>
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>
    </section>
  );
}
 