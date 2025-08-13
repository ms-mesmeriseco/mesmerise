import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function LogoModel(props) {
  const { nodes, materials } = useGLTF("/gltf/MESM-Logo-Center.gltf");
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.1; // Rotate the model slowly
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes.logo_svg.geometry}
        material={materials.ShinyGlassMaterial}
        rotation={[Math.PI / 2, 0, (Math.PI / 2) * 2]}
        scale={6}
      />
    </group>
  );
}

useGLTF.preload("/gltf/MESM-Logo.gltf");
