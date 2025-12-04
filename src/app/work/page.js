import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";
import { Suspense } from "react";

export async function generateMetadata() {
  const title = "Work | Mesmerise Digital";
  const description =
    "Explore how ambitious brands scaled with Mesmerise. From booked out calendars to 25x ROAS, data backed proof not promises.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/work`,
    },
  };
}

export default async function Work({ searchParams }) {
  const tagParam = searchParams?.tag;
  const activeTag = Array.isArray(tagParam) ? tagParam[0] : tagParam ?? null;

  return (
    <div className="flex flex-col min-h-screen mb-[4rem]">
      <PageTitleLarge text="Work" />
      <Suspense
        fallback={
          <section className="flex flex-col gap-2">
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-6 w-28 bg-gray-300 rounded animate-pulse" />
          </section>
        }
      >
        <ProjectNavigationList activeTag={activeTag} />
      </Suspense>
    </div>
  );
}
