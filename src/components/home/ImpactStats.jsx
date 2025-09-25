import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";

function StatCard({ title, sub, body, index }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const colors = [
    "bg-[var(--mesm-red)]",
    "bg-[var(--mesm-blue)]",
    "bg-[var(--mesm-yellow)]",
  ];
  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPos({ x, y }));
  };
  const handleEnter = () => setVisible(true);
  const handleLeave = () => setVisible(false);
  const handleTouchStart = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const t = e.touches?.[0];
    const x = (t?.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (t?.clientY ?? rect.top + rect.height / 2) - rect.top;
    setPos({ x, y });
    setVisible((v) => !v);
  };
  return (
    <motion.article
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onTouchStart={handleTouchStart}
      className="relative flex flex-col justify-between border border-[var(--mesm-grey-dk)] rounded-lg p-6 md:p-7 flex flex-col gap-3 bg-black/20 hover:bg-white/5 transition-colors cursor-default"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <StaggeredWords
        as="h3"
        className="font-semibold leading-tight page-title-xl"
        text={title}
      />
      <p className="text-base md:text-lg opacity-80">{sub}</p>
      {/* Tooltip: top-left corner pinned to cursor */}
      {visible && (
        <motion.div
          role="tooltip"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={
            "pointer-events-none absolute z-10 w-86 max-w-[85 %] rounded-xl border border-[var(--mesm-grey-dk)] px-3 py-1 bg-[var(--mesm-blue)] shadow-md backdrop-blur-sm"
          }
          style={{ left: pos.x, top: pos.y }}
        >
          <p className="p2 opacity-90 text-[var(--background)]">{body}</p>
        </motion.div>
      )}{" "}
    </motion.article>
  );
}

export default function ImpactStats() {
  const stats = [
    {
      title: "$10M+",
      sub: "Total client revenue",
      body: "Real results over the last 3 years. Money in the bank, not just numbers on a report.",
    },
    {
      title: "25X",
      sub: "Average ROAS",
      body: "Most of our clients see a 25X return on ad spend, with a few breaking records and hitting 100X. That means every time someone puts in $1 they get back $25. If you find a better investment let us know.",
    },
    {
      title: "3,000%",
      sub: "More website traffic",
      body: "From zero to hero. Some clients see a staggering 7,998% increase in traffic. That’s a lot of eyeballs.",
    },
    {
      title: "874%",
      sub: "Average enquiries increase",
      body: "No more waiting for the phone to ring. Clients move from chasing work to switching off the phone until they can hire more staff. At the top end, enquiries grew by 2,800%.",
    },
  ];

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.08 },
    },
  };

  return (
    <section
      data-marker="RESULTS"
      className="relative py-12 md:py-16 text-white h-[80vh]"
    >
      <InView>
        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[var(--global-margin-xs)] h-full"
        >
          {stats.map((s, idx) => (
            <StatCard key={idx} {...s} index={idx} />
          ))}
        </motion.div>
      </InView>
    </section>
  );
}
