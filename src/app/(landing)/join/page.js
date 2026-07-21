import CenterHero from "@/components/sanity-blocks/CenterHero";
import FooterSignup from "@/components/blocks/FooterSignup";
import TrustedBy from "@/components/home/TrustedBy";
import ProjectRail from "@/components/sanity-blocks/ProjectRail";
import TestimonialsRail from "@/components/home/TestimonialRail";

export async function generateMetadata() {
  const title = "Sign Up to Our Newsletter | Mesmerise";
  const description =
    "Sign up to our newsletter for insights direct to your inbox, written by our expert team.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.mesmeriseco.com/email-signup",
      type: "website",
      images: [
        {
          url: "/assets/social-default.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: "/assets/social-default.png",
    },
    alternates: {
      canonical: "https://www.mesmeriseco.com/email-signup",
    },
  };
}

export default function EmailSignupPage() {
  return (
    <>
      <CenterHero
        pageHeader="Future-proof your business"
        pageSubtitle="I'll teach you how to turn cold strangers into loyal clients using unique mental models & 300,000+ years of evolutionary psychology"
        showCta={false}
        avatar={{
          src: "/assets/team/Pezzie_avatar.png",
          alt: "Petar, Mesmerise",
        }}
        customContent={
          <div className="md:w-[480px] w-full">
            <FooterSignup
              cta="Show me how"
              successMsg="You're in! Check your inbox soon."
              highlight={true}
            />
          </div>
        }
      />
      <div className="flex w-full flex-col ">
        <TrustedBy />
        <ProjectRail />
        <TestimonialsRail />
      </div>
    </>
  );
}
