"use client";
import { createContext, useContext, useState, useEffect } from "react";

const HeroLoaderContext = createContext();

export function HeroLoaderProvider({ children }) {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // Guarantee sceneReady is true after 5s no matter what
    const fallback = setTimeout(() => setSceneReady(true), 5000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <HeroLoaderContext.Provider value={{ sceneReady, setSceneReady }}>
      {children}
    </HeroLoaderContext.Provider>
  );
}

export const useHeroLoader = () => useContext(HeroLoaderContext);
