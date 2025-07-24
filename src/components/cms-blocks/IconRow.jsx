import PropTypes from "prop-types";
import Image from "next/image";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import InView from "@/hooks/InView";

const columnClassMap = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "md:grid-cols-3",
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
        <div
          className={`grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-[var(--global-margin-xs)] min-h-full flex items-center justify-between`}
        >
          {iconItems.map((item, idx) => {
            const { icon, textContent } = item || {};
            const key = icon?.title ? `${icon.title}-${idx}` : `icon-${idx}`;

            return (
              <motion.div
                key={key}
                initial={{ borderColor: "var(--mesm-grey)" }}
                whileHover={{ borderColor: "var(--mesm-blue)" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={
                  "flex flex-col items-left text-left gap-6 min-h-full rounded-2xl p-[2rem] justify-top border-1 border-[var(--mesm-yellow)]"
                }
                style={{
                  borderColor: "var(--mesm-grey)",
                  borderStyle: "solid",
                }}
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
                  <div className="text-sm flex flex-col gap-6">
                    {documentToReactComponents(textContent.json)}
                  </div>
                )}
              </motion.div>
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
