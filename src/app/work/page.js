import ProjectNavigationList from "@/components/cms-blocks/ProjectNavigationList";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function Work() {
  return (
    <>
      <div className="flex flex-col gap-[6rem]">
        <PageTitleLarge text="Work" />
        <ProjectNavigationList />
      </div>
    </>
  );
}
