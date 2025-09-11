import InView from "@/hooks/InView";
import BlockRenderer from "@/lib/utils/BlockRenderer";

export default function TwoColumn({ column1 = [], column2 = [], align }) {
  return (
    <InView>
      <section className="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-6 min-h-[80vh] items-start">
        {/* Column 1 */}
        <div className="blockAlignment flex flex-col gap-6">
          {column1.map((block, index) => (
            <BlockRenderer
              key={`col1-${index}`}
              block={block}
              index={index}
              center={align}
            />
          ))}
        </div>

        {/* Column 2 */}
        <div className="blockAlignment flex flex-col gap-6">
          {column2.map((block, index) => (
            <BlockRenderer
              key={`col2-${index}`}
              block={block}
              index={index}
              center={align}
            />
          ))}
        </div>
      </section>
    </InView>
  );
}
