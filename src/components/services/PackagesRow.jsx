"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PageTitleMedium from "../layout/PageTitleMedium";

const PACKAGES = {
  SMB: [
    {
      title: "Get Online Fast",
      price: "Start from",
      features: [
        "Fast, lean, and strategic, perfect for Minimum Viable Products, new ideas, or getting your first site live quickly while leaving room to grow.",
      ],
      outcome:
        "A polished, professional site built to meet immediate needs and budgets.",
    },
    {
      title: "Level Up & Polish",
      price: "$2,500",
      features: [
        "Refine and enhance your current site’s design, usability, and messaging to keep it effective and engaging — without starting from scratch.",
      ],
      outcome:
        "A refreshed digital presence that feels new and performs better.",
    },
    {
      title: "Fresh Start",
      price: "$5,000",
      features: [
        "A ground-up rebuild that defines your online identity, optimises conversions, and provides a scalable foundation for growth.",
      ],
      outcome:
        "A website that grows with your business and earns trust from day one.",
    },
  ],
  Enterprise: [
    {
      title: "Website Surge",
      price: "Custom",
      features: [
        "A rapid-response site solution for product launches, campaigns, or departmental initiatives — delivered with speed, precision, and enterprise-level quality.",
      ],
      outcome:
        "A focused, professional site for immediate impact without compromise.",
    },

    {
      title: "Website Refresh",
      price: "$20,000",
      features: [
        "Modernise and optimise your existing site with improved user experience, accessibility, and performance while maintaining alignment with your corporate identity and governance.",
      ],
      outcome:
        "A more efficient, impactful site that stays ahead of expectations.",
    },
    {
      title: "Website Transformation",
      price: "$10,000",
      features: [
        "A full-scale overhaul of your site, built to align with corporate strategy, support multi-department needs, and ensure security, scalability, and compliance.",
      ],
      outcome:
        "A future-proofed digital platform that strengthens trust, supports growth, and empowers internal teams to deliver more.",
    },
  ],
};

export default function PackagesRow() {
  const [selected, setSelected] = useState("SMB");
  const options = ["SMB", "Enterprise"];

  return (
    <section className="w-full py-12  rounded-lg">
      <PageTitleMedium text="Packages" center />
      <ToggleSwitch options={options} value={selected} onChange={setSelected} />

      <div className="wrapper  grid grid-cols-1 md:grid-cols-3 gap-2 w-full mx-auto">
        {PACKAGES[selected].map((pkg) => (
          <div
            key={pkg.title}
            className="bg-[var(--mesm-grey-xd)] rounded-md shadow-lg p-8 flex flex-col gap-12 h-fit border border-[var(--mesm-grey-dk)] hover:border-[var(--foreground)] transition duration-600 text-left"
          >
            <h3>{pkg.title}</h3>

            {pkg.features.map((f) => (
              <p className="p2 opacity-30" key={f}>
                {f}
              </p>
            ))}
            <h6>OUTCOME</h6>
            <p className="p2">{pkg.outcome}</p>
            {/* <SecondaryButton href="#" size="large">
              Learn more
            </SecondaryButton> */}
          </div>
        ))}
      </div>
    </section>
  );
}
