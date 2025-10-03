import PageTitleLarge from "@/components/layout/PageTitleLarge";

export default function Success() {
  return (
    <div>
      <PageTitleLarge text={"Thank you"} />
      <div className="page-title-medium md:w-1/2">
        Email sent. Someone will be in touch with you shortly!
      </div>
    </div>
  );
}
