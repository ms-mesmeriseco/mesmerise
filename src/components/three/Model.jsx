"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
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
  tiltIntensity = 0.6,
  mouse = true,
  gyro = true,
  damp = 0.08,
  autoSpeed = 0.003, // fallback auto-rotate speed (radians/frame)
  gyroWaitMs = 1500, // wait this long for gyro before auto-rotating
}) {
  const { nodes } = useGLTF("/models/MESM_logo.glb");
  const { viewport, size } = useThree();
  const mesh = useRef();

  const target = useRef({ x: 0, y: 0 });
  const lastInput = useRef("none"); // "mouse" | "gyro" | "auto" | "none"

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

  // --- MOUSE CONTROL (desktop only) ---
  useEffect(() => {
    if (!mouse || isMobile) return;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.y = nx * tiltIntensity;
      target.current.x = -ny * (tiltIntensity * 0.6);
      lastInput.current = "mouse";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouse, isMobile, tiltIntensity]);

  // --- GYRO + FALLBACK AUTO-ROTATE (mobile only) ---
  useEffect(() => {
    if (!isMobile || !gyro) return;

    let gotGyro = false;
    let timeoutId;

    const handler = (e) => {
      const beta = e.beta ?? 0; // front/back
      const gamma = e.gamma ?? 0; // left/right
      // if the event fires once, we consider gyro available
      gotGyro = true;

      const rx =
        MathUtils.degToRad(MathUtils.clamp(beta, -45, 45)) *
        (tiltIntensity / 0.6);
      const ry =
        MathUtils.degToRad(MathUtils.clamp(gamma, -45, 45)) *
        (tiltIntensity / 0.6);

      target.current.x = -rx * 0.6;
      target.current.y = ry;
      lastInput.current = "gyro";
    };

    // Start listening right away
    window.addEventListener("deviceorientation", handler, true);

    // Request permission on iOS if needed (best triggered after a user gesture elsewhere;
    // here we optimistically request—if denied, the timeout will kick in)
    requestGyroPermission().catch(() => {
      /* noop */
    });

    // If we don't see any gyro events soon, switch to auto
    timeoutId = setTimeout(() => {
      if (!gotGyro) {
        lastInput.current = "auto";
      }
    }, gyroWaitMs);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("deviceorientation", handler, true);
    };
  }, [isMobile, gyro, tiltIntensity, gyroWaitMs]);

  // --- FRAME LOOP ---
  useFrame(() => {
    if (!mesh.current) return;

    // Fallback auto-rotate if mobile gyro didn’t come through
    if (isMobile && lastInput.current === "auto") {
      mesh.current.rotation.y += autoSpeed;
      // optional slow bob:
      // mesh.current.rotation.x = Math.sin(performance.now() * 0.001) * 0.05;
      return;
    }

    // Otherwise smoothly follow target (mouse or gyro)
    const m = mesh.current.rotation;
    m.x = MathUtils.lerp(m.x, target.current.x, damp);
    m.y = MathUtils.lerp(m.y, target.current.y, damp);

    // Tiny idle drift on desktop if no input yet
    if (!isMobile && lastInput.current === "none") {
      m.y += 0.0015;
    }
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
