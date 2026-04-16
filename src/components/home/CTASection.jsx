import HeroButton from "@/components/ui/HeroButton";
import StaggeredWords from "@/hooks/StaggeredWords";

export default function CTASection() {
  return (
    <section className="w-full min-h-[50vh] grid grid-cols-1 md:grid-cols-2 gap-16 ]">
      <div className="flex flex-col gap-8 items-start"></div>

      <div className="flex flex-col gap-8 justify-center ">
        <StaggeredWords
          as="h2"
          text="Ready to work with Melbourne's premium boutique digital marketing agency?"
          className="page-title-medium text-white text-3xl md:text-4xl leading-[1.1] tracking-tight"
        />
        <StaggeredWords
          as="p"
          text="Book in for a consultation and let's talk about how we can craft brand, web, and content experiences that look stunning — and convert."
          className="text-base leading-relaxed"
        />
        <HeroButton href="/contact">Book a consultation</HeroButton>
      </div>
    </section>
  );
}
