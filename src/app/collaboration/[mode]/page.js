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
      ? "Defined Collaboration"
      : "Continuous Collaboration";
  const canonical = `/collaboration/${params.mode}`;
  return {
    title,
    alternates: { canonical },
    openGraph: { title },
  };
}
