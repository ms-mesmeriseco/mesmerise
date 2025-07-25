import PropTypes from "prop-types";
import Image from "next/image";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import InView from "@/hooks/InView";
import Card from "@/components/ui/Card";

const columnClassMap = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-3",
  3: "lg:grid-cols-4",
  4: "lg:grid-cols-4",
};

export default function IconRow({ blockTitle = "", iconItems = [] }) {
  const safeCols = Math.min(Math.max(3, 1), 4);
  const gridColsClass = columnClassMap[safeCols] || "sm:grid-cols-3";
  return (
    <InView>
      <section className="wrapper w-full py-8 text-center">
        <h3>{blockTitle}</h3>
        <br />
        <br />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[var(--global-margin-xs)] min-h-full flex items-center justify-between">
          {iconItems.map((item, idx) => {
            const { icon, textContent } = item || {};
            const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;

            return (
              <Card key={key} icon={icon}>
                {textContent?.json && (
                  <div className="text-sm flex flex-col gap-6">
                    {documentToReactComponents(textContent.json)}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </InView>
  );
}

IconRow.propTypes = {
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
