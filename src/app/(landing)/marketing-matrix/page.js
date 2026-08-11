import CenterHero from "@/components/sanity-blocks/CenterHero";
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
          key="why-created-img"
          src="https://cdn.sanity.io/images/wpr5jlmc/production/0f1c3d8e7a9b6f2e4c7d8f1e2a3b4c5d6e7f8g9h-1920x1920.png"
          alt="Why I created this"
          width={800}
          height={600}
        />,
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

export function Converting() {
  return (
    <TwoColumn
      h2="Converting like crazy"
      column1={[
        <Image
          key="brett-img"
          src="https://cdn.sanity.io/images/wpr5jlmc/production/7916f0b93fc98abc750a9c17d374e79cb9212495-1920x1920.png"
          alt="Brett Benson case study"
          width={800}
          height={600}
        />,
        <h4 key="brett-heading">
          Over $1,000,000+ of lead enquiries in 24 hours
        </h4>,
        <p key="brett-copy">
          Brett was getting nowhere with his old Squarespace website. This is
          when we entered the chat. Using our state-of-the-art Mesmerise Method,
          we gave him the flexibility and freedom he deserved.
        </p>,
        <p key="brett-link">
          <a
            href="https://www.mesmeriseco.com/work/north-bay-building"
            target="_blank"
            rel="noreferrer"
            className="text-sm mt-4 inline-block text-[var(--mesm-blue)] underline duration-200"
          >
            View North Bay Building Case Study
          </a>
        </p>,
      ]}
      column2={[
        <Image
          key="mitch-img"
          src="https://cdn.sanity.io/images/wpr5jlmc/production/a42a8723992f0bc0d3566101a96672c714882671-2880x2160.jpg"
          alt="Mitch J Construction"
          width={800}
          height={600}
        />,
        <h4 key="mitch-heading">1,380% increase in qualified enquiries</h4>,
        <p key="mitch-copy">
          Our conversion pathways resulted in a 3-month wait period, and Mitch
          begged us to alter the acquisition strategy because it was too
          powerful.
        </p>,
        <p key="mitch-link">
          <a
            href="https://www.mesmeriseco.com/bespoke-case-study"
            target="_blank"
            rel="noreferrer"
            className="text-sm mt-4 inline-block text-[var(--mesm-blue)] underline duration-200"
          >
            Discover How We Booked Bespoke Landscapes Out
          </a>
        </p>,
      ]}
    />
  );
}

export function Kerime() {
  return (
    <TwoColumn
      column1={[
        <div key="intro">
          <h2>
            &quot;Working with Mesmerise was the turning point in my
            business.&quot;
          </h2>
          <br />
          <p className="mb-3 p2">
            &quot;They just know what to do and do it... No frills, no pointless
            talking, straight to delivery &amp; outcomes.&quot;
          </p>
          <p className="mb-3">
            My marketing services went from fluffy, basic concepts to tangible
            and visible outcomes and profit.
          </p>
        </div>,
      ]}
      column2={[
        <Image
          key="kerime-img"
          src="https://cdn.sanity.io/images/wpr5jlmc/production/d45a992afce525dbbf8f9382e92898c04309945e-1188x1129.jpg"
          alt="Kerimé Abay"
          width={800}
          height={600}
        />,
        <h6 key="kerime-caption">Kerimé Abay, Hue Therapy</h6>,
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

export default function CROChecklistPage() {
  return (
    <>
      <CenterHero
        pageHeader="A Compass For Business Leaders Who Want A Clear Path"
        pageSubtitle="From pre-revenue startups to 9-figure organisations, I kept seeing the same mistakes. This matrix contains everything you need to avoid costly errors & 2am cortisol spikes."
        showCta={false}
        customContent={<MatrixForm />}
        logos={TRUST_LOGOS}
      />
      <div className="flex w-full flex-col justify-between gap-64 mt-48">
        <WhyICreatedThis />
        <WhatYouReceive />
        <ProjectRail tag="highlight" />

        <Converting />
        <Kerime />
        <FomTestimonial />
        <TestimonialRail />
        <FAQ
          label="common questions"
          title="Frequently asked questions"
          items={matrixFAQ}
          singleOpen={false}
          defaultOpen={[0]}
        />
      </div>
    </>
  );
}
