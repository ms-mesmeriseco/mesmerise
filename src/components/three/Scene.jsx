"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
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

export default function Scene({ onLoaded }) {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      className="block h-[100dvh] w-[100dvw]"
    >
      {/* <OrbitControls enableDamping /> */}
      <Suspense fallback={<SceneLoadedNotifier onLoaded={onLoaded} />}>
        <directionalLight intensity={0.25} position={[0, 1, 2]} />
        <Environment files="/hdr/photo-studio_4K.exr" />

        <Model />
      </Suspense>

      {/* <color attach="background" args={["#ff3700"]} /> */}
    </Canvas>
  );
}
