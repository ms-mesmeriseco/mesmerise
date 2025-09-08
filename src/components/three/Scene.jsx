import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, SpotLight } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import LogoModel2 from "./LogoModel2.jsx";

export default function Scene() {
  return (
    <Canvas
      shadows
      className="w-[100%] h-[100%]"
      camera={{ position: [0, 0, -2], fov: 45 }}
    >
      {/* Controls (optional) */}
      <OrbitControls enableDamping />

      {/* Subtle ambient base */}
      <ambientLight intensity={0.2} />

      {/* Key light (brightest, front-right) */}
      <spotLight
        position={[2.5, 1.5, 2.5]}
        angle={0.6}
        penumbra={0.5}
        intensity={2.2}
        castShadow
      />

      {/* Fill light (front-left, softer) */}
      <spotLight
        position={[-1.5, 0.8, 2]}
        angle={0.8}
        penumbra={0.6}
        intensity={0.9}
      />

      {/* Rim/back light (gives edge highlight) */}
      <SpotLight
        position={[-2, 1.2, -2]}
        angle={0.7}
        // penumbra={0.6}
        // intensity={1.4}
        attenuation={5}
        anglePower={5}
      />

      {/* Top light */}
      <pointLight position={[0, 3, 0]} intensity={0.7} />
      <Environment files="/hdr/Light_Arches_E.hdr" background={true} />

      <LogoModel2 />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.9}
          luminanceSmoothing={0.1}
          intensity={0.35}
        />
      </EffectComposer>
    </Canvas>
  );
}
