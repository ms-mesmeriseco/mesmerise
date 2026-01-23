"use client";

import { motion } from "framer-motion";

export default function ListCard({
  icon,
  children,
  entryTitle,
  outline,
  ...props
}) {
  return (
    <motion.div
      whileHover={{
        translateX: "1px",
      }}
      transition={{ damping: 20, duration: 0.1 }}
      className={`flex md:flex-row flex-col md:max-w-3xl gap-6 md:items-center items-start bg-[var(--mesm-grey-xd)] hover:bg-[var(--mesm-grey)]/35 border-1 border-[var(--mesm-grey-dk)] md:py-4 py-8 px-8 rounded-sm shadow hover:border-[var(--mesm-grey)] duration-200`}
      {...props}
    >
      {icon && (
        <img
          src={icon}
          alt={entryTitle || ""}
          className="w-10 h-10 object-contain fill-[var(--mesm-blue)]"
        />
      )}
      <div className="prose">{children}</div>
    </motion.div>
  );
}
