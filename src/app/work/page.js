import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

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
    <div className="flex flex-col gap-[1rem] min-h-screen mb-[4rem]">
      <PageTitleLarge text="Work" />
      <ProjectNavigationList activeTag={activeTag} />
    </div>
  );
}
