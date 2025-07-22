"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";
import ServiceTags from "../services/ServiceTags";

export default function ProjectNavigationList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
        setProjects(data.projectPageCollection.items || []);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section className="flex flex-col gap-[var(--global-margin-xs)]">
      {projects.map((project, idx) => (
        <Link key={idx} href={`/work/${project.slug}`}>
          <div className="flex justify-between items-center border-b border-[var(--mesm-grey)] py-[var(--global-margin-xs)] cursor-pointer hover:opacity-80 transition">
            {/* Title (left-aligned) */}
            <p className="text-lg font-medium flex-1 text-left">
              {project.projectTitle}
            </p>

            <ServiceTags items={[project.category]} />

            {/* Date (right-aligned) */}
            <p className="text-md flex-1 text-right">
              {new Date(project.projectDate).toLocaleDateString("en-GB", {
                year: "numeric",
              })}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
