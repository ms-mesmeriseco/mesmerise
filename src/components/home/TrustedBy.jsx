"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { sanityClient } from "@/sanity/client";
import InView from "@/hooks/InView";
import SmallTitle from "../ui/SmallTitle";

const clientLogosQuery = `
  *[_type == "clientLogo"] | order(coalesce(order, 50) asc) {
    _id,
    clientName,
    url,
    "logoUrl": logo.asset->url,
 
  }
`;

function LogoCard({ clientName, logoUrl, index, url }) {
  return (
    <motion.div
      className="relative flex flex-col p-6 md:p-8 group"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
    >
      {url ? (
        <a
          href={url}
          target={url.includes("mesmeriseco.com") ? "_self" : "_blank"}
          rel=" noreferrer"
        >
          <span className="absolute top-3 left-3 text-sm text-[var(--foreground)]/40 bg-[var(--mesm-grey-dk)]/30 border border-[var(--mesm-grey-dk)]/50 rounded-xl px-2.5 py-1 leading-relaxed group-hover:bg-[var(--mesm-blue)] group-hover:text-[var(--background)] transition-colors duration-50">
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
        </a>
      ) : (
        <div>
          <span className="absolute top-3 left-3 text-sm text-[var(--foreground)]/40 bg-[var(--mesm-grey-dk)]/30 border border-[var(--mesm-grey-dk)]/50 rounded-xl px-2.5 py-1 leading-relaxed group-hover:bg-[var(--mesm-blue)] group-hover:text-[var(--background)] transition-colors duration-50">
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
        </div>
      )}
    </motion.div>
  );
}

// Marquee card — simpler, no motion stagger needed inside the ticker
function MarqueeCard({ clientName, logoUrl }) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 mx-3 group">
      <div className="relative flex flex-col items-center justify-center p-4 w-full h-24 bg-black/20">
        <Image
          src={logoUrl}
          alt={clientName}
          width={100}
          height={40}
          className="object-contain max-h-10 w-auto brightness-0 invert mt-3"
        />
      </div>
    </div>
  );
}
// Repeats the logo set until it overfills the row, then slides by one set
// width so the loop is seamless on any screen size
export function MarqueeRow({ clients, reverse = false }) {
  const rowRef = useRef(null);
  const setRef = useRef(null);
  const [setWidth, setSetWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    if (!rowRef.current || !setRef.current) return;

    const measure = () => {
      const width = setRef.current.offsetWidth;
      setSetWidth(width);
      if (width) {
        setCopies(Math.max(2, Math.ceil(rowRef.current.offsetWidth / width) + 1));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [clients]);

  return (
    <div ref={rowRef} className="overflow-hidden w-full">
      <div
        style={
          setWidth
            ? {
                "--marquee-offset": `-${setWidth}px`,
                animation: `${reverse ? "marquee-reverse" : "marquee"} ${setWidth / 30}s linear infinite`,
              }
            : { visibility: "hidden" }
        }
        className="flex w-max"
      >
        {Array.from({ length: copies }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            className="flex shrink-0"
            aria-hidden={copy > 0 || undefined}
          >
            {clients.map((client) => (
              <MarqueeCard key={`${client._id}-${copy}`} {...client} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee({ clients }) {
  const mid = Math.ceil(clients.length / 2);
  const rowOne = clients.slice(0, mid);
  const rowTwo = clients.slice(mid);

  return (
    <div className="flex flex-col gap-4">
      <MarqueeRow clients={rowOne} />
      <MarqueeRow clients={rowTwo} reverse />
    </div>
  );
}

export function useClientLogos() {
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

  return clients;
}

export default function TrustedBy() {
  const clients = useClientLogos();

  if (!clients.length) return null;

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.06 },
    },
  };

  return (
    <section className="relative py-12 md:py-16 text-[var(--foreground)] ">
      <InView>
        <SmallTitle>Trusted by</SmallTitle>

        {/* Mobile: marquee ticker */}
        <div className="md:hidden mt-6">
          <Marquee clients={clients} />
        </div>

        {/* Desktop: grid */}
        <motion.div
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-[var(--global-margin-xs)]"
        >
          {clients.map((client, idx) => (
            <LogoCard key={client._id} index={idx} {...client} />
          ))}
        </motion.div>
      </InView>
    </section>
  );
}
