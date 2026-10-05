// Growth Leak Audit — single source of truth for questions, scoring and copy.
// Points live here and are only ever used for scoring; they are never rendered.

export const PILLARS = [
  { key: "positioning", weight: 0.2 },
  { key: "offer", weight: 0.15 },
  { key: "traffic", weight: 0.15 },
  { key: "conversion", weight: 0.2 },
  { key: "tracking", weight: 0.15 },
  { key: "nurture", weight: 0.15 },
];

// Pillar display names per track
export const PILLAR_LABELS = {
  leadgen: {
    positioning: "Positioning & relevance",
    offer: "Offer",
    traffic: "Traffic & channels",
    conversion: "Conversion",
    tracking: "Tracking & attribution",
    nurture: "Nurture & sales handoff",
  },
  ecom: {
    positioning: "Positioning & relevance",
    offer: "Offer & margin",
    traffic: "Traffic & channels",
    conversion: "Conversion",
    tracking: "Tracking & attribution",
    nurture: "Retention",
  },
  both: {
    positioning: "Positioning & relevance",
    offer: "Offer & margin",
    traffic: "Traffic & channels",
    conversion: "Conversion",
    tracking: "Tracking & attribution",
    nurture: "Nurture & retention",
  },
};

// Landing hero (replaces the intro screen). Headline adapted from the intro copy.
export const LANDING = {
  header: "Find out exactly how your business holds up",
  subtitle:
    "After auditing hundreds of businesses in the last 12 months we've noticed many leaving themselves exposed with outdated strategies and weak conversion tracking. ",
  button: "Discover in 4 minutes",
};

// Closing CtaBentoBox on the landing page, as Portable Text so it renders like the Sanity block
const pt = (key, text, style = "normal") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

export const LANDING_BENTO = {
  bentoTitle: "Find out exactly how your business holds up",
  ctaBox1: [
    pt("b1h", "Is your marketing spend being utilised?", "h3"),
    pt(
      "b1p",
      "See how your ROAS adds up in today's challenging economic climate.",
    ),
  ],
  ctaBox2: [
    pt("b2h", "Six pillars, three costly leaks", "h3"),
    pt(
      "b2p",
      "Positioning & relevance, offer, traffic & channels, conversion, tracking & attribution, and nurture & retention.",
    ),
  ],
  linkLabel: "Discover in 4 minutes",
};

export const INTRO = {
  body: [
    "After auditing hundreds of businesses in the last 12 months we've noticed many leaving themselves exposed with outdated strategies and weak conversion tracking.",
    "In 4 minutes you'll find out exactly how your business holds up and whether your marketing spend is being utilised properly in today's challenging economic climate.",
  ],
  button: "Discover opportunities",
};

// ── Stage 1: Hook (not scored) ─────────────────────────────────────────────

export const H1 = {
  id: "H1",
  question: "How does your business primarily make money online?",
  options: [
    {
      value: "leadgen",
      label:
        "Customers enquire, book or request a quote, and we provide a service",
    },
    { value: "ecom", label: "Customers buy directly from our online store" },
    { value: "both", label: "Both" },
  ],
};

const LEADGEN_INDUSTRIES = [
  "Professional services",
  "Health & wellness",
  "Trades & home services",
  "B2B / SaaS",
  "Property",
  "Education",
  "Other",
];
const ECOM_INDUSTRIES = [
  "Fashion & apparel",
  "Beauty & skincare",
  "Health & supplements",
  "Home & lifestyle",
  "Food & beverage",
  "Other",
];

export function industryQuestion(track) {
  const list = track === "leadgen" ? LEADGEN_INDUSTRIES : ECOM_INDUSTRIES;
  return {
    id: "H2",
    question: "What industry are you in?",
    options: list.map((label) => ({ value: label, label })),
  };
}

export const ALL_INDUSTRIES = [
  ...new Set([...LEADGEN_INDUSTRIES, ...ECOM_INDUSTRIES]),
];

export const H3 = {
  id: "H3",
  question: "What do you want most in the next 12 months?",
  options: [
    { value: "volume", label: "More leads / more sales volume" },
    {
      value: "quality",
      label: "Better quality leads / higher value customers",
    },
    { value: "cpa", label: "Lower cost per acquisition" },
    { value: "price", label: "Stop competing on price" },
  ],
};

// Results headline personalised by H3. Only the "cpa" line exists in the copy doc;
// the other goals show no headline until copy is written for them.
export const GOAL_HEADLINES = {
  cpa: "You want lower acquisition costs. Here's what's driving them up.",
};

// ── Stage 2A: Lead gen track ───────────────────────────────────────────────

const o = (label, points) => ({ label, points });

export const LEADGEN_QUESTIONS = [
  {
    id: "LG1",
    pillar: "positioning",
    question:
      "If a prospect lined you up against your top 3 competitors, what would they notice first?",
    options: [
      o("Not sure, never thought about this", 0),
      o("A clear point of difference they could repeat to someone else", 3),
      o("Our price", 1),
      o("Our reviews and reputation", 2),
    ],
  },
  {
    id: "LG2",
    pillar: "positioning",
    question: "How often do your prospects push back on price?",
    options: [
      o("Rarely. They come in already expecting to pay what we charge", 3),
      o("On most deals", 0),
      o("Sometimes, mostly with lower-fit leads", 2),
      o("Often enough that we discount to close", 1),
    ],
  },
  {
    id: "LG3",
    pillar: "positioning",
    question: "Who is your marketing written for?",
    options: [
      o("Anyone who might need our service", 0),
      o(
        "A defined ideal client, with messaging that speaks to their specific problems",
        3,
      ),
      o("A couple of loose segments", 1),
      o("A defined audience, but our messaging is mostly about us", 2),
    ],
  },
  {
    id: "LG4",
    pillar: "offer",
    question: "What does a cold prospect get when they first raise their hand?",
    options: [
      o("A “contact us” form", 0),
      o("A free quote or consultation", 1),
      o(
        "A specific, named front-end offer (audit, assessment, strategy session) with a clear outcome",
        3,
      ),
      o("A downloadable guide or resource", 2),
    ],
  },
  {
    id: "LG5",
    pillar: "offer",
    question: "How do you reduce the risk of someone saying yes?",
    options: [
      o("We don't, really", 0),
      o("Testimonials and case studies on the website", 1),
      o(
        "A guarantee, a clear process and proof matched to each type of buyer",
        3,
      ),
      o("A clear explanation of our process and what to expect", 2),
    ],
  },
  {
    id: "LG6",
    pillar: "traffic",
    multi: true,
    question: "Which channels currently bring you new leads?",
    options: [
      { label: "Google Ads", kind: "paid" },
      { label: "Meta Ads", kind: "paid" },
      { label: "LinkedIn (organic or paid)", kind: "both" },
      { label: "SEO / organic search", kind: "organic" },
      {
        label: "AI search (ChatGPT, Perplexity, Google AI Overviews)",
        kind: "organic",
      },
      { label: "Referrals & word of mouth", kind: "organic" },
      { label: "Email", kind: "organic" },
      { label: "Events & networking", kind: "organic" },
    ],
  },
  {
    id: "LG7",
    pillar: "traffic",
    question:
      "If your biggest lead source switched off tomorrow, what happens?",
    options: [
      o("We'd lose most of our pipeline", 0),
      o("We'd feel it, but other channels would carry us", 2),
      o("Barely a dent. No single source is more than 40% of leads", 3),
      o("We'd lose about half", 1),
    ],
  },
  {
    id: "LG8",
    pillar: "traffic",
    question: "How often do you launch new ad creative or messaging angles?",
    options: [
      o("Every month", 3),
      o("We're not running ads right now", 0),
      o("Every 6 months", 1),
      o("When performance declines", 2),
    ],
  },
  {
    id: "LG9",
    pillar: "conversion",
    question: "Where does your paid and social traffic land?",
    options: [
      o("Our homepage", 0),
      o("A dedicated landing page for each campaign or audience", 3),
      o("A relevant service page", 1),
      o("One general landing page for all campaigns", 2),
    ],
  },
  {
    id: "LG10",
    pillar: "conversion",
    question: "What does your enquiry form look like?",
    options: [
      o("Short, with qualifying questions that filter out poor-fit leads", 3),
      o("Long, because we want all the details upfront", 2),
      o("Name, email, phone, message", 1),
      o("We don't really have one. People call or email", 0),
    ],
  },
  {
    id: "LG11",
    pillar: "conversion",
    question: "Do you know your landing page conversion rate?",
    options: [
      o("No idea", 0),
      o("Roughly", 1),
      o("Yes, and it's above 5%", 3),
      o("Yes, and it's under 5%", 2),
    ],
  },
  {
    id: "LG12",
    pillar: "tracking",
    question: "Which number do you use to judge whether marketing is working?",
    options: [
      o("Cost per qualified lead or cost per sale", 3),
      o("Cost per lead", 2),
      o("Clicks, impressions or followers", 1),
      o("Gut feel", 0),
    ],
  },
  {
    id: "LG13",
    pillar: "tracking",
    question: "Can you attribute a closed deal back to the ad platform?",
    options: [
      o("Yes. Closed deals feed back into our ad platforms", 3),
      o("Mostly, through our CRM, but it doesn't connect back to the ads", 2),
      o("Only if we ask the client how they found us", 1),
      o("No", 0),
    ],
  },
  {
    id: "LG14",
    pillar: "nurture",
    question: "How quickly does a new lead hear from you?",
    options: [
      o("Within 15 minutes", 3),
      o("Within the hour", 2),
      o("Same or next business day", 1),
      o("It depends who's around", 0),
    ],
  },
  {
    id: "LG15",
    pillar: "nurture",
    question: "What happens to a lead who doesn't buy on the first call?",
    options: [
      o("We follow up a couple of times, then move on", 1),
      o(
        "We follow up and put them through an automated email sequence built to educate and re-engage them",
        3,
      ),
      o("Nothing structured", 0),
      o("Sales tracks them in the CRM and follows up manually", 2),
    ],
  },
];

// ── Stage 2B: Ecom track ───────────────────────────────────────────────────

export const ECOM_QUESTIONS = [
  {
    id: "EC1",
    pillar: "positioning",
    question:
      "Why do your best customers buy from you instead of the next store?",
    options: [
      o("Our brand. They identify with what we stand for", 3),
      o("Price or a promotion", 0),
      o("Product quality or something about the product itself", 2),
      o("Convenience. We showed up first", 1),
    ],
  },
  {
    id: "EC2",
    pillar: "positioning",
    question: "How dependent are your sales on discounts?",
    options: [
      o("Most months, we need a promo to hit target", 0),
      o(
        "We run planned sale events, and full-price sales hold up between them",
        3,
      ),
      o("We discount reactively whenever things go quiet", 1),
      o("We rarely discount, but we haven't tested whether we should", 2),
    ],
  },
  {
    id: "EC3",
    pillar: "positioning",
    question:
      "Could a stranger tell what your brand stands for from your homepage in 5 seconds?",
    options: [
      o("Yes, instantly", 3),
      o("They'd know what we sell, not why we're different", 1),
      o("Probably not", 0),
      o("Mostly, with a bit of scrolling", 2),
    ],
  },
  {
    id: "EC4",
    pillar: "offer",
    question:
      "Do you know your contribution margin per order after COGS, shipping, fees and ad spend?",
    options: [
      o("Yes, per product, and we use it to set ad targets", 3),
      o("Roughly, at a store level", 2),
      o("We know gross margin, not contribution margin", 1),
      o("No", 0),
    ],
  },
  {
    id: "EC5",
    pillar: "offer",
    question: "How do you lift average order value?",
    options: [
      o("We don't actively", 0),
      o("Free shipping threshold", 1),
      o("Bundles, upsells and a free shipping threshold, tested regularly", 3),
      o("Bundles or upsells on some products", 2),
    ],
  },
  {
    id: "EC6",
    pillar: "traffic",
    multi: true,
    question: "Which channels drive your sales?",
    options: [
      { label: "Meta Ads", kind: "paid" },
      { label: "Google Shopping / Performance Max", kind: "paid" },
      { label: "Google Search", kind: "paid" },
      { label: "Google Demand Gen", kind: "paid" },
      { label: "TikTok", kind: "paid" },
      { label: "SEO / organic search", kind: "organic" },
      { label: "AI search", kind: "organic" },
      { label: "Email & SMS", kind: "organic", emailSms: true },
      { label: "Influencers & affiliates", kind: "paid" },
      { label: "Marketplaces (Amazon, eBay)", kind: "paid" },
    ],
  },
  {
    id: "EC7",
    pillar: "traffic",
    question:
      "What share of revenue comes from your single biggest paid channel?",
    options: [
      o("Over 70%", 0),
      o("Under 40%", 3),
      o("50 to 70%", 1),
      o("40 to 50%", 2),
    ],
  },
  {
    id: "EC8",
    pillar: "traffic",
    question: "How many new ad creatives do you test each month?",
    options: [
      o("Fewer than 3", 0),
      o("10 or more, briefed from performance data", 3),
      o("3 to 5", 1),
      o("6 to 9", 2),
    ],
  },
  {
    id: "EC9",
    pillar: "conversion",
    question: "What's your store's conversion rate?",
    options: [
      o("I don't know", 0),
      o("Under 1%", 1),
      o("1 to 2.5%", 2),
      o("Above 2.5%", 3),
    ],
  },
  {
    id: "EC10",
    pillar: "conversion",
    question: "How would you describe your product pages?",
    options: [
      o(
        "Strong imagery, reviews, clear benefits, FAQs and objection handling on every page",
        3,
      ),
      o("Supplier photos and a basic description", 0),
      o("Good imagery and copy, light on reviews and proof", 2),
      o("They're fine, we haven't looked at them in a while", 1),
    ],
  },
  {
    id: "EC11",
    pillar: "conversion",
    question: "When did you last test something on your site or checkout?",
    options: [
      o("Never", 0),
      o("In the last month, as part of an ongoing CRO program", 3),
      o("Over 6 months ago", 1),
      o("In the last 3 months", 2),
    ],
  },
  {
    id: "EC12",
    pillar: "tracking",
    question: "Which number do you use to judge whether marketing is working?",
    options: [
      o("In-platform ROAS", 1),
      o("Blended Marketing Efficiency Ratio and contribution margin", 3),
      o("Revenue in Shopify", 2),
      o("Mostly gut feel", 0),
    ],
  },
  {
    id: "EC13",
    pillar: "tracking",
    question:
      "Is your tracking set up server-side (Conversions API, enhanced conversions)?",
    options: [
      o("Yes, and we check it regularly", 3),
      o("I'm not sure", 0),
      o("Partly. The pixel is there, server-side isn't complete", 1),
      o("Yes, set up once and not checked since", 2),
    ],
  },
  {
    id: "EC14",
    pillar: "nurture",
    question: "Which automated email and SMS flows are live?",
    options: [
      o(
        "Welcome, abandoned cart, browse abandonment, post-purchase and win-back, all segmented",
        3,
      ),
      o("Just a welcome email or abandoned cart", 1),
      o("None, or we only send campaigns", 0),
      o("Welcome and abandoned cart, plus one or two others", 2),
    ],
  },
  {
    id: "EC15",
    pillar: "nurture",
    question: "What share of revenue comes from returning customers?",
    options: [
      o("Under 15%", 1),
      o("Over 35%", 3),
      o("I don't know", 0),
      o("15 to 35%", 2),
    ],
  },
];

const LG_BY_ID = Object.fromEntries(LEADGEN_QUESTIONS.map((q) => [q.id, q]));

// "Both" runs the ecom track with LG10 in place of EC10 and LG14 in place of EC14
const BOTH_SWAPS = { EC10: "LG10", EC14: "LG14" };

export function questionsForTrack(track) {
  if (track === "leadgen") return LEADGEN_QUESTIONS;
  if (track === "both") {
    return ECOM_QUESTIONS.map((q) =>
      BOTH_SWAPS[q.id] ? LG_BY_ID[BOTH_SWAPS[q.id]] : q,
    );
  }
  return ECOM_QUESTIONS;
}

// ── Stage 3: Qualification (fit score, hidden) ─────────────────────────────

export const QUALIFICATION_INTRO =
  "Nearly there. Five quick questions so we can benchmark your results against businesses your size.";

export const QUALIFICATION_QUESTIONS = [
  {
    id: "Q1",
    key: "revenue",
    question: "What's your annual revenue?",
    options: [
      o("Under $250k", 0),
      o("$250k to $1M", 10),
      o("$1M to $5M", 25),
      o("$5M to $20M", 30),
      o("$20M+", 30),
    ],
  },
  {
    id: "Q2",
    key: "spend",
    question: "What's your monthly marketing and ad spend?",
    options: [
      o("Under $2k", 0),
      o("$2k to $5k", 10),
      o("$5k to $15k", 20),
      o("$15k to $50k", 25),
      o("$50k+", 25),
    ],
  },
  {
    id: "Q3",
    key: "role",
    question: "What's your role?",
    options: [
      o("Founder / owner / CEO", 20),
      o("Marketing lead / CMO", 15),
      o("Marketing team member", 5),
      o("Other", 0),
    ],
  },
  {
    id: "Q4",
    key: "timeline",
    question: "When are you looking to make changes?",
    options: [
      o("Now, it's a priority", 15),
      o("In the next 3 months", 10),
      o("Later this year", 5),
      o("Just exploring", 0),
    ],
  },
  {
    id: "Q5",
    key: "current_setup",
    question: "Who runs your marketing today?",
    options: [
      o("An agency we're not happy with", 10),
      o("In-house team", 5),
      o("A freelancer", 10),
      o("Me, on top of everything else", 10),
      o("Nobody", 5),
    ],
  },
];

// ── Stage 4: Gate ──────────────────────────────────────────────────────────

export const GATE = {
  headline: "Your Growth Leak report is ready.",
  subhead:
    "We've scored you across six pillars and found your three costliest leaks. Where should we send it?",
  button: "Show my results",
  microcopy:
    "Your results appear on the next screen and land in your inbox as well. No spam, unsubscribe anytime.",
};

// ── Stage 5: Results ───────────────────────────────────────────────────────

export const TIERS = [
  {
    min: 0,
    name: "Invisible",
    color: "var(--mesm-red)",
    copy: "You're running some ads without a strategy. Buyers can't see why you're different. Ad spend is leaking. There's a lot of opportunity for your business.",
  },
  {
    min: 40,
    name: "Commodity",
    color: "var(--mesm-yellow)",
    copy: "You're generating demand. Then you're losing it to whoever's cheapest. The market can't tell you apart, so it defaults to price. Every discount you run is paying for that gap.",
  },
  {
    min: 60,
    name: "Contender",
    color: "#86ef7d",
    copy: "The foundations work. Growth now comes down to two or three specific constraints, and pushing more spend through them will only make them louder.",
  },
  {
    min: 80,
    name: "Category of One",
    color: "var(--accent)",
    copy: "Buyers come to you already sold. You're in the top tier of businesses we audit.",
  },
];

const LEAKS = {
  positioning: {
    headline: "You look like everyone else",
    cost: "When buyers can't see a difference, they compare on price. Every ad dollar works harder to win a sale that should already be yours.",
  },
  offer: {
    headline: "Your offer asks too much, too soon",
    cost: "Cold prospects won't jump straight to “talk to sales” or “buy now”. Without a low-risk first step, you're paying for clicks that were never going to convert.",
  },
  offerEcom: {
    headline: "You don't know what a sale is worth",
    cost: "Without contribution margin, you can't set a ROAS target that makes money. You could be scaling at a loss and calling it growth.",
  },
  traffic: {
    headline: "One channel is holding up the business",
    cost: "One algorithm update, one policy change or one price rise away from a bad quarter. Concentration risk is still risk.",
  },
  conversion: {
    headline: "Your traffic arrives and leaves",
    cost: "You're paying to bring people in, then sending them somewhere that doesn't finish the job. Fixing conversion is the cheapest growth you'll ever buy.",
  },
  tracking: {
    headline: "You're optimising blind",
    cost: "The ad platforms are optimising for whatever you feed them. Feed them the wrong signal and they'll find you more of the wrong customer.",
  },
  nurture: {
    headline: "Leads are going cold in your inbox",
    cost: "Most leads don't buy on first contact. Slow responses and no follow-up hand them to the competitor who answered first.",
  },
  retention: {
    headline: "You're paying to acquire the same customer twice",
    cost: "Without flows and a retention program, every sale starts from zero. Your margin sits in the second order.",
  },
};

// Score range label for each tier, e.g. "40 to 59"
export function tierRange(tier) {
  const i = TIERS.indexOf(tier);
  const max = i < TIERS.length - 1 ? TIERS[i + 1].min - 1 : 100;
  return `${tier.min} to ${max}`;
}

export function leakFor(pillar, track) {
  const isEcom = track !== "leadgen";
  if (pillar === "offer" && isEcom) return LEAKS.offerEcom;
  if (pillar === "nurture" && isEcom) return LEAKS.retention;
  return LEAKS[pillar];
}

export const CTA = {
  call: {
    headline: "Want us to plug these leaks?",
    body: "Book a 30 minute Growth Leak Review. We'll go through your results, look at your site and ads, and show you the first three fixes we'd make.",
    button: "Book my review",
  },
  resource: {
    headline: "Start with your biggest leak",
    body: "We've sent you a step-by-step guide to fixing your lowest-scoring pillar. More playbooks are on the way.",
    button: "Get the guide",
  },
};

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_QUIZ_BOOKING_URL || "/connect";
export const GUIDE_URL =
  process.env.NEXT_PUBLIC_QUIZ_GUIDE_URL || "/cro-checklist";
