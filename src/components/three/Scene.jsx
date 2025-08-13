import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import LogoModel from "./LogoModel.jsx";

export default function Scene() {
  return (
    <Canvas
      shadows
      className="w-[100%] h-[100%]"
      camera={{ position: [0, 0, -2] }}
    >
      {/* <OrbitControls /> */}
      <LogoModel />
    </Canvas>
  );
}
