import { motion } from "framer-motion";

export default function ListCard({ icon, children, ...props }) {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "var(--mesm-grey-dk)",
        translateX: "2px",
      }}
      transition={{ damping: 20, duration: 0.1 }}
      className="flex gap-8 items-center bg-[var(--mesm-grey-xd)] py-4 px-8 rounded-2xl shadow cursor-pointer"
      {...props}
    >
      {icon?.url && (
        <img
          src={icon.url}
          alt={icon.title || ""}
          className="w-10 h-10 object-contain"
        />
      )}
      <div className="prose">{children}</div>
    </motion.div>
  );
}
