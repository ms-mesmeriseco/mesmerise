import CollabTemplate from "../_components/CollabTemplate";
import { DEFINED_CONTENT } from "../content/defined";
import { CONTINUOUS_CONTENT } from "../content/continuous";
import { notFound } from "next/navigation";

const MAP = {
  defined: DEFINED_CONTENT,
  continuous: CONTINUOUS_CONTENT,
};

export default function Page({ params }) {
  const { mode } = params;
  const content = MAP[mode];
  if (!content) return notFound();
  return <CollabTemplate content={content} currentSlug={mode} />;
}

// Optional: make static params for SSG
export function generateStaticParams() {
  return [{ mode: "defined" }, { mode: "continuous" }];
}

// Optional: dynamic metadata per mode
export function generateMetadata({ params }) {
  const title =
    params.mode === "defined"
      ? "Defined Collaboration Model | Mesmerise Digital"
      : "Continuous Collaboration Model | Mesmerise Digital";
  const description =
    params.mode === "defined"
      ? "A structured, strategy-led model for brands needing clarity, speed and results. Defined Collaboration delivers end-to-end service from concept to launch."
      : "Our ongoing partnership model built for ambitious brands. Continuous Collaboration keeps strategy, performance and design evolving in perfect sync for sustained growth.";
  const canonical = `/collaboration/${params.mode}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title },
  };
}
