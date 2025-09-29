// hooks/useClientGates.js
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener?.("change", onChange) ?? mql.addListener(onChange);
    return () =>
      mql.removeEventListener?.("change", onChange) ??
      mql.removeListener(onChange);
  }, [query]);
  return matches;
}

export function usePerfGates() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [saveData, setSaveData] = useState(false);
  const [effectiveType, setEffectiveType] = useState("4g");

  useEffect(() => {
    const c =
      navigator.connection ||
      navigator.webkitConnection ||
      navigator.mozConnection;
    if (!c) return;
    const update = () => {
      setSaveData(!!c.saveData);
      setEffectiveType(c.effectiveType || "4g");
    };
    update();
    c.addEventListener?.("change", update);
    return () => c.removeEventListener?.("change", update);
  }, []);

  // very low-end if any of these are true
  const lowEnd =
    isMobile &&
    (prefersReduced || saveData || /2g|slow-2g|3g/.test(effectiveType));
  return { isMobile, prefersReduced, saveData, effectiveType, lowEnd };
}
