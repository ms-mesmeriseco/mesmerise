import LeftHero from "@/components/cms-blocks/LeftHero";
import CROForm from "./CROForm";
import TwoColumn from "@/components/cms-blocks/TwoColumn";
import ProjectRail from "@/components/cms-blocks/ProjectRail";
import IconRow from "@/components/cms-blocks/IconRow";
import FAQ from "@/components/layout/FAQ.jsx";
import Image from "next/image";

const CRO_LOGOS = [
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

export const croFAQ = [
  {
    question: "Is this just a list of best practices I can find on Google?",
    textContent:
      "No. This is not a blog post. This is a redacted version of our internal agency SOP (Standard Operating Procedure). It is the exact, step-by-step diagnostic tool our strategists use to audit accounts generating millions in pipeline. It is based on data, not theory.",
  },
  {
    question:
      "I don't have a massive ad budget yet. Will this still work for me?",
    textContent:
      "This makes a proper CRO strategy even more important, as you can't afford to waste ad spend. This checklist helps you ensure that every dollar you spend is landing on a structure designed to hold it, rather than slipping through the cracks and putting money in the bin.",
  },
  {
    question: "What kind of research do you conduct to inform your strategy?",
    textContent:
      "We analyse your positioning, customer psychology, competitor landscape, and digital footprint. This includes website analytics, keyword and intent mapping, on-page session recordings, customer reviews, and creative angles. <br/><br/>We break down the fundamentals and build back up from there. It allows us to craft a strategy that lowers acquisition costs (CAC) and increases client lifetime value (LTV).",
  },
  {
    question: "What exactly will I walk away with?",
    textContent:
      "You'll walk away with a clear roadmap showing you where to focus your budget and a priority of next steps aligned to your goal.  <br/><br/>No more confusion or second-guessing. <br/><br/>Everything is laid out in a straightforward, easy-to-read document. Think of it as a decision-making blueprint you can rely on to guide your short-term and long-term goals.",
  },
  {
    question:
      "Can you tailor the strategy deck towards specific pain points I'm having?",
    textContent:
      "Yes. Every strategy deck is tailored to where your business is right now and the challenges you're facing. For example, if you're established but struggling with conversions, we'll focus on funnel performance and conversion optimisation. If you're just starting, we'll prioritise the foundations such as brand tone, visual identity, customer avatars, competitor analysis, positioning, and a funnel built for visibility and trust.",
  },
  {
    question: "How involved am I in the strategy process?",
    textContent:
      "It's an open collaboration. Your knowledge and input are essential, and you'll be involved at every stage. We combine your expertise with our frameworks to ensure the final strategy feels authentic, achievable, and aligned with your ambitions. ",
  },
];

export async function generateMetadata({ params }) {
  const title = "FREE CRO Checklist Generating 25X ROAS Audit | Mesmerise";
  const description =
    "Stop burning ad spend. Use our internal agency CRO checklist to identify leaks and generate 25X ROAS. Turn your failing pages into goated growth engines.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.mesmeriseco.com/cro-checklist`, // (you might want /landing/ here btw)
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
      canonical: `https://www.mesmeriseco.com/cro-checklist`,
    },
  };
}

export function CROAudit() {
  return (
    <TwoColumn
      ctaCol="false"
      ctaLab="Book A CRO Audit"
      column1={[
        <Image
          key="audit-img"
          src="https://images.ctfassets.net/cdpwrfmjljmf/2cdJeVHIJa7bkOrd2MfV02/704fc1a3bd3f2b7b0cce1620f58ea085/Pezzie-4.jpg"
          alt="CRO Audit"
          width={800}
          height={600}
        />,
        <h6 key="audit-caption">Petar Petrović, Mesmerise Founder</h6>,
      ]}
      column2={[
        <div key="audit-intro">
          <h2>
            Why 1 in 3 Clients Pause Their Ad Spend After We Apply Our CRO
            Protocol
          </h2>
          <br />
          <p className="mb-3">
            When we implement our Structural CRO Audit, there&apos;s a 33%
            chance a client will hit an unexpected problem within weeks:
          </p>
          <p className="mb-3">
            They either have to pull back on ad spend, or rush to hire new staff
            to keep up with the surge in demand.
          </p>
          <p className="mb-3">Here&apos;s what we uncover in the CRO audit:</p>
          <ul className="list-disc pl-5 ">
            <li>
              The exact visual cue we place above the fold that signals
              authority to cold traffic &amp; stops bounce rates
            </li>
            <li>
              The &apos;headline hammer&apos; technique that is non negotiable
              if you want to generate more money
            </li>
            <li>
              Why there&apos;s no such thing as &apos;bad traffic&apos;, just a
              mismatch of intent
            </li>
          </ul>

          <p className="p2 mb-3">
            Stop wasted ad spend, discover how our Mesmerise Method turns clicks
            into loyal customers.
          </p>
        </div>,
      ]}
    />
  );
}

export function Testimonials() {
  return (
    <IconRow
      titleText="What it's like to work with us"
      displayTwo
      iconItems={[
        {
          icon: { url: "/icons/five-stars.svg" },
          textContent: (
            <div key="testimonial-jay">
              <p className="p2 mb-2">
                &quot;Petar and the team are the best crew to work with. They
                know the market and will get your company out there and ahead of
                the game.&quot;
              </p>
              <br />
              <br />
              <p>Jay Shelling, Flo Landscapes</p>
            </div>
          ),
        },
        {
          icon: { url: "/icons/five-stars.svg" },
          textContent: (
            <div key="testimonial-prosculpt">
              <p className="p2 mb-2">
                &quot;Petar and his team have injected new life into our
                business marketing and internet traffic. They have been
                incredible to work with and really listened to what our
                advertising needs were... Well worth the money.&quot;
              </p>
              <br />
              <br />
              <p>Matt &amp; Peta Staples, Pro Sculpt</p>
            </div>
          ),
        },
        {
          icon: { url: "/icons/five-stars.svg" },
          textContent: (
            <div key="testimonial-moon">
              <p className="p2 mb-2">
                &quot;Blew my online presence up since working with Mesmerise.
                Highly recommend.&quot;
              </p>
              <br />
              <br />
              <p>Joseph Moon, Moon Building</p>
            </div>
          ),
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
          src="https://images.ctfassets.net/cdpwrfmjljmf/59SBvS0YErGDYTX80hhVOT/1c4978c214188a588249a93c85b56333/Brett_Benson.png"
          alt="Brett Benson case study"
          width={800}
          height={600}
        />,
        <h4 key="brett-heading">
          <b>Over $1,000,000+ of lead enquiries in 24 hours</b>
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
          src="https://images.ctfassets.net/cdpwrfmjljmf/1wMRjjHJajK5RbksU4A6uk/fd62668551dafba41e59405f6558270b/mitchj_construciton.jpg"
          alt="Mitch J Construction"
          width={800}
          height={600}
        />,
        <h4 key="mitch-heading">
          <b>1,380% increase in qualified enquiries</b>
        </h4>,
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
      ctaCol="true"
      ctaLab="Book A CRO Audit"
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
          src="https://images.ctfassets.net/cdpwrfmjljmf/2XCIr1eGqiUjuvCzOijCPm/6a998c6d34761a2f123a94922afc550e/Kez_Smiley.jpg"
          alt="Kerimé Abay"
          width={800}
          height={600}
        />,
        <h6 key="kerime-caption">Kerimé Abay, Hue Therapy</h6>,
      ]}
    />
  );
}

export default function CROChecklistPage() {
  return (
    <>
      <LeftHero
        pageHeader="The CRO Checklist Generating 25X ROAS, and Millions of Dollars in Pipeline"
        pageSubtitle="We use this exact step-by-step structural audit to identify 'leaks' in client campaigns, align traffic with intent, and turn failing pages into growth engines."
        showCta={false}
        customContent={<CROForm />}
        heroMedia={{
          url: "/assets/cro-checklist_1.png",
          contentType: "image/jpeg",
          title: "CRO Audit screenshot",
        }}
        logos={CRO_LOGOS}
      />
      <div className="narrow-wrapper flex w-full flex-col justify-between gap-64 mt-48">
        <CROAudit />
        <Testimonials />
        <ProjectRail />
        <Converting />
        <Kerime />
        <FAQ
          label="common questions"
          title="Frequently asked questions"
          items={croFAQ}
          singleOpen={false}
          defaultOpen={[0]}
        />
      </div>
    </>
  );
}
