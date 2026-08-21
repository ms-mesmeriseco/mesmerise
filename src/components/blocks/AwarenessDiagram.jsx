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
  "<strong>3-4%</strong> <br/>Ready to buy",
  "<strong>6-7%</strong> <br/>Open to buying",
  "<strong>30%</strong> <br/>Not thinking about buying",
  "<strong>40%</strong> <br/>They think they're not interested in buying",
  "<strong>20%</strong> <br/>They know they don't want to buy",
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
  const itemRefs = useRef([]);
  const topLabelRef = useRef(null);
  const bottomLabelRef = useRef(null);

  const items = flipped ? Small : Large;

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
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, [flipped]);

  return (
    <div className="relative max-w-[1080px] h-[600px] m-auto mb-6">
      <FunnelScene flipped={flipped} />
      {/* Hard to sell / Easy to sell indicator */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-100 flex flex-col h-[380px] w-24">
        <span ref={topLabelRef} className="opacity-50 text-center mb-4">
          <h6>{flipped ? "Easy to sell" : "Hard to sell"}</h6>
        </span>

        <div className="relative flex-1 flex items-center justify-center">
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
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <polygon
              points={flipped ? "5,290 15,290 10,300" : "5,10 15,10 10,0"}
              fill="white"
              fillOpacity="0.35"
            />
          </svg>
          <span
            className="absolute text-white/40 text-[10px] tracking-[0.2em] uppercase pl-6"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Market Size
          </span>
        </div>

        <span ref={bottomLabelRef} className="text-center mt-4 opacity-50">
          <h6>{flipped ? "Hard to sell" : "Easy to sell"}</h6>
        </span>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-200 w-[70vw] md:w-[500px]">
        <ul className="flex flex-col gap-4 md:gap-8 text-white text-sm md:text-base opacity-80">
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
                className="h-[1px] bg-white opacity-40"
              ></span>
              <h6 dangerouslySetInnerHTML={{ __html: item }} />
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
