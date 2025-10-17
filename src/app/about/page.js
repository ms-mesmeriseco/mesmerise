import PageTitleLarge from "@/components/layout/PageTitleLarge";
import StaggeredWords from "@/hooks/StaggeredWords";
import TeamBlock from "@/components/about/TeamBlock";

export async function generateMetadata() {
  const title = "About us | Mesmerise Digital Marketing";
  const description =
    "Led by strategy, fuelled by design, validated by data. Discover the philosophy behind our state-of-the-art approach, redefining how brands grow online.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.mesmeriseco.com/about`,
    },
  };
}

export function OurWhy() {
  return (
    <>
      <PageTitleLarge text="Our Why" />
      <div className="md:max-w-1/2 flex flex-col gap-6 min-h-[70vh] items-left">
        <StaggeredWords
          as="p"
          className="page-title-medium"
          text="We love collaborating with people and making a positive change in their lives."
        />
        <StaggeredWords
          as="p"
          className="p3"
          text="Many clients we work with are lifestyle orientated, and are very good at what they do, but have little to no knowledge when it comes to marketing and business. A lot have been burnt by previous agencies, and are skeptical about working with somebody new."
        />
      </div>

      <div className="md:max-w-1/2 py-6 flex flex-col gap-6 ml-auto min-h-[70vh] items-left">
        <StaggeredWords
          as="p"
          className="p3"
          text="It's not long before these clients are blown away by the results - generally calling us with an 'oh my god, it worked!'"
        />
        <StaggeredWords
          as="p"
          className="p3"
          text="That breakthrough is our North Star. It makes us feel warm and fuzzy to be able to provide confidence and security for our clients."
        />
      </div>
    </>
  );
}

export function Philosophy() {
  return (
    <>
      <PageTitleLarge text="Our Philosophy" />
      <div className="md:max-w-1/2 flex flex-col gap-6 min-h-[70vh] items-left">
        <StaggeredWords
          as="p"
          className="page-title-medium"
          text="At the heart of Mesmerise, is a multidisciplinary approach built on mastery. It's about putting your best foot forward and operating like a boss."
        />
      </div>

      <div className="md:max-w-1/2 py-6 flex flex-col gap-6 ml-auto min-h-[70vh] items-left">
        <StaggeredWords
          as="p"
          className="p3"
          text="It's a mindset to keep learning and to always evolve, being intentional in every area of your life: from the way you walk, to the way you breathe, and even into how you communicate. It's commitment to a standard that the majority avoid because it requires depth, discipline, and (sometimes) it's the path of most resistance."
        />
        <StaggeredWords
          as="p"
          className="page-title-medium"
          text="Our philosophy naturally ties in with human psychology, the only “trend” that remains a constant in our industry."
        />
        <StaggeredWords
          as="p"
          className="p2"
          text="We're influenced by the works of Eugene Schwartz, who showed us how markets evolve and how awareness shapes action; Robert Greene, who revealed the laws of power, trust, and influence; and Carl Jung, who famously explored identity, archetypes, and the way people seek meaning. These are the foundations of how people think, feel, and make decisions."
        />

        <StaggeredWords
          as="p"
          className="p2"
          text="We take these timeless principles and build digital ecosystems. Strategy, design, data, and communication work together, guided by the mental models that have shaped human behaviour for centuries. The result is a state of the art approach that shifts identity beliefs, builds authority, and compounds into long-term security and growth."
        />
      </div>
    </>
  );
}

export default function AboutPage() {
  return (
    <div className="about">
      <Philosophy />
      <TeamBlock
        heading="Who are we?"
        team={[
          {
            id: "1",
            name: "Petar Petrović",
            title: "Founder",
            photo: {
              url: "/assets/team/Petar.jpg",
              alt: "Petar Petrovic portrait",
            },
          },
          {
            id: "2",
            name: "Matilda Sutherland",
            title: "Design & Development",
            photo: {
              url: "/assets/team/Matilda.jpg",
            },
          },
          {
            id: "3",
            name: "Simba Dhaliwal",
            title: "Client Services",
            photo: {
              url: "/assets/team/Simba.jpg",
            },
          },
          {
            id: "4",
            name: "Nicole Uren",
            title: "Digital Marketing Strategist",
            photo: {
              url: "/assets/team/Nicole.jpg",
            },
          },
        ]}
      />
      <OurWhy />
    </div>
  );
}
