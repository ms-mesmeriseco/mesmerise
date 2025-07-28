"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import ServiceTags from "../services/ServiceTags";
import { motion, AnimatePresence } from "framer-motion";

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

  // Sync tag with URL
  useEffect(() => {
    const urlTag = searchParams.get("tag");
    setSelectedTag(urlTag || activeTag || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeTag]);

  // Collect all tags
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    projects.forEach((p) =>
      p.contentfulMetadata?.tags?.forEach((t) => tagsSet.add(t.name))
    );
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) =>
      p.contentfulMetadata?.tags?.some((t) => t.name === selectedTag)
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

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    router.push(tag ? `/work?tag=${encodeURIComponent(tag)}` : "/work");
  };

  // Framer Motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.0035 },
    },
  };
  const item = {
    hidden: { opacity: 0, transition: { staggerChildren: 0.0035 } },
    show: { opacity: 1, transition: { staggerChildren: 0.0035 } },
  };

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)]">
      {/* Tag Filter Buttons */}
      {isLoaded && allTags.length > 0 && (
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
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              variants={item}
              className={`px-4 py-1 rounded-lg ${
                selectedTag === tag
                  ? "bg-[var(--mesm-blue)] text-[var(--background)]"
                  : "bg-[var(--mesm-grey-dk)] text-[var(--mesm-grey)] cursor-pointer"
              }`}
              onClick={() => handleSelectTag(tag)}
            >
              {tag}
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
                    <h3 className="">{project.projectTitle}</h3>
                    <h3 className="">
                      {new Date(project.projectDate).toLocaleDateString(
                        "en-GB",
                        { year: "numeric" }
                      )}
                    </h3>
                  </div>
                  {/* Row 2: Tags */}
                  <div className="mt-2 md:mt-0 pointer-events-none">
                    <ServiceTags
                      items={
                        project.contentfulMetadata?.tags?.map((t) => t.name) ||
                        []
                      }
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>
    </section>
  );
}
