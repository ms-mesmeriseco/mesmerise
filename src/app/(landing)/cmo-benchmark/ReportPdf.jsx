"use client";

import { forwardRef } from "react";
import {
  TIERS,
  CTA,
  NO_PRIORITIES_MESSAGE,
  tierRange,
  pillarStatus,
} from "@/lib/cmo-benchmark/quizData";

// The benchmark as a landscape A4 PDF, in the site's look: black pages, Neue
// Haas, the site colours. Each page is laid out at A4's size in CSS pixels,
// captured as an image and placed full-bleed on its own PDF page.
//
// Everything is styled inline in px (no global type classes), so the site's
// responsive breakpoints can't resize the pages to fit the viewer's screen.

// Layout size: A4 landscape in CSS px (96dpi)
const PAGE_W = 1123; // 297mm
const PAGE_H = 794; // 210mm
// Output size: A4 landscape at 150dpi
const OUT_W = 1754;
const OUT_H = 1240;
// Page text size, set on every page so 1em is fixed (matches the site's body)
const BASE = 18;
// 1em of page padding; also used to inset the title page's M
const PAD = BASE;

const C = {
  fg: "#ffffff",
  muted: "#d4d4d4",
  dim: "rgba(255,255,255,0.55)",
  rule: "rgba(255,255,255,0.2)",
  card: "rgba(255,255,255,0.05)",
  blue: "#c1d2fc",
};

const label = {
  fontSize: 11,
  letterSpacing: "0.08em",

  color: C.dim,
};

// "You're not sure..." + "Sales push back..." → "you're not sure..., and sales push back..."
function joinTold(lines) {
  const parts = lines.map(
    (l) => l.charAt(0).toLowerCase() + l.slice(1).replace(/\.$/, ""),
  );
  return `${parts.join(", and ")}.`;
}

const Dot = ({ color, size = 8 }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      flexShrink: 0,
    }}
  />
);

const SectionTitle = ({ children }) => (
  <div
    style={{
      ...label,
      paddingBottom: 8,
      borderBottom: `1px solid ${C.rule}`,
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);

// Every page: A4 landscape in the site's type
const sheet = {
  position: "relative",
  overflow: "hidden",
  width: PAGE_W,
  height: PAGE_H,
  fontSize: BASE,
  padding: "1em",
  boxSizing: "border-box",
  background: "#000",
  color: C.fg,
  fontFamily: '"Neue Haas", Helvetica, Arial, sans-serif',
  fontWeight: 400,
  lineHeight: 1.4,
  display: "flex",
  flexDirection: "column",
  WebkitFontSmoothing: "antialiased",
};

// The Mesmerise M, anchored to the bottom right and bleeding off the edge
const Mark = ({ width, right, bottom, opacity }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/logoMark-SVG_mesm.svg"
    alt=""
    style={{ position: "absolute", width, right, bottom, opacity }}
  />
);

// Title page: company + report name top left, Mesmerise and the year bottom
// left, the M at 40% filling the bottom right corner
function TitlePage({ company, year }) {
  return (
    <div data-pdf-page style={{ ...sheet, background: "var(--mesm-red)" }}>
      <div style={{ fontSize: 96, lineHeight: 1.04, letterSpacing: "-0.01em" }}>
        {company && <div>{company}</div>}
        <div>Marketing Benchmark</div>
      </div>
      {/* Sizes match the site's h4 and .page-title-medium at desktop size, set
          in px so the viewer's screen width can't change them. Sits above the M. */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 24, lineHeight: 1.33 }}>Mesmerise</div>
        <div style={{ fontSize: 52, lineHeight: 1 }}>{year}</div>
      </div>
      <Mark width={600} right={PAD} bottom={-70} opacity={0.4} />
    </div>
  );
}

// Closing page: thanks and contact details, the M in dark grey
function ClosingPage({ year, company }) {
  const muted = { color: "rgba(255,255,255,0.5)" };
  return (
    <div data-pdf-page style={{ ...sheet, fontWeight: 500 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wordmark.svg"
          alt="Mesmerise"
          style={{ height: 14, opacity: 0.45 }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {year}
        </span>
      </div>
      <div
        style={{
          marginTop: 150,
          paddingTop: 22,
          borderTop: `1px solid ${C.rule}`,
          maxWidth: 560,
        }}
      >
        <div style={{ fontSize: 24, lineHeight: 1.3 }}>
          This report was created
          {company ? ` for ${company}` : ""} by Mesmerise Digital.
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.45, marginTop: 24 }}>
          <div style={muted}>To continue the conversation:</div>
          <div>hello@mesmeriseco.com</div>
          <div>petar@mesmeriseco.com</div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.45, marginTop: 20 }}>
          <div style={muted}>
            We look forward to building something purposeful together.
          </div>
          <div>— Petar Petrović, Founder</div>
        </div>
      </div>
      <Mark width={470} right={110} bottom={-14} opacity={0.11} />
    </div>
  );
}

// One A4 content page: header (wordmark, report name, section), body, footer
// (who, date, confidential, page number). Page numbers count the title page.
function Page({ number, total, section, meta, children }) {
  return (
    <div data-pdf-page style={sheet}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 16,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.svg" alt="Mesmerise" style={{ height: 14 }} />
          <span
            style={{
              ...label,
              borderLeft: `1px solid ${C.rule}`,
              paddingLeft: 16,
            }}
          >
            Marketing benchmark
          </span>
        </div>
        <span style={{ ...label, color: C.blue }}>
          {String(number).padStart(2, "0")} · {section}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          paddingTop: 32,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 28,
          paddingTop: 14,
          borderTop: `1px solid ${C.rule}`,
          ...label,
        }}
      >
        <span>{meta}</span>
        <span>Confidential</span>
        <span>
          Page {number + 1} of {total}
        </span>
      </div>
    </div>
  );
}

function TierLadder({ tier }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[...TIERS].reverse().map((t) => {
        const current = t.name === tier.name;
        return (
          <div
            key={t.name}
            style={{
              border: `1px solid ${current ? t.color : C.rule}`,
              background: current ? C.card : "transparent",
              borderRadius: 8,
              padding: current ? "16px 20px" : "10px 20px",
              opacity: current ? 1 : 0.5,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Dot color={t.color} />
                <span style={{ fontSize: 18, color: t.color }}>{t.name}</span>
                <span style={{ ...label, marginLeft: 6 }}>{tierRange(t)}</span>
              </div>
              {current && (
                <span
                  style={{
                    fontSize: 11,
                    borderRadius: 16,
                    padding: "4px 10px",
                    background: t.color,
                    color: "#000",
                  }}
                >
                  You are here
                </span>
              )}
            </div>
            {current && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.45,
                }}
              >
                {t.bullets.join(" ")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Laid out off-screen; the export captures each [data-pdf-page] child
const ReportPdf = forwardRef(function ReportPdf(
  { results, company, firstName, subhead, summary, date },
  ref,
) {
  const { overall, tier, pillars, priorities, working } = results;
  // Title, three content pages, closing
  const total = 5;
  const year = new Date().getFullYear();
  const meta = [company && `Prepared for ${company}`, date]
    .filter(Boolean)
    .join(" · ");
  const page = { total, meta };

  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", gap: 40 }}
    >
      <TitlePage company={company} year={year} />

      {/* 1. Overview: score, tier, leadership summary */}
      <Page number={1} section="Overview" {...page}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 56,
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, lineHeight: 1.3, maxWidth: 520 }}>
              {firstName ? `${firstName}, your` : "Your"} marketing function
              scored {overall}/100.
            </div>
            {subhead && (
              <div
                style={{
                  fontSize: 17,
                  color: C.muted,
                  marginTop: 12,
                  maxWidth: 520,
                }}
              >
                {subhead}
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 20,
                marginTop: 28,
              }}
            >
              <span
                style={{
                  fontSize: 128,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {overall}
              </span>
              <span style={{ fontSize: 22, color: C.muted }}>/ 100</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: `1px solid ${tier.color}`,
                  color: tier.color,
                  borderRadius: 16,
                  padding: "4px 14px",
                  fontSize: 18,
                  marginLeft: 8,
                }}
              >
                <Dot color={tier.color} />
                {tier.name}
              </span>
            </div>
            <div
              style={{
                marginTop: "auto",
                border: "1px solid rgba(193,210,252,0.4)",
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <div style={{ ...label, color: C.blue, marginBottom: 10 }}>
                Leadership summary
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.45 }}>{summary}</div>
            </div>
          </div>
          <div>
            <SectionTitle>Where you sit</SectionTitle>
            <TierLadder tier={tier} />
          </div>
        </div>
      </Page>

      {/* 2. Priorities: pillars under 60, lowest first, max 3 */}
      <Page number={2} section="Priorities" {...page}>
        <div style={{ fontSize: 30, marginBottom: 24 }}>
          {priorities.length === 0
            ? "Your priorities"
            : priorities.length === 1
              ? "Your top priority"
              : `Your ${priorities.length} priorities`}
        </div>
        {priorities.length === 0 ? (
          <div style={{ fontSize: 18, color: C.muted }}>
            {NO_PRIORITIES_MESSAGE}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {priorities.map((p, i) => (
              <div
                key={p.key}
                style={{
                  border: `1px solid ${C.rule}`,
                  background: C.card,
                  borderRadius: 8,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    ...label,
                  }}
                >
                  <Dot color={pillarStatus(p.score).color} />
                  <span>
                    {String(i + 1).padStart(2, "0")} · {p.label} · {p.score}/100
                  </span>
                </div>
                <div style={{ fontSize: 22, lineHeight: 1.25 }}>
                  {p.headline}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontSize: 14,
                    color: C.muted,
                    lineHeight: 1.45,
                  }}
                >
                  {p.told?.length > 0 && (
                    <div>
                      <span style={{ color: C.fg }}>You told us:</span>{" "}
                      {joinTold(p.told.slice(0, 2))}
                    </div>
                  )}
                  <div>
                    <span style={{ color: C.fg }}>The business case:</span>{" "}
                    {p.businessCase}
                  </div>
                  {p.firstMove && (
                    <div>
                      <span style={{ color: C.fg }}>First move:</span>{" "}
                      {p.firstMove}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Page>

      {/* 3. Pillar breakdown, what's working, next step */}
      <Page number={3} section="Pillar breakdown" {...page}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {pillars.map((p) => {
            const status = pillarStatus(p.score);
            return (
              <div
                key={p.key}
                style={{
                  border: `1px solid ${C.rule}`,
                  borderRadius: 8,
                  padding: 20,
                  height: 158,
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.3 }}>
                  {p.label}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          fontSize: 36,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {p.score}
                      </span>
                      <span
                        style={{ fontSize: 13, color: C.muted, marginLeft: 4 }}
                      >
                        /100
                      </span>
                    </span>
                    <span style={{ fontSize: 13, color: status.color }}>
                      {status.name}
                    </span>
                  </div>
                  <div style={{ height: 2, background: C.rule, marginTop: 12 }}>
                    <div
                      style={{
                        height: 2,
                        width: `${Math.max(p.score, 2)}%`,
                        background: status.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: working ? "1fr 1fr" : "1fr",
            gap: 14,
            marginTop: "auto",
          }}
        >
          {working && (
            <div
              style={{
                border: `1px solid ${C.rule}`,
                background: C.card,
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <div style={{ ...label, marginBottom: 10 }}>
                What&apos;s working
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 18,
                }}
              >
                <Dot color={pillarStatus(working.score).color} />
                {working.label} · {working.score}/100
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: C.muted,
                  marginTop: 8,
                  lineHeight: 1.45,
                }}
              >
                {working.working}
              </div>
            </div>
          )}
          <div
            style={{
              border: "1px solid rgba(193,210,252,0.4)",
              borderRadius: 8,
              padding: "20px 24px",
            }}
          >
            <div style={{ ...label, color: C.blue, marginBottom: 10 }}>
              {CTA.session.eyebrow}
            </div>
            <div style={{ fontSize: 18 }}>{CTA.session.headline}</div>
            <div
              style={{
                fontSize: 14,
                color: C.muted,
                marginTop: 8,
                lineHeight: 1.45,
              }}
            >
              {CTA.session.body[0]}
            </div>
            <div style={{ fontSize: 14, color: C.blue, marginTop: 10 }}>
              mesmeriseco.com/connect
            </div>
          </div>
        </div>
      </Page>

      <ClosingPage year={year} company={company} />
    </div>
  );
});

export default ReportPdf;

// Captures each page of the off-screen report and downloads it as a PDF.
// Libraries load on demand so they stay out of the results page bundle.
export async function exportReportPdf(node, filename) {
  const [{ toJpeg, getFontEmbedCSS }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);
  await document.fonts.ready;

  const pages = [...node.querySelectorAll("[data-pdf-page]")];
  // Embed the site fonts once rather than per page
  const fontEmbedCSS = await getFontEmbedCSS(pages[0]);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  for (const [i, page] of pages.entries()) {
    const image = await toJpeg(page, {
      width: PAGE_W,
      height: PAGE_H,
      // Scales the layout to exactly 1754 × 1240 (150dpi)
      canvasWidth: OUT_W,
      canvasHeight: OUT_H,
      pixelRatio: 1,
      quality: 0.92,
      // No backgroundColor: it would override each page's own (the red title)
      fontEmbedCSS,
    });
    if (i > 0) pdf.addPage("a4", "landscape");
    pdf.addImage(image, "JPEG", 0, 0, 297, 210);
  }
  pdf.save(filename);
}
