import PageTitleLarge from "@/components/layout/PageTitleLarge";
import ContactForm from "./ContactForm";
import StaggeredWords from "@/hooks/StaggeredWords";
import CopyEmailButton from "@/components/ui/CopyEmailButton";

export async function generateMetadata() {
  const title = "Contact us | Mesmerise Digital";
  const description =
    "Ready to scale like Hormozi? Chat directly with our strategy team. We'll map out a data driven plan built for premium results.";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/connect` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/connect`,
      siteName: "Mesmerise Digital",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ConnectPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <PageTitleLarge text="Connect" />
        <div className="flex w-full justify-between gap-[var(--global-margin-sm)]">
          <div className="w-full md:w-1/2 pb-6">
            <StaggeredWords as="h3" text="Send us a love letter" />
            <ContactForm />
          </div>
        </div>
        <div className="hidden md:block w-1/2"></div>
      </div>
      <h6>Or go direct to source:</h6>
      <div className="flex flex-col md:flex-row md:h-[40vh] h-[60vh] gap-[var(--global-margin-xs)] border-t-1 pt-[var(--global-margin-sm)] border-[var(--mesm-grey-dk)]">
        <div className="flex-1 border-1 border-[var(--mesm-grey-dk)] rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)] text-[var(--foreground)]">
          <a
            href="tel:+61477210477"
            className="w-full h-full font-normal text-left flex-start flex"
          >
            <button className="w-full h-full md:text-4xl text-2xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex">
              Call
              <br />
              +61 477 210 477
            </button>
          </a>
        </div>
        <div className="flex-1 border-1 border-[var(--mesm-grey-dk)] rounded-md flex items-center justify-center duration-200 cursor-pointer hover:bg-[var(--mesm-yellow)] hover:text-[var(--background)] text-[var(--foreground)]">
          <CopyEmailButton email="hello@mesmeriseco.com" label="Email" />
        </div>
      </div>
    </>
  );
}
