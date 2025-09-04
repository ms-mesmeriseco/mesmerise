"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";

function hasTag(project, { tagName, tagSlug }) {
  const tags = project?.contentfulMetadata?.tags || [];
  return tags.some((t) => {
    const name = (t?.name || "").toLowerCase().trim();
    const id = (t?.id || t?.sys?.id || "").toLowerCase().trim();
    return (
      (tagName && name === tagName.toLowerCase().trim()) ||
      (tagSlug && id.includes(tagSlug.toLowerCase().trim()))
    );
  });
}

export default function ProjectGrid({
  tagName = "layout: highlight grid",
  tagSlug = "layout-highlight-grid", // fallback if your space uses slugged tag ids
  max = 6,
}) {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
        setProjects(data?.projectPageCollection?.items || []);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    const byTag = projects.filter((p) => hasTag(p, { tagName, tagSlug }));
    return byTag.slice(0, max);
  }, [projects, tagName, tagSlug, max]);

  // Ensure we always render 6 slots to preserve layout
  const slots = useMemo(() => {
    const arr = filtered.slice(0, 6);
    while (arr.length < 6) arr.push(null);
    return arr;
  }, [filtered]);

  const renderProject = (project, index) => {
    if (!project) {
      return (
        <div
          key={`placeholder-${index}`}
          className="bg-[var(--mesm-grey-dk)]/40 flex-1 h-[40vh] animate-pulse"
        />
      );
    }

    const img = project.heroMedia || {};
    const title = project.projectTitle || "Untitled project";
    const alt = img.title || title;

    return (
      <Link
        href={`/work/${project.slug}`}
        key={project.slug || index}
        className="group relative flex-1 overflow-hidden hover:scale-[1.01] transition-transform duration-200 ease-in-out"
      >
        <img
          src={img.url}
          alt={alt}
          className="w-full h-[40vh] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
          <span className="text-white text-sm text-left p-4">{title}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Column 1 */}
      <div className="flex flex-col gap-4 h-full">
        {renderProject(slots[0], 0)}
        <div className="flex gap-4 flex-1">
          {renderProject(slots[1], 1)}
          {renderProject(slots[2], 2)}
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-4 flex-1">
          {renderProject(slots[3], 3)}
          {renderProject(slots[4], 4)}
        </div>
        {renderProject(slots[5], 5)}
      </div>
    </div>
  );
}
