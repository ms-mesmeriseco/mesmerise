"use client";

import InView from "@/hooks/InView";
import SmallTitle from "../ui/SmallTitle";
import { Marquee, useClientLogos } from "./TrustedBy";

// Trust bar that stays a two-row marquee on every screen size (TrustedBy switches to a grid on desktop)
export default function TrustedByMarquee() {
  const clients = useClientLogos();

  if (!clients.length) return null;

  return (
    <section className="relative pb-12 text-[var(--foreground)]">
      <InView>
        {/* Logos fade out at the left and right edges */}
        <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee clients={clients} />
        </div>
      </InView>
    </section>
  );
}
