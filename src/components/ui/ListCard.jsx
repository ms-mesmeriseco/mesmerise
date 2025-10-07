"use client";

import { motion } from "framer-motion";

export default function ListCard({ icon, children, outline, ...props }) {
  const boxStyle = outline
    ? "border-1 border-[var(--mesm-grey-dk)] hover:border-[var(--mesm-grey-dk)] duration-200"
    : "";

  return (
    <motion.div
      whileHover={{
        backgroundColor: "var(--mesm-grey-dk)",
        translateX: "2px",
      }}
      transition={{ damping: 20, duration: 0.1 }}
      className={`flex md:flex-row flex-col gap-6 md:items-center items-start bg-[var(--mesm-grey-xd)] border-1 border-[var(--mesm-grey-dk)] md:py-4 py-8 px-8 rounded-md shadow ${boxStyle}`}
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
