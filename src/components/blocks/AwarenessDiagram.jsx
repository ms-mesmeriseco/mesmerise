"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import FunnelScene from "@/components/three/FunnelScene";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const Large = [
  "Unaware: Prospect isn't aware of problem x",
  "Problem Aware: Prospect is aware of problem x, but isn't aware of the solution",
  "Solution Aware: Prospect is aware of multiple solutions",
  "Product Aware: Prospect is aware of multiple products",
  "Action Aware: Prospect chooses a product and wants the best deal or offer",
];
const Small = [
  "Ready to buy",
  "Open to buying",
  "Not thinking about buying",
  "They think they're not interested in buying",
  "They know they don't want to buy",
];

const LINE_WIDTH = 60;
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
  const itemRefs = useRef([]);

  const items = flipped ? Small : Large;

  useEffect(() => {
    gsap.set(itemRefs.current, { opacity: 0, y: 12 });
    gsap.to(itemRefs.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, [flipped]);

  return (
    <div className="relative w-full h-[600px]">
      <FunnelScene flipped={flipped} />

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-200 w-[50vw]">
        <ul className="flex flex-col gap-10 text-white text-sm md:text-base opacity-90">
          {items.map((item, index) => (
            <li
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className="flex items-center gap-2 no-list"
            >
              <span
                style={{
                  width: `${LINE_WIDTH}px`,
                  marginLeft: `${getLineMargin(index, items.length, flipped)}px`,
                }}
                className="h-[1px] bg-white"
              ></span>
              <h6>{item}</h6>
            </li>
          ))}
        </ul>
      </div>

      <ToggleSwitch
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-100"
        options={["Upright", "Flipped"]}
        value={flipped ? "Flipped" : "Upright"}
        onChange={(option) => setFlipped(option === "Flipped")}
      />
    </div>
  );
}
