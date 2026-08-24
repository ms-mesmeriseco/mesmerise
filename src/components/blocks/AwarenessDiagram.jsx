"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import FunnelScene from "@/components/three/FunnelScene";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const Large = [
  "<strong>Unaware</strong> <br/>Prospect isn't aware of problem x",
  "<strong>Problem Aware</strong> <br/>Prospect is aware of problem x, but isn't aware of the solution",
  "<strong>Solution Aware</strong> <br/>Prospect is aware of multiple solutions",
  "<strong>Product Aware</strong> <br/>Prospect is aware of multiple products",
  "<strong>Action Aware</strong> <br/>Prospect chooses a product and wants the best deal or offer",
];
const Small = [
  "<strong>3-4%</strong><br/>Ready to buy",
  "<strong>6-7%</strong><br/>Open to buying",
  "<strong>30%</strong><br/>Not thinking about buying",
  "<strong>40%</strong><br/>They think they're not interested in buying",
  "<strong>20%</strong><br/>They know they don't want to buy",
];

const LINE_WIDTH = 120;
const MIN_LINE_MARGIN = 0;
const MAX_LINE_MARGIN = 118;

function getLineMargin(index, total, ascending) {
  const step = (MAX_LINE_MARGIN - MIN_LINE_MARGIN) / (total - 1);
  return ascending
    ? MIN_LINE_MARGIN + index * step
    : MAX_LINE_MARGIN - index * step;
}

export default function AwarenessDiagram() {
  const [flipped, setFlipped] = useState(false);
  // Default to the static image (matches SSR) so mobile never mounts the
  // Canvas/GLTF at all — only switch to the 3D scene once confirmed desktop.
  const [showModel, setShowModel] = useState(false);
  const itemRefs = useRef([]);
  const topLabelRef = useRef(null);
  const bottomLabelRef = useRef(null);

  const items = flipped ? Small : Large;

  useEffect(() => {
    const BREAKPOINT = 768;
    const DEBOUNCE_MS = 150;

    const checkViewport = () => {
      setShowModel(window.innerWidth >= BREAKPOINT);
    };

    // Set initial value
    checkViewport();

    // Debounce so rapid resize events don't repeatedly mount/unmount the
    // Three.js canvas mid-drag
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkViewport, DEBOUNCE_MS);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const targets = [
      topLabelRef.current,
      ...itemRefs.current,
      bottomLabelRef.current,
    ].filter(Boolean);

    gsap.set(targets, { opacity: 0, y: 12 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.1,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, [flipped]);

  return (
    <div
      className="md:opacity-80 opacity-100 relative max-w-[1080px] w-full h-[600px] m-auto mb-6"
      style={{ perspective: "1200px" }}
    >
      {showModel ? (
        <FunnelScene flipped={flipped} />
      ) : (
        <img
          src="/assets/mobile-funnel.png"
          alt="Funnel diagram"
          className="block h-full w-full object-contain border-1 border-[var(--mesm-grey-dk)] rounded-md transition-transform duration-700 opacity-30"
          style={{ transform: flipped ? "rotateX(0deg)" : "rotateX(180deg)" }}
        />
      )}
      {/* Hard to sell / Easy to sell indicator */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-100 flex flex-col h-[380px] w-24">
        <span ref={topLabelRef} className="text-center mb-4">
          <h6>{flipped ? "Easy to sell" : "Hard to sell"}</h6>
        </span>

        <div className="relative flex-1 flex items-center justify-center opacity-60 md:opacity-100">
          <svg
            className="h-full w-4"
            viewBox="0 0 20 300"
            preserveAspectRatio="none"
          >
            <line
              x1="10"
              y1={flipped ? "10" : "290"}
              x2="10"
              y2={flipped ? "290" : "10"}
              stroke="white"
              strokeWidth="1"
            />
            <polygon
              points={flipped ? "5,290 15,290 10,300" : "5,10 15,10 10,0"}
              fill="white"
            />
          </svg>
          <span
            className="absolute text-[10px] tracking-[0.2em] uppercase pl-6"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Market Size
          </span>
        </div>

        <span ref={bottomLabelRef} className="text-center mt-4 opacity-50">
          <h6>{flipped ? "Hard to sell" : "Easy to sell"}</h6>
        </span>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-200 w-[50vw] md:w-[500px]">
        <ul className="flex flex-col gap-4 md:gap-8 text-white justify-between text-sm md:text-base">
          {items.map((item, index) => (
            <li
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className="flex items-center gap-2 no-list"
            >
              <span
                style={{
                  width: showModel ? `${LINE_WIDTH}px` : "4px",
                  marginLeft: showModel
                    ? `${getLineMargin(index, items.length, flipped)}px`
                    : "0px",
                }}
                className="h-[1px] bg-white"
              ></span>
              <h6 dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      </div>

      <ToggleSwitch
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-100"
        options={["SOA", "TAM"]}
        value={flipped ? "TAM" : "SOA"}
        onChange={(option) => setFlipped(option === "TAM")}
      />
    </div>
  );
}
