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
      className="flex items-center justify-center text-white min-h-screen max-w-[1200px]"
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
                Let's connect
              </HeroButton>
            </div>
          )}
        </InView>
      </div>
    </section>
  );
}
