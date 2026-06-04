"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import ProjectNavList from "./ProjectNavList";

export default function RelatedProjects({ projects = [], currentProject }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const relatedProjects = useMemo(() => {
    if (!currentProject || !projects.length) return [];

    const currentTags = new Set(
      (currentProject.serviceTags || []).map((t) =>
        typeof t === "string"
          ? t.toLowerCase()
          : t?.slug?.toLowerCase() || t?.title?.toLowerCase(),
      ),
    );

    return projects
      .filter((p) => p.slug !== currentProject.slug)
      .map((p) => {
        const pTags = (p.serviceTags || []).map((t) =>
          typeof t === "string"
            ? t.toLowerCase()
            : t?.slug?.toLowerCase() || t?.title?.toLowerCase(),
        );
        const sharedCount = pTags.filter((t) => currentTags.has(t)).length;
        return { ...p, score: sharedCount };
      })
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.projectDate) - new Date(a.projectDate),
      )
      .slice(0, 3);
  }, [projects, currentProject]);

  if (relatedProjects.length === 0) return null;

  return (
    <>
      {/* Side panel overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-999 h-full w-full max-w-[80vw] bg-[var(--background)] shadow-2xl
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[var(--mesm-grey-dk)]">
          <h6 className="m-0">All projects</h6>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close panel"
            className="text-2xl leading-none hover:opacity-50 transition-opacity duration-200"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <ProjectNavList
            projects={projects}
            onNavigate={() => setOpen(false)}
            showFilters={false}
          />
        </div>
      </div>

      {/* Main section */}
      <section className="py-20 mt-20">
        <div className="flex justify-between items-end">
          <h6>Related projects</h6>
          <button
            onClick={() => setOpen(true)}
            aria-label="View all projects"
            className="text-sm hover:opacity-50 transition-opacity duration-200 mb-1"
          >
            View all
          </button>
        </div>

        <div className="border-b border-[var(--mesm-grey-dk)] mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {relatedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-[var(--mesm-grey)] mb-4 duration-200 rounded-lg">
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
                  <h4 className="text-xl group-hover:text-[var(--mesm-red)] transition-colors">
                    {project.projectTitle}
                  </h4>
                  <p className="text-sm">
                    {new Date(project.projectDate).getFullYear()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
