import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function Success() {
  return (
    <div>
      <PageTitleLarge text={"Thank you"} />
      <div className="p3 md:w-1/2">{"We'll be in touch with you shortly."}</div>
    </div>
  );
}
