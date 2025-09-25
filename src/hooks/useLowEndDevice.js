"use client";

import { useEffect, useMemo, useState } from "react";

export default function useLowEndDevice() {
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const c =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (c && typeof c.saveData === "boolean") setSaveData(c.saveData);
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const coarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;

  const deviceMemory = navigator.deviceMemory || 0;
  const cpus = navigator.hardwareConcurrency || 2;

  const lowEnd = useMemo(() => {
    if (saveData) return true;
    if (prefersReducedMotion) return true;
    if (deviceMemory && deviceMemory <= 2) return true;
    if (cpus <= 4) return true;
    if (coarsePointer && (deviceMemory <= 3 || cpus <= 4)) return true;
    return false;
  }, [saveData, prefersReducedMotion, deviceMemory, cpus, coarsePointer]);

  return lowEnd;
}
