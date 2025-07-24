import PrimaryButton from "@/components/ui/PrimaryButton";
import InView from "@/hooks/InView";

export default function CollaborationDetail({
  title,
  audiencePoints = [],
  steps = [],
  cta,
  metrics = [],
}) {
  return (
    <InView>
      <div className="space-y-[var(--global-margin-lg)]">
        {/* Audience Section */}
        <div className="space-y-[var(--global-margin-sm)]">
          <h2 className="text-3xl font-medium">{title} – Who’s this for?</h2>
          <p>
            Our <strong>{title}</strong> model is designed for teams seeking
            clear, purpose-built engagements with a strong bias for execution
            and outcome.
          </p>
          <ul className="space-y-4 text-base mt-[var(--global-margin-sm)]">
            {audiencePoints.map(({ title, desc }, idx) => (
              <li
                key={idx}
                className="border-b border-[var(--foreground)] pb-2"
              >
                <p className="font-semibold">✔️ {title}</p>
                <p className="text-sm">{desc}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps Section */}
        <div className="space-y-[var(--global-margin-sm)]">
          <h2 className="text-2xl font-medium">
            Ready to start? Here’s next steps
          </h2>
          {steps.map(({ step, text }, idx) => (
            <div
              key={idx}
              className="border-l-4 border-[var(--foreground)] pl-4 py-2"
            >
              <h3 className="font-bold">{step}</h3>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {cta && (
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{cta.headline}</p>
            <p>{cta.subtext}</p>
            <PrimaryButton href={cta.href} size="large">
              {cta.label}
            </PrimaryButton>
          </div>
        )}

        {/* Metrics Section */}
        <div className="grid md:grid-cols-2 gap-[var(--global-margin-sm)] pt-[var(--global-margin-sm)] border-t-1 border-[var(--foreground)]">
          {metrics.map(({ title, desc }, idx) => (
            <div
              key={idx}
              className="border-1 rounded-md p-[var(--global-margin-sm)]"
            >
              <h4 className="text-xl font-semibold">{title}</h4>
              <p className="text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </InView>
  );
}
