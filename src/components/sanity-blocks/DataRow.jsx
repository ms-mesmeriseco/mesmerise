"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import StaggeredWords from "@/hooks/StaggeredWords";
import InView from "@/hooks/InView";

function StatCard({ title, sub, logo, index }) {
  return (
    <motion.article
      className="relative flex flex-col border border-[var(--mesm-grey-dk)] rounded-lg p-6 md:p-7 gap-3 bg-black/20 hover:bg-white/5 transition-colors cursor-default group min-h-[250px]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
    >
      {/* 1. The Value (Title) */}
      <StaggeredWords
        as="h3"
        className="font-semibold leading-tight page-title-medium"
        text={title}
      />

      {/* 2. The Label (Subtitle) */}
      <p className="text-base md:text-lg opacity-80">{sub}</p>

      {/* 3. The Logo - Positioned at the bottom */}
      {logo && (
        <div className="mt-auto pt-4 flex items-center">
          <div className="h-[75px] flex items-center w-auto transition-opacity duration-500">
            <Image
              src={logo}
              alt=""
              width={80}
              height={24}
              className="object-contain brightness-200"
              style={{ objectPosition: "left" }}
            />
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default function DataRow({ stats = [] }) {
  if (!stats || stats.length === 0) return null;

  const count = stats.length;

  // Dynamic grid mapping
  const gridConfig = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  const gridClass = gridConfig[count] || "md:grid-cols-2";

  return (
    <section
      data-marker="RESULTS"
      className="relative py-12 md:py-16 text-white"
    >
      <InView>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className={`grid md:grid-cols-2 ${gridClass} gap-[var(--global-margin-xs)]`}
        >
          {stats.map((s, idx) => (
            <StatCard
              key={s._key || idx}
              index={idx}
              title={s.value}
              sub={s.label}
              logo={s.logo}
            />
          ))}
        </motion.div>
      </InView>
    </section>
  );
}
