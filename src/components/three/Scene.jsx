// Scene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import LogoModel2 from "./LogoModel2.jsx";

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, -2], fov: 45 }}
      gl={{ antialias: true, physicallyCorrectLights: true }}
    >
      {/* Optional controls */}
      <OrbitControls enableDamping />
      <color attach="background" args={["#ff3700"]} />

      {/* === HDRI: photo-studio_4K.exr (Equirectangular, strength ~0.25) === */}
      {/* In Blender the strength is 0.25; Drei's Environment uses intensity. */}
      <Environment
        files="/hdr/photo-studio_4K-red-2.exr"
        background={false}
        intensity={0.1}
      />

      {/* === Lights from screenshots === */}
      {/* Subtle base */}
      <ambientLight intensity={0.25} />

      {/* Fill A (Point_Fill)  X=3535.5mm, Y=-3535.5mm, Z=5000mm */}
      <pointLight
        position={[3.5355, -3.5355, 5]}
        intensity={1} // Blender showed Power=1000, Exposure=0; this 3–4 is a good starting point
        distance={0}
        decay={2}
        castShadow
      />

      {/* Fill B (second fill in screenshots)  X=-2191.9mm, Y=-4494mm, Z=5000mm */}
      <pointLight
        position={[-2.1919, -4.494, 5]}
        intensity={2.5}
        distance={0}
        decay={2}
      />

      {/* Key (Point_Key)  X=60.504mm, Y=0, Z=2178.6mm  -> sits almost in front */}
      <pointLight
        position={[0.0605, 0, 2.1786]}
        intensity={6}
        distance={4}
        decay={2}
        castShadow
      />

      {/* Sun (Directional)  Exposure=10, Angle≈0.526° in Blender.
          Three.js has no "angle" on directional; use intensity + a broad direction. */}
      <directionalLight position={[5, 5, 5]} intensity={2.5} castShadow />

      <LogoModel2 />

      {/* Gentle highlight bloom like a photo studio */}
      {/* <EffectComposer>
        <Bloom
          luminanceThreshold={0.9}
          luminanceSmoothing={0.1}
          intensity={0.25}
        />
      </EffectComposer> */}
    </Canvas>
  );
}
