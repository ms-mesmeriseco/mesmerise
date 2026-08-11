import LeftHero from "@/components/sanity-blocks/LeftHero";
import MatrixForm from "./MatrixForm";
import TwoColumn from "@/components/sanity-blocks/TwoColumn";
import IconRow from "@/components/sanity-blocks/IconRow";
import FAQ from "@/components/blocks/FAQ.jsx";
import Image from "next/image";
import ProjectRail from "@/components/sanity-blocks/ProjectRail.jsx";
import TestimonialRail from "@/components/home/TestimonialRail.jsx";

const TRUST_LOGOS = [
  {
    url: "/client-logos/bespoke.png",
    title: "bespoke landscaping",
  },
  {
    url: "/client-logos/burra.png",
    title: "burra commercial",
  },
  {
    url: "/client-logos/flo.png",
    title: "Flo Landscapes",
  },
  {
    url: "/client-logos/goodluck.png",
    title: "Good luck tattoo",
  },
  {
    url: "/client-logos/sp.png",
    title: "Street peace",
  },
  {
    url: "/client-logos/tppt.png",
    title: "Tom Peacock Personal Training",
  },
];

export const matrixFAQ = [
  {
    question: "Is this just another checklist I could find on Google?",
    textContent:
      "No. These are fundamentals to help guide leadership decisions.",
  },
  {
    question: "I'm pre-revenue or early stage. Will this still work for me?",
    textContent:
      "Yes. Score what applies to you now. Utilise this to carve out priority tasks for the future.",
  },
  {
    question: "Does this work outside ecommerce, or for service businesses?",
    textContent:
      "Yes. These are foundational principles that work for any industry/business.",
  },
  {
    question: "How long will this take?",
    textContent:
      "20 to 30 minutes to score yourself honestly. Longer to fix what you find.",
  },
  {
    question: "Why give this away for free?",
    textContent:
      "Because I want you to succeed and create a life of abundance.",
  },
];

export async function generateMetadata() {
  const title = "FREE Marketing Matrix | Mesmerise";
  const description = "Dominate your industry";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.mesmeriseco.com/marketing-matrix`, // (you might want /landing/ here btw)
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
      canonical: `https://www.mesmeriseco.com/marketing-matrix`,
    },
  };
}

export function WhyICreatedThis() {
  return (
    <TwoColumn
      column1={[
        <div key="why-created" className="">
          <h2 className="mb-3">Why I created this</h2>
          <h4>
            <strong>
              Over the last 24 months, I&apos;ve looked under the hood of
              hundreds of businesses.
            </strong>
          </h4>
          <p className="mb-8">
            I&apos;ve studied &amp; analysed the marketing funnels &amp;
            operating procedures from pre-revenue startups to 9-figure
            enterprise-level organisations.
          </p>
          <p className="mb-8">
            After a while, I noticed something interesting. Regardless of
            industry or size, I kept seeing the same mistakes over &amp; over
            again.
          </p>
          <p>
            So I created a comprehensive checklist to help you identify problems
            in your business &amp; acquisition strategy.
          </p>
        </div>,
      ]}
      column2={[
        <Image
          key="audit-img"
          src="https://cdn.sanity.io/images/wpr5jlmc/production/88f1166772a3d1184533e298e8be8391e37d2afb-4000x4000.jpg"
          alt="CRO Audit"
          width={800}
          height={600}
        />,
        <h6 key="audit-caption">Petar Petrović, Mesmerise Founder</h6>,
      ]}
    />
  );
}

export function WhatYouReceive() {
  return (
    <IconRow
      titleText="Here's what you receive"
      iconItems={[
        {
          icon: "https://cdn.sanity.io/images/wpr5jlmc/production/01b76f69febeea4647e01b7ffba9759c10407cc0-24x24.svg",
          textContent:
            "A 42-task audit covering every function of your business, from brand to balance sheet",
        },
        {
          icon: "https://cdn.sanity.io/images/wpr5jlmc/production/7340b31dbad0a4173da3d56dbc558767e2a55e44-24x24.svg",
          textContent:
            "An Implemented / Quality score for each task, so you can see where you stand",
        },
        {
          icon: "https://cdn.sanity.io/images/wpr5jlmc/production/79a0b40d97ce158a929702c4b2eb1142193b7c09-24x24.svg",
          textContent: "The reasoning behind every task and why it's important",
        },
      ]}
    />
  );
}

export function FomTestimonial() {
  return (
    <TwoColumn
      column1={[
        <Image
          key="fom-img"
          src="/assets/FoM_025.jpg"
          alt="Mesmerise client testimonial"
          width={800}
          height={600}
        />,
      ]}
      column2={[
        <div key="fom-intro">
          <h2>
            It ultimately transformed our business into a stable, profitable
            business we could scale
          </h2>
          <br />
          <p className="p2">
            &quot;We have been with Mesmerise for 3+ years now, and they have
            become an essential ally for us as our business continues to
            grow.&quot;
          </p>
        </div>,
      ]}
    />
  );
}

export function FinalCTA() {
  return (
    <TwoColumn
      column1={[
        <div key="final-cta" className="">
          <h2 className="mb-3">Get your free Marketing Matrix</h2>
          <p className="mb-8">
            This matrix contains everything you need to avoid costly errors &
            2am cortisol spikes.
          </p>
          <MatrixForm />
        </div>,
      ]}
      column2={[
        <Image
          key="final-cta-img"
          src="/assets/team/petar-selfie.png"
          alt="Why I created this"
          width={400}
          height={400}
        />,
      ]}
    />
  );
}

export default function CROChecklistPage() {
  const heroImg = { url: "/assets/omnichannel-marketing-matrix_graphic.png" };
  return (
    <>
      <LeftHero
        pageHeader="A Compass For Business Leaders Who Want A Clear Path"
        pageSubtitle="From pre-revenue startups to 9-figure organisations, I kept seeing the same mistakes. This matrix contains everything you need to avoid costly errors & 2am cortisol spikes."
        showCta={false}
        customContent={<MatrixForm />}
        logos={TRUST_LOGOS}
        heroMedia={heroImg}
      />
      <div className="flex w-full flex-col justify-between gap-64 mt-48">
        <WhyICreatedThis />
        <WhatYouReceive />
        <ProjectRail tag="highlight" />
        <TestimonialRail />
        <FomTestimonial />
        <FAQ
          label="common questions"
          title="Frequently asked questions"
          items={matrixFAQ}
          singleOpen={false}
          defaultOpen={[0]}
        />
        <FinalCTA />
      </div>
    </>
  );
}
