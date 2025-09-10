import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";

export default function Model() {
  const { nodes, materials } = useGLTF("/models/MESM_logo.glb");
  const { viewport, size } = useThree();
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.y += 0.003;
  });

  const scale = useMemo(() => {
    const isMobile = size.width < 600;
    const isTable = size.width < 1080;
    return isMobile
      ? viewport.width / 3
      : isTable
      ? viewport.width / 6
      : viewport.width / 8;
  }, [size.width, viewport.width]);

  return (
    <group scale={scale}>
      {/* <Text
        fontSize={1.2}
        font="/fonts/neue-haas/NeueHaasDisplayMedium.ttf"
        color={"white"}
        letterSpacing={0.2}
        position={[0, 0, -50]}
      >
        We don't just run adds
      </Text> */}
      <mesh ref={mesh} {...nodes.Logo}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          samples={30}
          thickness={0.05}
          anisotropicBlur={0.1}
          iridescence={0.4}
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
