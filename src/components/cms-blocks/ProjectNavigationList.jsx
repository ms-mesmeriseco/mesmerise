"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import ServiceTags from "../services/ServiceTags";
import { motion, AnimatePresence } from "framer-motion";

/** ---------------- Quick-filter allowlist ----------------
 * UI label -> one or more underlying Contentful tag names (aliases)
 */
const FILTER_MAP = {
  "Web design": ["Web Design"],
  Copywriting: ["Copywriting"],
  "Search Engine Optimisation": ["Search Engine Optimisation"],
  "Local SEO / GEO Targeting": [
    "Local SEO & Geo Targeting",
    "Local SEO / GEO Targeting",
    "Local SEO / Geo Targeting",
  ],
  "Omni Channel Marketing": [
    "Omni-Channel Marketing",
    "Omni Channel Marketing",
  ],
  Branding: ["Branding"],
  "E - Commerce": ["E-Commerce", "E - Commerce", "Ecommerce"],
  "web development": [
    "Front-end Development",
    "Back-end Development",
    "CMS Integration",
  ],
};

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function ProjectNavigationList({ activeTag = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState([]);
  // If selection matches a quick-filter label, we store it here:
  const [selectedLabel, setSelectedLabel] = useState(null);
  // If selection is a raw/original tag not in quick filters, store here:
  const [selectedRaw, setSelectedRaw] = useState(null);

  const [noMatchMessage, setNoMatchMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Build alias -> label map (includes labels themselves)
  const aliasToLabel = useMemo(() => {
    const map = new Map();
    Object.keys(FILTER_MAP).forEach((label) => {
      map.set(normalize(label), label);
      (FILTER_MAP[label] || []).forEach((alias) => {
        map.set(normalize(alias), label);
      });
    });
    return map;
  }, []);

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

  // Present tags across all projects (normalized)
  const presentTagSet = useMemo(() => {
    const set = new Set();
    projects.forEach((p) =>
      p.contentfulMetadata?.tags?.forEach((t) => set.add(normalize(t?.name)))
    );
    return set;
  }, [projects]);

  // Only render quick-filter buttons that actually appear in data
  const availableFilterLabels = useMemo(() => {
    return Object.keys(FILTER_MAP).filter((label) =>
      (FILTER_MAP[label] || []).some((alias) =>
        presentTagSet.has(normalize(alias))
      )
    );
  }, [presentTagSet]);

  // Sync selection from URL or prop (accept ANY tag; map to label if possible)
  useEffect(() => {
    const urlTag = searchParams.get("tag") ?? activeTag;
    if (urlTag) {
      const mapped = aliasToLabel.get(normalize(urlTag));
      if (mapped) {
        setSelectedLabel(mapped);
        setSelectedRaw(null);
      } else {
        setSelectedLabel(null);
        setSelectedRaw(urlTag);
      }
    } else {
      setSelectedLabel(null);
      setSelectedRaw(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeTag, aliasToLabel]);

  // Compute candidates for filtering
  const filteredProjects = useMemo(() => {
    if (!selectedLabel && !selectedRaw) return projects;

    let candidates;
    if (selectedLabel) {
      candidates = new Set(
        (FILTER_MAP[selectedLabel] || [selectedLabel]).map((n) => normalize(n))
      );
    } else {
      candidates = new Set([normalize(selectedRaw)]);
    }

    return projects.filter((p) =>
      p.contentfulMetadata?.tags?.some((t) =>
        candidates.has(normalize(t?.name))
      )
    );
  }, [projects, selectedLabel, selectedRaw]);

  // No match logic
  useEffect(() => {
    if (!isLoaded) return;
    const display = selectedLabel || selectedRaw;
    if (display && filteredProjects.length === 0) {
      setNoMatchMessage(`No projects tagged "${display}".`);
    } else {
      setNoMatchMessage(null);
    }
  }, [isLoaded, selectedLabel, selectedRaw, filteredProjects.length]);

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
    hidden: { opacity: 0, transition: { staggerChildren: 0.0035 } },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)] nav-list">
      {/* Active raw filter chip (for tags not in quick filters) */}
      {isLoaded && selectedRaw && (
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

      {/* Quick-filter buttons (allowlist only) */}
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
              className={`px-4 py-1 rounded-lg ${
                selectedLabel === label
                  ? "bg-[var(--mesm-blue)] text-[var(--background)]"
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
                      {new Date(project.projectDate).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                        }
                      )}
                    </h3>
                  </div>

                  {/* Row 2: Tags — ONLY show quick-filter labels present on this project (up to 8) */}
                  <div className="mt-2 md:mt-0 pointer-events-none">
                    {(() => {
                      const projectNames = new Set(
                        (project.contentfulMetadata?.tags || [])
                          .map((t) => t?.name)
                          .filter(Boolean)
                          .map((s) => normalize(s))
                      );

                      const labelsForProject = availableFilterLabels.filter(
                        (label) =>
                          (FILTER_MAP[label] || []).some((alias) =>
                            projectNames.has(normalize(alias))
                          )
                      );

                      const firstEight = labelsForProject.slice(0, 8);
                      const extra = Math.max(
                        0,
                        labelsForProject.length - firstEight.length
                      );

                      return (
                        <div className="flex items-center gap-2 flex-wrap">
                          <ServiceTags items={firstEight} />
                          {extra > 0 && (
                            <span className="text-xs opacity-70">
                              +{extra} more
                            </span>
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
