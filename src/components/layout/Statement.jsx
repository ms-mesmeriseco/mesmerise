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
      className="flex items-center justify-center text-[var(--foreground)] min-h-screen max-w-[1280px]"
    >
      <div className="text-left">
        <InView>
          <StaggeredWords
            as="h2"
            text={text}
            className={className ?? "page-title-large"}
            margin="-40% 0px"
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
