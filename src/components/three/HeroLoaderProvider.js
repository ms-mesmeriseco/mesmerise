"use client";
import { createContext, useContext, useState } from "react";

const HeroLoaderContext = createContext();

export function HeroLoaderProvider({ children }) {
  const [sceneReady, setSceneReady] = useState(false);
  return (
    <HeroLoaderContext.Provider value={{ sceneReady, setSceneReady }}>
      {children}
    </HeroLoaderContext.Provider>
  );
}

export const useHeroLoader = () => useContext(HeroLoaderContext);
