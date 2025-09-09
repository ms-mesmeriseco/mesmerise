"use client";

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Image as DreiImage,
  OrbitControls,
  useScroll,
  Html,
} from "@react-three/drei";
import { useRouter } from "next/navigation";

// your components
import LogoModel2 from "@/components/three/LogoModel2"; // glassy M you already have
import ServicesList from "@/components/home/ServicesList";
import StaggeredWords from "@/hooks/StaggeredWords";

// contentful fetch
import { getClient } from "@/lib/apollo-client";
import { GET_PROJECT_PAGES } from "@/lib/graphql/queries/getProjectPages";

// ---------------- Helpers ----------------
const TAG_NAME = "layout: highlight grid";
const TAG_SLUG = "layout-highlight-grid";

function hasTag(project, { tagName, tagSlug }) {
  const tags = project?.contentfulMetadata?.tags || [];
  return tags.some((t) => {
    const name = (t?.name || "").toLowerCase().trim();
    const id = (t?.id || t?.sys?.id || "").toLowerCase().trim();
    return (
      (tagName && name === tagName.toLowerCase().trim()) ||
      (tagSlug && id.includes(tagSlug.toLowerCase().trim()))
    );
  });
}

async function fetchProjects() {
  const { data } = await getClient().query({ query: GET_PROJECT_PAGES });
  const all = data?.projectPageCollection?.items || [];
  const filtered = all.filter((p) =>
    hasTag(p, { tagName: TAG_NAME, tagSlug: TAG_SLUG })
  );
  return filtered.slice(0, 6); // exactly six
}

// ---------------- Camera rig (scroll -> move forward) ----------------
function DollyRig({ startZ = -12, endZ = -1.6, sway = 0.5 }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((_, dt) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const z = THREE.MathUtils.lerp(startZ, endZ, t);
    const x = Math.sin(t * Math.PI * 2) * sway * 0.6;
    const y = Math.cos(t * Math.PI) * sway * 0.25;
    camera.position.lerp(new THREE.Vector3(x, y, z), 1 - Math.pow(0.001, dt));
    camera.lookAt(look.current);
  });
  return null;
}

// ---------------- Paragraphs in 3D (HTML in space) ----------------
function Paragraph3D({ text, position = [0, 0, 0], width = 780 }) {
  return (
    <group position={position}>
      <Html transform center distanceFactor={14}>
        <div
          style={{
            maxWidth: width,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {/* reuse your staggered words for the exact look */}
          <StaggeredWords
            as="p"
            text={text}
            className="page-title-large"
            margin="-40% 0px"
          />
        </div>
      </Html>
    </group>
  );
}

// ---------------- Services (your existing list, mounted in 3D) ----------------
function Services3D({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Html
        transform
        center
        distanceFactor={16}
        style={{ pointerEvents: "auto" }}
      >
        <div className="w-[90vw] max-w-[1100px]">
          <ServicesList />
        </div>
      </Html>
    </group>
  );
}

// ---------------- One clickable project plane ----------------
function ProjectPlane({ project, position, rotation, scale = 1 }) {
  const router = useRouter();
  const url = project?.heroMedia?.url;
  const title = project?.projectTitle || "Untitled";

  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() * 0.6 + position[0]) * 0.06;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <DreiImage
        url={url}
        toneMapped
        transparent
        onPointerOver={(e) => (e.object.cursor = "pointer")}
        onPointerOut={(e) => (e.object.cursor = "auto")}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/work/${project.slug}`);
        }}
      />
      <Html center distanceFactor={12} position={[0, -0.72, 0]}>
        <div
          style={{
            padding: "6px 10px",
            background: "rgba(0,0,0,0.45)",
            color: "white",
            fontSize: 12,
            borderRadius: 8,
            backdropFilter: "blur(4px)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
      </Html>
      {/* slim frame */}
      <mesh position={[0, 0, -0.004]}>
        <planeGeometry args={[1.02, 0.66]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </group>
  );
}

// ---------------- Six projects arranged as a “gate” you fly through ----------------
function ProjectsGate({ projects = [], centerZ = -4.5 }) {
  const placements = useMemo(() => {
    // Two rows of three, slightly curved
    const rows = 2,
      cols = 3;
    const spacingX = 1.6;
    const spacingY = 1.1;
    const baseZ = centerZ;
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (i >= projects.length) break;
        const x = (c - (cols - 1) / 2) * spacingX;
        const y = (r === 0 ? 0.6 : -0.6) + (Math.random() - 0.5) * 0.15;
        const z = baseZ + Math.abs(x) * 0.08; // slight arc
        const rotY = -x * 0.12;
        const rotX = r === 0 ? -0.08 : 0.08;
        arr.push({
          position: [x, y, z],
          rotation: [rotX, rotY, 0],
          scale: 1.35,
        });
      }
    }
    return arr;
  }, [centerZ, projects.length]);

  return (
    <>
      {projects.map((p, i) => (
        <ProjectPlane key={p.slug ?? i} project={p} {...placements[i]} />
      ))}
    </>
  );
}

// ---------------- Lights & Environment (studio look + red bg) ----------------
function StudioLights() {
  return (
    <>
      <color attach="background" args={["#e24126"]} />
      <Environment
        files="/hdr/photo-studio_4K.exr"
        background={false}
        intensity={0.35}
        rotation={[0, Math.PI * 0.15, 0]}
      />
      <Environment resolution={1024}>
        <Lightformer
          form="rect"
          intensity={5.5}
          color="white"
          scale={[1.3, 6, 1]}
          rotation={[0, Math.PI / 3, 0]}
          position={[-3, 0.7, 2.5]}
        />
        <Lightformer
          form="rect"
          intensity={5.0}
          color="white"
          scale={[1.1, 5, 1]}
          rotation={[0, -Math.PI / 3, 0]}
          position={[3, 0.8, 2.2]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="white"
          scale={[4, 0.7, 1]}
          rotation={[Math.PI / 4, 0, 0]}
          position={[0, 3, 2]}
        />
      </Environment>
      <ambientLight intensity={0.08} />
    </>
  );
}

// ---------------- Page: sequence along Z ----------------
export default function Home3DPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => setProjects(await fetchProjects()))();
  }, []);

  // Z positions for the sequence (more negative = further away)
  const Z = {
    mLogo: -10.0,
    para1: -7.6,
    projects: -4.8,
    para2: -3.0,
    services: -1.8,
  };

  return (
    <main className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, -12], fov: 45 }}
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <OrbitControls />
        <Suspense fallback={null}>
          <StudioLights />

          {/* 4 pages of scroll → tweak with content density */}

          <DollyRig startZ={-12} endZ={-1.6} />

          {/* 1) M Logo */}
          <group position={[0, 0, 10]}>
            <LogoModel2 />
          </group>

          {/* 2) First paragraph */}
          <Paragraph3D
            position={[0, -0.2, 30]}
            text="We craft brand, web, and content experiences that look sexy, and convert."
          />

          {/* 3) Six projects (tag: layout-highlight-grid) */}
          <ProjectsGate projects={projects} centerZ={50} />

          {/* 4) Second paragraph */}
          <Paragraph3D
            position={[0, 0, 70]}
            text="Bridging the gap between aesthetic solutions and undeniable data."
          />

          {/* 5) Services list */}
          <Services3D position={[0, -0.2, 100]} />
        </Suspense>
      </Canvas>
    </main>
  );
}
