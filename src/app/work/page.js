// app/work/page.js
import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default async function Work({ searchParams }) {
  const tagParam = searchParams?.tag;
  const activeTag = Array.isArray(tagParam) ? tagParam[0] : tagParam ?? null;

  return (
    <div className="flex flex-col gap-[1rem] p-[var(--global-margin-md)] min-h-screen mb-[4rem]">
      <PageTitleLarge text="Work" />
      <ProjectNavigationList activeTag={activeTag} />
    </div>
  );
}
