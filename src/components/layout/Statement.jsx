import InView from "@/hooks/InView";
import StaggeredWords from "@/hooks/StaggeredWords";
import HeroButton from "../ui/HeroButton";

export default function Statement({
  marker,
  text,
  className,
  showCTA = false,
}) {
  return (
    <section
      data-marker={marker}
      className="min-h-[50vh] flex items-start justify-center text-[var(--foreground)] max-w-[1280px] py-8"
    >
      <div className="text-left">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className={className ?? "page-title-large"}
          />
          {showCTA && (
            <div className="mt-8">
              <HeroButton href="/connect" size="lg">
                <h3>Let's connect</h3>
              </HeroButton>
            </div>
          )}
        </InView>
      </div>
    </section>
  );
}
