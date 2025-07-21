import ServicesPage from "@/components/services/ServicesPage";

export default function WebsitePage() {
  return (
    <ServicesPage
      heroImage="/video-placeholder.jpg"
      trustBadgeText={"Trusted by..."}
      trustBadgeLogos={[
        { url: "/logoMark-SVG_mesm.svg", title: "Client 1" },
        { url: "/logoMark-SVG_mesm.svg", title: "Client 2" },
      ]}
      column1Content={[
        <h1 key="heading">
          What We Build Isn&apos;t Just a Website, It&apos;s a Growth Engine.
        </h1>,
        <p key="p">
          Whether you’re a startup launching your first site or an enterprise
          ready to revitalise your digital presence, we build websites that
          align with your audience, strengthen your brand, and deliver results
          that matter.
          <br />
          <br />
          Our research-driven, systemic approach ensures your website resonates
          with your people, represents your business with integrity, and
          supports meaningful growth long after launch.
        </p>,
      ]}
      column2Content={[""]}
      serviceTags={[
        "Front-end Development",
        "Back-end Systems",
        "CMS Integration",
        "Accessibility",
        "Performance",
        "SEO Foundations",
      ]}
      processSteps={[
        {
          title: "Discovery",
          content:
            "We analyse your business goals, audience, and market to lay the strategic foundation for a site that performs and connects.",
        },
        {
          title: "Ideation",
          content:
            "Through architecture, wireframes, and style exploration, we develop concepts that align user needs with your vision.",
        },
        {
          title: "Design",
          content:
            "We craft comprehensive, systematic designs that embody your brand, enhance usability, and meet your objectives.",
        },
        {
          title: "Development",
          content:
            "We bring your website to life with a tailored build that meets your technical needs and future-proofs your presence. Whether it be fully custom, or utilising a powerful web builder.",
        },
        {
          title: "Quality Assurance",
          content:
            "This is an important stage. Here, we can iron out any creases in design or build, ensuring your complete satisfaction with the finished product.",
        },
        {
          title: "Handover",
          content:
            "Your fully functional website is handed over with all documentation and team training needed to manage it effectively.",
        },
      ]}
    />
  );
}
