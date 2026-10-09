"use client";

import { motion } from "framer-motion";

const STAR =
  "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z";

// Hero eyebrow: five stars pop in one by one next to a static label
export default function StarEyebrow({ children }) {
  return (
    <h5 className="inline-flex items-center gap-2.5 rounded-lg bg-[var(--dark-grey)] py-2.5 pl-2.5 pr-3.5 text-left uppercase tracking-[0.03em] text-[var(--mesm-blue)]">
      {/* <span className="flex shrink-0 gap-0.5 text-[var(--mesm-yellow)]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="h-[13px] w-[13px] fill-current"
            initial={{ opacity: 0, scale: 0, rotate: -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 18,
              delay: 0.25 + i * 0.09,
            }}
          >
            <path d={STAR} />
          </motion.svg>
        ))}
      </span> */}
      <span className="star-eyebrow-label">{children}</span>
    </h5>
  );
}
