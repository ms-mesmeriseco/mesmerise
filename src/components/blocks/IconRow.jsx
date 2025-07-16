import PropTypes from "prop-types";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

// Map column number to Tailwind class name (safe from purging)
const columnClassMap = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
};

export default function IconRow({
  columnNumber = 3,
  contentDirection = true,
  iconItems = [],
}) {
  const safeCols = Math.min(Math.max(columnNumber, 1), 5);
  const gridColsClass = columnClassMap[safeCols] || "sm:grid-cols-3";

  return (
    <section className="w-full py-8">
      <div className={`grid grid-cols-1 ${gridColsClass} gap-6 p-6  min-h-[50vh] flex items-center justify-between`}>
        {iconItems.map((item, idx) => {
          const { icon, textContent } = item || {};
          const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;

          return (
            <div
              key={key}
              className={`flex ${
                contentDirection
                  ? "flex-col items-center text-center"
                  : "flex-row items-center text-center"
              } gap-3`}
            >
              {icon?.url && (
                <Image
                  src={icon.url}
                  alt={icon.title || ""}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              )}
              {textContent?.json && (
                <div className="text-sm">
                  {documentToReactComponents(textContent.json)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

IconRow.propTypes = {
  columnNumber: PropTypes.number, // 1–5
  contentDirection: PropTypes.bool, // true = vertical stack, false = horizontal row
  iconItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.string,
      }),
      textContent: PropTypes.shape({
        json: PropTypes.object,
      }),
    })
  ),
};
