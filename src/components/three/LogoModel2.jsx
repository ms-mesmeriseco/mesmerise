// LogoModel2.jsx
import { useRef, useLayoutEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  RepeatWrapping,
  Vector2,
  SRGBColorSpace,
  LinearSRGBColorSpace,
} from "three";
import { useFrame } from "@react-three/fiber";

export default function LogoModel2(props) {
  const group = useRef();
  const modelRef = useRef();
  const { scene } = useGLTF("/models/logo_glass3.glb"); // your path

  // Load non-color maps (keep them in linear color space)
  const maps = useTexture({
    normalMap: "/textures/garage_floor_nor_gl_4k.jpg", // or .png
    roughnessMap: "/textures/SP_2K_Roughness.jpg", // choose one roughness map
    bumpMap: "/textures/Super Fine bump details_Tiled.jpg", // grayscale bump
    // If you also have a baseColor/albedo map, load it separately and mark as sRGB:
    // map: "/textures/your_basecolor.jpg",
  });

  // Configure repeats/tiling if they’re “_Tiled” assets
  const repeatU = 3,
    repeatV = 3;
  for (const k of Object.keys(maps)) {
    if (!maps[k]) continue;
    // base color maps should be sRGB; all others should remain linear
    if (k === "map") maps[k].colorSpace = SRGBColorSpace;
    else maps[k].colorSpace = LinearSRGBColorSpace;

    maps[k].wrapS = maps[k].wrapT = RepeatWrapping;
    maps[k].repeat.set(repeatU, repeatV);
    maps[k].anisotropy = 8;
  }

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
    }
  });

  useLayoutEffect(() => {
    // Apply to all MeshStandard/Physical materials in the model
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        const mat = obj.material;

        // If you DO have a basecolor/albedo: mat.map = maps.map;
        mat.normalMap = maps.normalMap || null;
        mat.roughnessMap = maps.roughnessMap || null;
        mat.bumpMap = maps.bumpMap || null;

        // Sensible defaults—adjust to taste
        mat.metalness = 0.8; // unless it’s metal
        mat.roughness = 0.1; // base value; roughnessMap will modulate it
        mat.bumpScale = 0.06; // very small; bump can get noisy fast
        if (mat.normalScale) mat.normalScale = new Vector2(1, 1);

        mat.needsUpdate = true;
      }
    });
  }, [scene, maps]);

  return (
    <primitive
      scale={[0.4, 0.4, 0.4]}
      rotation={[0, 3, 0]}
      ref={(group, modelRef)}
      object={scene}
      {...props}
    />
  );
}
