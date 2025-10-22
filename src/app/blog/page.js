import BlogNav from "@/components/cms-blocks/BlogNav";
import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function BlogPage() {
  return (
    <>
      <PageTitleLarge text={"Blog"} />
      <BlogNav />
    </>
  );
}
