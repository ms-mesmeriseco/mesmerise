"use client";

import { useRouter, usePathname } from "next/navigation";
import ToggleSwitch from "./ToggleSwitch";
import { motion } from "framer-motion";

const OPTIONS = ["About", "Services", "Work", "Connect"];

const PATHS = {
  About: "/about",
  Services: "/services",
  Work: "/work",
  Connect: "/connect",
};

const ALIASES = {
  About: ["about", "company"],
  Services: ["services", "service"],
  Work: ["work", "projects", "project", "portfolio", "case-studies"],
  Connect: ["connect", "contact"],
};

function normalizeBase(base) {
  if (!base || base === "/") return "";
  let b = base.startsWith("/") ? base : `/${base}`;
  if (b.endsWith("/")) b = b.slice(0, -1);
  return b;
}

function stripBase(pathname, baseNorm) {
  if (!baseNorm) return pathname;
  return pathname.startsWith(baseNorm)
    ? pathname.slice(baseNorm.length) || "/"
    : pathname;
}

function firstSegment(path) {
  const segs = path.split("/").filter(Boolean);
  return segs[0] || "";
}

function labelFromPath(pathname, baseNorm) {
  const rest = stripBase(pathname, baseNorm);
  const seg = firstSegment(rest).toLowerCase();
  const hit = OPTIONS.find((label) => ALIASES[label].includes(seg));
  return hit || "";
}

function joinPaths(baseNorm, path) {
  return baseNorm ? `${baseNorm}${path}` : path;
}

export default function MenuToggle({ base = "/" }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const baseNorm = normalizeBase(base);

  const value = labelFromPath(pathname, baseNorm);

  const handleChange = (option) => {
    const dest = PATHS[option] || "/";
    const href = joinPaths(baseNorm, dest);
    if (href !== pathname) router.push(href);
  };

  // Only show on these pages (on mobile)
  const SHOW_ON = [
    "/",
    "/about",
    "/connect",
    "/services",
    "/work",
    "/collaboration/defined",
    "/collaboration/continuous",
  ];
  const shouldShowOnMobile =
    SHOW_ON.includes(pathname) || pathname.startsWith("/services/");

  return (
    <div
      className={[
        "flex justify-center",
        shouldShowOnMobile ? "flex" : "hidden md:flex",
      ].join(" ")}
    >
      <motion.div
        initial={{ opacity: 0, y: "20px" }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, delay: 0.8 },
        }}
        className="w-full"
      >
        <ToggleSwitch
          options={OPTIONS}
          value={value}
          onChange={handleChange}
          aria-label="Navigate primary sections"
          selectedBg="var(--foreground)"
          textSize="lg"
        />
      </motion.div>
    </div>
  );
}
