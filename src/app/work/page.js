// app/work/page.tsx (server component)
import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default async function Work({ searchParams }) {
  const activeTag = Array.isArray(searchParams?.tag)
    ? searchParams.tag[0]
    : searchParams?.tag ?? null;

  return (
    <div className="flex flex-col gap-[6rem] p-[var(--global-margin-lg)] min-h-screen">
      <PageTitleLarge text="Work" />
      <ProjectNavigationList activeTag={activeTag} />
    </div>
  );
}
