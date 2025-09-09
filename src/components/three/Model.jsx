import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";

export default function Model() {
  const { nodes, materials } = useGLTF("/models/MESM_logo.glb");
  const { viewport } = useThree();
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.y += 0.003;
  });

  return (
    <group scale={viewport.width / 6}>
      {/* <Text
        fontSize={1.2}
        font="/fonts/neue-haas/NeueHaasDisplayMedium.ttf"
        color={"white"}
        letterSpacing={0.2}
        position={[0, 0, -3]}
      >
        MESMERISE
      </Text> */}
      <mesh ref={mesh} {...nodes.Logo}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          samples={30}
          thickness={0.2}
          anisotropicBlur={0.1}
          iridescence={0.1}
          iridescenceIOR={1}
          //   iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/MESM_logo.glb");
