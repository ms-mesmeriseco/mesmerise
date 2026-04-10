"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import InView from "@/hooks/InView";
import SmallTitle from "../ui/SmallTitle";

const clientLogosQuery = `
  *[_type == "clientLogo"] | order(order asc) {
    _id,
    clientName,
    url,
    "logoUrl": logo.asset->url,
  }
`;

function LogoCard({ clientName, logoUrl, url, index }) {
  const card = (
    <motion.div
      className="relative flex flex-col p-6 md:p-8 group"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
    >
      <span className="absolute top-3 left-3 text-sm text-white/40 bg-[var(--mesm-grey-dk)]/40 border border-[var(--mesm-grey-dk)]/60 rounded-xl px-2.5 py-1 leading-relaxed group-hover:bg-[var(--mesm-blue)] group-hover:text-[var(--background)] transition-colors duration-150">
        {clientName}
      </span>
      <div className="flex items-center justify-center w-full h-24 mt-4">
        <Image
          src={logoUrl}
          alt={clientName}
          width={124}
          height={48}
          className="object-contain max-h-14 w-auto brightness-0 invert"
        />
      </div>
    </motion.div>
  );

  //   if (url) {
  //     return (
  //       <a href={url} target="_blank" rel="noopener noreferrer" className="block">
  //         {card}
  //       </a>
  //     );
  //   }

  return card;
}

export default function TrustedBy() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await sanityClient.fetch(clientLogosQuery);
        setClients(data || []);
      } catch (error) {
        console.error("Failed to fetch client logos:", error);
      }
    }
    fetchClients();
  }, []);

  if (!clients.length) return null;

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.06 },
    },
  };

  return (
    <section className="relative py-12 md:py-16 text-white">
      <InView>
        <SmallTitle>Trusted by</SmallTitle>

        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-[var(--global-margin-xs)]"
        >
          {clients.map((client, idx) => (
            <LogoCard key={client._id} index={idx} {...client} />
          ))}
        </motion.div>
      </InView>
    </section>
  );
}
