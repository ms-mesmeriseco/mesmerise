import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function Work() {
  return (
    <>
      <div className="flex flex-col gap-[6rem]  p-[var(--global-margin-lg)] pt-[var(--header-height)]">
        <PageTitleLarge text="Work" />
        <ProjectNavigationList />
      </div>
    </>
  );
}
