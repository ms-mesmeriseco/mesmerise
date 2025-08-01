import ListCard from "@/components/ui/ListCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function ListIcons({ items = [] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.03 } },
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
        <motion.li variants={child} key={index} className=" no-list">
          <ListCard icon={item.icon}>
            {item.textContent?.json &&
              documentToReactComponents(item.textContent.json)}
          </ListCard>
        </motion.li>
      ))}
    </motion.ul>
  );
}
