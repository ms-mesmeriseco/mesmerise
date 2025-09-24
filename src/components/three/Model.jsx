"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { MathUtils } from "three";

export async function requestGyroPermission() {
  if (typeof window === "undefined") return "denied";
  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === "function") {
    try {
      const res = await DOE.requestPermission();
      return res; // "granted" | "denied"
    } catch {
      return "denied";
    }
  }
  return "granted";
}

export default function Model({
  tiltIntensity = 0.3, // how much the cursor/gyro can tilt the model
  mouse = true, // enable mouse offset
  gyro = true, // enable gyro offset
  damp = 0.08, // smoothing for following offsets
  autoSpeed = 0.003, // constant baseline spin (radians/frame)
}) {
  const { nodes } = useGLTF("/models/MESM_logo.glb");
  const { viewport, size } = useThree();
  const mesh = useRef();

  // Accumulated baseline yaw (always increases)
  const yaw = useRef(0);

  // Target *offsets* from input (small adjustments layered on base yaw)
  const offset = useRef({ x: 0, y: 0 });

  const isMobile = size.width < 768;

  // --- SCALE ---
  const scale = useMemo(() => {
    const isPhone = size.width < 600;
    const isTablet = size.width < 1080;
    return isPhone
      ? viewport.width / 3
      : isTablet
      ? viewport.width / 6
      : viewport.width / 8;
  }, [size.width, viewport.width]);

  // --- MOUSE OFFSET ---
  useEffect(() => {
    if (!mouse || isMobile) return;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
      // Subtle offset, clamped
      offset.current.y = MathUtils.clamp(
        nx * tiltIntensity,
        -tiltIntensity,
        tiltIntensity
      );
      offset.current.x = MathUtils.clamp(
        -ny * (tiltIntensity * 0.6),
        -tiltIntensity,
        tiltIntensity
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouse, isMobile, tiltIntensity]);

  // --- GYRO OFFSET ---
  useEffect(() => {
    if (!gyro || !isMobile) return;

    const handler = (e) => {
      const beta = e.beta ?? 0; // front/back
      const gamma = e.gamma ?? 0; // left/right
      const rx =
        MathUtils.degToRad(MathUtils.clamp(beta, -45, 45)) *
        (tiltIntensity / 0.6);
      const ry =
        MathUtils.degToRad(MathUtils.clamp(gamma, -45, 45)) *
        (tiltIntensity / 0.6);

      // Keep it subtle
      offset.current.x = MathUtils.clamp(
        -rx * 0.6,
        -tiltIntensity,
        tiltIntensity
      );
      offset.current.y = MathUtils.clamp(ry, -tiltIntensity, tiltIntensity);
    };

    window.addEventListener("deviceorientation", handler, true);
    requestGyroPermission().catch(() => {});

    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [gyro, isMobile, tiltIntensity]);

  // --- FRAME LOOP: baseline spin + eased offsets ---
  useFrame(() => {
    if (!mesh.current) return;

    // Constant baseline rotation (same on mobile & desktop)
    yaw.current += autoSpeed;

    const m = mesh.current.rotation;

    // Desired rotations = baseline yaw + small input offsets
    const desiredY = yaw.current + offset.current.y;
    const desiredX = offset.current.x;

    // Ease toward desired
    m.y = MathUtils.lerp(m.y, desiredY, damp);
    m.x = MathUtils.lerp(m.x, desiredX, damp);

    // (optional) tiny breathing on X if you want a hint of life:
    // m.x += Math.sin(performance.now() * 0.001) * 0.0005;
  });

  return (
    <group scale={scale}>
      <mesh ref={mesh} {...nodes.Logo}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.1}
          samples={10}
          thickness={0.05}
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

useGLTF.preload("/models/MESM_logo.glb");
