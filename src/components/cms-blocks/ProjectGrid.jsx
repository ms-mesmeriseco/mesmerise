"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";

export default function ProjectGrid() {
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

  const renderProject = (project, index) => {
    if (!project) {
      return <div key={index} className="bg-gray-200 rounded-md flex-1" />;
    }

    return (
      <Link
        href={`/work/${project.slug}`}
        key={index}
        className="group relative flex-1 rounded-md overflow-hidden hover:scale-[1.01] transition-transform duration-200 ease-in-out"
      >
        <img
          src={project.heroMedia?.url}
          alt={project.heroMedia?.title || project.projectTitle}
          className="w-full h-[40vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end ">
          <span className="text-white text-sm text-left p-4">
            {project.projectTitle}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-[var(--global-margin-xs)] h-full">
      {/* Column 1 */}
      <div className="flex flex-col gap-[var(--global-margin-xs)] h-full">
        {renderProject(projects[0], 0)}
        <div className="flex gap-[var(--global-margin-xs)] flex-1">
          {renderProject(projects[1], 1)}
          {renderProject(projects[2], 2)}
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-[var(--global-margin-xs)] h-full">
        <div className="flex gap-[var(--global-margin-xs)] flex-1">
          {renderProject(projects[3], 3)}
          {renderProject(projects[4], 4)}
        </div>
        {renderProject(projects[5], 5)}
      </div>
    </div>
  );
}
