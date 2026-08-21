import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { MathUtils } from "three";

const BASE_ROTATION_X = Math.PI / 2;
const BASE_SCALE = 20;
const SCROLL_ZOOM_RANGE = 0.03; // super subtle: +/-3% scale

export default function FunnelModel({
  flipped = false,
  tiltIntensity = 0.2,
  damp = 0.08,
  ...props
}) {
  const { nodes, materials } = useGLTF("/models/Large-funnel.glb");
  const { size, gl } = useThree();
  const modelRef = useRef();
  const targetFlipRef = useRef(0);
  const offset = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [accentColor, setAccentColor] = useState("#ffffff");
  const isMobile = size.width < 768;

  // --- SCROLL ZOOM: scale nudges up as the canvas nears viewport center ---
  useEffect(() => {
    const handleScroll = () => {
      const rect = gl.domElement.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.abs(elementCenter - viewportCenter);
      scrollProgress.current = 1 - Math.min(distance / window.innerHeight, 1);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [gl]);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent2")
      .trim();
    if (value) setAccentColor(value);
  }, []);

  // --- MOUSE TILT ---
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
      offset.current.y = MathUtils.clamp(
        -nx * tiltIntensity,
        -tiltIntensity,
        tiltIntensity,
      );
      offset.current.x = MathUtils.clamp(
        ny * (tiltIntensity * 0.6),
        -tiltIntensity,
        tiltIntensity,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile, tiltIntensity]);

  targetFlipRef.current = flipped ? Math.PI : 0;

  useFrame((_, delta) => {
    const m = modelRef.current.rotation;

    m.y +=
      (targetFlipRef.current + offset.current.y - m.y) * Math.min(delta * 4, 1);
    m.x = MathUtils.lerp(m.x, BASE_ROTATION_X + offset.current.x, damp);

    const targetScale =
      BASE_SCALE * (1 + scrollProgress.current * SCROLL_ZOOM_RANGE);
    modelRef.current.scale.setScalar(
      MathUtils.lerp(modelRef.current.scale.x, targetScale, 0.05),
    );
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
        rotation={[BASE_ROTATION_X, 0, 0]}
        scale={BASE_SCALE}
      >
        <MeshTransmissionMaterial
          color={accentColor}
          backside={!isMobile}
          backsideThickness={isMobile ? 0 : 0.1}
          samples={isMobile ? 4 : 10}
          resolution={isMobile ? 128 : 256}
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
