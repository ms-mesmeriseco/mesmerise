"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

export default function RelatedProjects({ projects = [], currentProject }) {
  const relatedProjects = useMemo(() => {
    if (!currentProject || !projects.length) return [];

    // 1. Get the tags of the current project for matching
    const currentTags = new Set(
      (currentProject.serviceTags || []).map((t) =>
        typeof t === "string"
          ? t.toLowerCase()
          : t?.slug?.toLowerCase() || t?.title?.toLowerCase(),
      ),
    );

    return (
      projects
        // 2. Remove the current project from the list
        .filter((p) => p.slug !== currentProject.slug)
        // 3. Score projects based on how many tags they share
        .map((p) => {
          const pTags = (p.serviceTags || []).map((t) =>
            typeof t === "string"
              ? t.toLowerCase()
              : t?.slug?.toLowerCase() || t?.title?.toLowerCase(),
          );
          const sharedCount = pTags.filter((t) => currentTags.has(t)).length;
          return { ...p, score: sharedCount };
        })
        // 4. Sort by score (highest first), then by date
        .sort(
          (a, b) =>
            b.score - a.score ||
            new Date(b.projectDate) - new Date(a.projectDate),
        )
        // 5. Take the top 3
        .slice(0, 3)
    );
  }, [projects, currentProject]);

  if (relatedProjects.length === 0) return null;

  return (
    <section className="py-20 mt-20">
      <h6>Related projects</h6>
      <div className="border-b-1 border-[var(--mesm-grey)] flex justify-between items-end mb-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block"
          >
            <div className=" relative aspect-[3/2] overflow-hidden bg-[var(--mesm-grey)] mb-4 duration-200 group-hover:rounded-2xl">
              {project.heroMedia?.url && (
                <Image
                  src={project.heroMedia.url}
                  alt={project.projectTitle}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-101"
                />
              )}
            </div>
            <div className="flex justify-between items-start group-hover:opacity-60 duration-200">
              <div>
                <h4 className="text-xl group-hover:text-[var(--mesm-red)] transition-colors ">
                  {project.projectTitle}
                </h4>
                <p className="text-sm ">
                  {new Date(project.projectDate).getFullYear()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
