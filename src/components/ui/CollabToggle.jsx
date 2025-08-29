"use client";

import { useRouter, usePathname } from "next/navigation";
import ToggleSwitch from "./ToggleSwitch";

/**
 * CollabToggle
 * - Navigates between /collaboration/defined and /collaboration/continuous
 * - Still works if user is on legacy paths (/defined or /continuous)
 * - Optionally allow a custom base via prop
 */
export default function CollabToggle({ base = "/collaboration" }) {
  const router = useRouter();
  const pathname = usePathname() || "";

  // Determine current mode from the URL segment, robust to both new + legacy paths
  // e.g. /collaboration/defined -> "defined", /defined -> "defined"
  const segments = pathname.split("/").filter(Boolean);
  const modeFromPath = segments.includes("defined")
    ? "defined"
    : segments.includes("continuous")
    ? "continuous"
    : "defined"; // default

  const value = modeFromPath === "defined" ? "Defined" : "Continuous";

  const handleChange = (option) => {
    const targetSlug = option === "Defined" ? "defined" : "continuous";
    const href = `${base}/${targetSlug}`;
    if (href !== pathname) {
      router.push(href);
    }
  };

  return (
    <div className="w-full fixed bottom-4 left-0 flex justify-center">
      <ToggleSwitch
        options={["Defined", "Continuous"]}
        value={value}
        onChange={handleChange}
        aria-label="Switch collaboration mode"
      />
    </div>
  );
}
