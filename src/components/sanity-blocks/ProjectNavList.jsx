"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { sanityClient } from "@/sanity/client";
import { groq } from "next-sanity";
import ServiceTags from "../services/ServiceTags";

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
    "ANalytics",
    "Analytics Setup & Audit",
    "Web Traffic",
    "Reporting",
    "GA4",
  ],
};

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function ProjectNavigationList({ activeTag = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedRaw, setSelectedRaw] = useState(null);
  const [noMatchMessage, setNoMatchMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- alias -> label map (includes labels themselves) ---
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

  // --- Fetch projects from Sanity (projectPage docs) ---
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await sanityClient.fetch(
          groq`*[_type == "projectPage" && contentfulArchived != true]{
            _id,
            projectTitle,
            "slug": slug.current,
            projectDate,
            collaborationModel,
            serviceTags
          }`
        );

        setProjects(data || []);
      } catch (err) {
        console.error("Error loading projects from Sanity:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchProjects();
  }, []);

  // --- Debug: title + tags ---
  projects.forEach((p) => {
    const tags = (p.serviceTags || []).filter(Boolean).join(", ");
    console.log(`${p.projectTitle}: ${tags}`);
  });

  // --- Present tags across all projects (normalized) ---
  const presentTagSet = useMemo(() => {
    const set = new Set();
    projects.forEach((p) =>
      (p.serviceTags || []).forEach((t) => set.add(normalize(t)))
    );
    return set;
  }, [projects]);

  // --- Only render quick-filter buttons that actually appear in data ---
  const availableFilterLabels = useMemo(() => {
    return Object.keys(FILTER_MAP).filter((label) =>
      (FILTER_MAP[label] || []).some((alias) =>
        presentTagSet.has(normalize(alias))
      )
    );
  }, [presentTagSet]);

  // --- Sync selection from URL or prop (accept ANY tag; map to label if possible) ---
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

  // --- Compute candidates for filtering ---
  const filteredProjects = useMemo(() => {
    if (!selectedLabel && !selectedRaw) {
      return [...projects].sort(
        (a, b) => new Date(b.projectDate) - new Date(a.projectDate)
      );
    }

    let candidates;
    if (selectedLabel) {
      candidates = new Set(
        (FILTER_MAP[selectedLabel] || [selectedLabel]).map((n) => normalize(n))
      );
    } else {
      candidates = new Set([normalize(selectedRaw)]);
    }

    return projects
      .filter((p) =>
        (p.serviceTags || []).some((t) => candidates.has(normalize(t)))
      )
      .sort((a, b) => new Date(b.projectDate) - new Date(a.projectDate));
  }, [projects, selectedLabel, selectedRaw]);

  // --- No match logic ---
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

  // --- Framer Motion variants ---
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
          className="flex flex-wrap gap-1 mb-4 text-md "
        >
          <motion.button
            variants={item}
            className={`px-3 py-0 rounded-xl h-full hover:bg-[var(--mesm-yellow)]  ${
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

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-6 w-24 bg-gray-300 rounded" />
          <div className="h-6 w-32 bg-gray-300 rounded" />
          <div className="h-6 w-28 bg-gray-300 rounded" />
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
              key={project._id || project.slug}
              layout
              variants={item}
              initial="hidden"
              animate="show"
              exit="hidden"
              whileHover={{ x: 2 }}
            >
              <Link href={`/work/${project.slug}`}>
                <div className="border-b border-[var(--mesm-grey)] py-[var(--global-margin-xs)] cursor-pointer hover:opacity-80 transition duration-100">
                  {/* Row 1: Title + Year */}
                  <div className="flex flex-row md:flex-row justify-between items-center my-2">
                    <span className="md:text-5xl">{project.projectTitle}</span>
                    <span className="md:text-5xl">
                      {project.projectDate
                        ? new Date(project.projectDate).toLocaleDateString(
                            "en-GB",
                            { year: "numeric" }
                          )
                        : ""}
                    </span>
                  </div>

                  {/* Optional: per-project tags visible under each row */}

                  <div className="mt-0 md:mt-0 pointer-events-none">
                    <ServiceTags tags={project.serviceTags || []} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>
    </section>
  );
}
