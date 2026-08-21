import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";

export default function FunnelModel({ flipped = false, ...props }) {
  const { nodes, materials } = useGLTF("/models/Large-funnel.glb");
  const modelRef = useRef();
  const targetFlipRef = useRef(0);
  const [accentColor, setAccentColor] = useState("#ffffff");

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent2")
      .trim();
    if (value) setAccentColor(value);
  }, []);

  targetFlipRef.current = flipped ? Math.PI : 0;

  useFrame((state, delta) => {
    modelRef.current.rotation.y +=
      (targetFlipRef.current - modelRef.current.rotation.y) *
      Math.min(delta * 4, 1);
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={modelRef}
        castShadow
        receiveShadow
        geometry={nodes.Curve.geometry}
        material={materials.SVGMat}
        position={[-2, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={20}
      >
        <MeshTransmissionMaterial
          color={accentColor}
          backside
          backsideThickness={0.1}
          samples={10}
          thickness={0.3}
          transmission={0.97}
          roughness={0.05}
          anisotropicBlur={0.1}
          iridescence={2}
          iridescenceIOR={1}
          clearcoat={10}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/Large-funnel.glb");
