"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./Model.jsx";

function SceneLoadedNotifier({ onLoaded }) {
  // Fallback mounted => we're loading
  // Fallback unmounted => loaded
  useEffect(() => {
    onLoaded?.(false);
    return () => onLoaded?.(true);
  }, [onLoaded]);
  return null;
}

function ScrollScaler({ children }) {
  const groupRef = useRef();
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Normalize scroll: 0 at top, 1 at 100vh scrolled
      scrollProgress.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    // Lerp for smooth animation: scale from 1 → 0.15
    const targetScale = 1 - scrollProgress.current * 0.85;
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Scene({ onLoaded }) {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  // Combine local state update with the parent callback
  function handleLoaded(loaded) {
    setSceneLoaded(loaded);
    onLoaded?.(loaded);
  }

  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      className="block h-[90dvh] w-[100dvw]"
    >
      {/* <OrbitControls enableDamping /> */}
      <Suspense fallback={<SceneLoadedNotifier onLoaded={onLoaded} />}>
        <directionalLight intensity={0.25} position={[0, 1, 2]} />
        <Environment files="/hdr/photo-studio_4K.exr" />

        <ScrollScaler>
          <Model />
        </ScrollScaler>
      </Suspense>

      {/* <color attach="background" args={["#ff3700"]} /> */}
    </Canvas>
  );
}
