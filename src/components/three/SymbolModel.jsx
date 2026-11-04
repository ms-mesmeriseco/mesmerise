import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Center } from "@react-three/drei";
import { MathUtils } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const FIT_SIZE = 3.5; // world units the symbol's width/height is scaled to
const SCROLL_ZOOM_RANGE = 0.03; // super subtle: +/-3% scale
const TWO_PI = Math.PI * 2;
const REST_YAW = 0.35; // slight angle at rest so the glass edges catch the light

export default function SymbolModel({
  spinSpeed = 0.35, // radians per second while hovered (~18s per turn)
  modelPath = "/models/symbols/Analytics.glb",
  node, // optional: only use this mesh from the file (three strips dots, so "Curve.001" -> "Curve001")
  accent = "--mesm-blue",
  glow = 0, // 0–1: emissive tint so the accent reads against a black background
  hovered: hoveredProp, // pass to control spin from outside (e.g. card hover); omit to use canvas hover
  ...props
}) {
  const { scene } = useGLTF(modelPath);
  const { gl, size } = useThree();
  const spinRef = useRef();
  const hovered = useRef(false);
  const velocity = useRef(0);
  const scrollProgress = useRef(0);
  const [accentColor, setAccentColor] = useState("#ffffff");
  const isMobile = size.width < 768;

  // A GLB can hold several pieces, each with its own transform. Bake those
  // transforms in and merge into one geometry so a single glass material
  // renders the whole symbol (one transmission pass, not one per piece).
  const geometry = useMemo(() => {
    scene.updateMatrixWorld(true);
    const parts = [];
    scene.traverse((child) => {
      if (!child.isMesh || (node && child.name !== node)) return;
      const g = child.geometry.clone();
      for (const name of Object.keys(g.attributes)) {
        if (name !== "position" && name !== "normal") g.deleteAttribute(name);
      }
      g.applyMatrix4(child.matrixWorld);
      parts.push(g.index ? g.toNonIndexed() : g);
    });
    const merged = mergeGeometries(parts);
    merged.computeBoundingBox();
    return merged;
  }, [scene, node]);

  // Each symbol GLB is exported at a different size, so fit the front-facing
  // width/height to FIT_SIZE (ignore depth – the layers are stacked along z)
  const baseScale = useMemo(() => {
    const { min, max } = geometry.boundingBox;
    const longest = Math.max(max.x - min.x, max.y - min.y);
    return FIT_SIZE / longest;
  }, [geometry]);

  useEffect(() => () => geometry.dispose(), [geometry]);

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
      .getPropertyValue(accent)
      .trim();
    if (value) setAccentColor(value);
  }, [accent]);

  // --- HOVER: spin while the pointer is over the canvas ---
  useEffect(() => {
    if (hoveredProp !== undefined) return;
    const el = gl.domElement;
    const onEnter = () => (hovered.current = true);
    const onLeave = () => (hovered.current = false);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, hoveredProp]);

  useFrame((_, delta) => {
    const g = spinRef.current;

    if (hoveredProp ?? hovered.current) {
      // ease up to a slow, steady spin
      velocity.current = MathUtils.lerp(
        velocity.current,
        spinSpeed,
        Math.min(delta * 1.5, 1),
      );
      g.rotation.y += velocity.current * delta;
    } else {
      // ease back to the nearest front-facing angle
      velocity.current = 0;
      const rest =
        Math.round((g.rotation.y - REST_YAW) / TWO_PI) * TWO_PI + REST_YAW;
      g.rotation.y = MathUtils.lerp(
        g.rotation.y,
        rest,
        Math.min(delta * 1.5, 1),
      );
    }

    const targetScale = 1 + scrollProgress.current * SCROLL_ZOOM_RANGE;
    g.scale.setScalar(MathUtils.lerp(g.scale.x, targetScale, 0.05));
  });

  return (
    <group {...props} dispose={null}>
      {/* Outer group spins around the world Y axis, centred on the symbol */}
      <group ref={spinRef} rotation={[0, REST_YAW, 0]}>
        <Center>
          <mesh geometry={geometry} scale={baseScale}>
            {/* Same glass as the homepage logo (Model.jsx) */}
            <MeshTransmissionMaterial
              color={accentColor}
              backside={!isMobile}
              backsideThickness={0.1}
              samples={isMobile ? 4 : 10}
              thickness={0.05}
              anisotropicBlur={0.1}
              iridescence={2}
              iridescenceIOR={1}
              clearcoat={10}
              envMapIntensity={0.5}
              emissive={accentColor}
              emissiveIntensity={glow}
            />
          </mesh>
        </Center>
      </group>
    </group>
  );
}

// useGLTF.preload(modelPath);
