import HeaderLarger from "@/components/layout/HeaderLarger";
import CollabToggle from "@/components/ui/CollabToggle";

export default function PerpetualCollab() {
  return (
    <section
      data-marker="defined collaboration"
      className="h-[80vh] flex items-center border-b-1 p-[var(--global-margin-lg)]"
    >
      <HeaderLarger title="Perpetual" />
      <p>
        This is the placeholder content for the Perpetual collaboration page.
      </p>
      <CollabToggle />
    </section>
  );
}
