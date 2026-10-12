import { verifyResultsToken } from "@/lib/cmo-benchmark/resultsLink";
import SharedResults from "./SharedResults";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketing benchmark results | Mesmerise",
  robots: { index: false, follow: false },
};

export default async function SharedResultsPage({ params }) {
  const { token } = await params;
  const link = verifyResultsToken(token);

  return (
    <div className="flex flex-col min-h-screen pt-12 pb-48 px-[var(--global-margin-sm)]">
      <div className="w-full max-w-4xl mx-auto">
        <SharedResults
          answers={link?.answers ?? null}
          firstName={link?.firstName ?? ""}
          company={link?.company ?? ""}
          expires={link?.expires ?? null}
          expired={link?.expired === true}
        />
      </div>
    </div>
  );
}
