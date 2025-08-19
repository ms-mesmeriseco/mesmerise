import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Card({ icon, children }) {
  return (
    <motion.div
      initial={{
        borderColor: "var(--mesm-grey-dk)",
        backgroundColor: "var(--mesm-grey-xd)",
      }}
      whileHover={{
        borderColor: "var(--mesm-blue)",
        backgroundColor: "var(--mesm-grey-dk)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col items-left text-left gap-8 min-h-full rounded-sm p-[2rem] justify-between border-1 border-[var(--mesm-grey-dk)] [&>p+p]:mt-4"
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
      {children}
    </motion.div>
  );
}

Card.propTypes = {
  icon: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
  }),
  children: PropTypes.node,
};
