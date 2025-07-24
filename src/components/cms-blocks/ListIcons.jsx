import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function ListIcons({ items = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };
  const child = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.ul
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-1 sm:grid-cols-1 gap-4"
    >
      {items.map((item, index) => (
        <motion.li
          variants={child}
          key={index}
          whileHover={{
            backgroundColor: "var(--mesm-red)",
            translateX: "2px",
          }}
          transition={{ damping: 20, duration: 0.1 }}
          className="flex gap-4 items-start bg-[var(--mesm-grey-dk)] py-4 px-8 rounded-2xl shadow cursor-pointer"
        >
          {item.icon?.url && (
            <img
              src={item.icon.url}
              alt={item.icon.title || ""}
              className="w-10 h-10 object-contain"
            />
          )}
          <div className="prose">
            {item.textContent?.json &&
              documentToReactComponents(item.textContent.json)}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
