import PageTitleLarge from "@/components/layout/PageTitleLarge";

export async function generateMetadata() {
  const title = "Email sent | Mesmerise Digital";
  const description =
    "Thank you for getting touch, somebody will be in touch with you shortly.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/form-success`,
    },
  };
}

export default function Success() {
  return (
    <div>
      <PageTitleLarge text={"Thank you"} />
      <div className="p3 md:w-1/2">
        {"Somebody will be in touch with you shortly."}
      </div>
    </div>
  );
}
