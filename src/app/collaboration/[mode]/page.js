import CollabTemplate from "../_components/CollabTemplate";
import { DEFINED_CONTENT } from "../content/defined";
import { CONTINUOUS_CONTENT } from "../content/continuous";
import { notFound } from "next/navigation";

const MAP = {
  defined: DEFINED_CONTENT,
  continuous: CONTINUOUS_CONTENT,
};

export default async function Page({ params }) {
  // ⬇️ unwrap params (Next 15+ app router)
  const { mode } = await params;
  const content = MAP[mode];

  if (!content) {
    notFound(); // throws a 404 boundary
  }

  return <CollabTemplate content={content} currentSlug={mode} />;
}

// Optional: make static params for SSG
export function generateStaticParams() {
  return [{ mode: "defined" }, { mode: "continuous" }];
}

// Optional: dynamic metadata per mode
export async function generateMetadata({ params }) {
  // ⬇️ unwrap params here too
  const { mode } = await params;

  const title =
    mode === "defined"
      ? "Defined Collaboration Model | Mesmerise Digital"
      : "Continuous Collaboration Model | Mesmerise Digital";

  const description =
    mode === "defined"
      ? "A structured, strategy-led model for brands needing clarity, speed and results. Defined Collaboration delivers end-to-end service from concept to launch."
      : "Our ongoing partnership model built for ambitious brands. Continuous Collaboration keeps strategy, performance and design evolving in perfect sync for sustained growth.";

  const canonical = `/collaboration/${mode}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title },
  };
}
