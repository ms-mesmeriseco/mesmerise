// CMO Benchmark (working title) — single source of truth for questions, scoring and copy.
// Points live here and are only ever used for scoring; they are never rendered.
// `points: null` marks an answer that isn't scored (the question drops out of its pillar).

export const PILLARS = [
  { key: "measurement", weight: 0.15, label: "Measurement & leadership confidence" },
  { key: "acquisition", weight: 0.15, label: "Acquisition strategy" },
  { key: "conversion", weight: 0.15, label: "Website & conversion" },
  { key: "data", weight: 0.15, label: "Data, CRM & martech" },
  { key: "content", weight: 0.1, label: "Content strategy" },
  { key: "positioning", weight: 0.1, label: "Positioning & brand" },
  { key: "budget", weight: 0.1, label: "Budget allocation" },
  { key: "team", weight: 0.1, label: "Team & partners" },
];

export const PILLAR_LABELS = Object.fromEntries(
  PILLARS.map((p) => [p.key, p.label]),
);

// ── Stage 1: Hook (not scored) ─────────────────────────────────────────────

// The landing hero acts as the intro screen
export const INTRO = {
  eyebrow: "For marketing leaders",
  headline: "Are you asked to deliver more revenue with less budget?",
  body: "In 7 minutes, benchmark your marketing capabilities across the eight areas that matter most. You’ll leave with three priorities and the business case for each to discuss with your leadership team.",
  button: "Start now",
  resumeButton: "Pick up where you left off",
  restart: "Start again",
  meta: ["7 minutes", "Confidential", "Shareable report"],
};

// Landing 3-problem section (ListIconsFocus block shape)
export const LANDING_FOCUS = {
  title: {
    _type: "richText",
    content: [
      {
        _type: "block",
        _key: "fh",
        style: "h2",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "fhs",
            text: "The pressures many marketing leaders are experiencing",
            marks: [],
          },
        ],
      },
    ],
  },
  listItems: [
    {
      _key: "focus1",
      title: "Fragmented strategy",
      content:
        "Brand, performance, content and sales each run their own isolated strategy without talking to one another, often with a different agency behind each deliverable. Every channel can be busy and still not add up to growth, because nobody is accountable.\nLeadership sees the spend, but the outcome just isn’t there.",
    },
    {
      _key: "focus2",
      title: "Dated campaign structures bleeding money",
      content:
        "Most ad accounts are set up to capture buyers who are already searching, with budgets split across too many campaigns for the algorithms to learn properly. Many accounts are overextending and paying for traffic they already own.\nCosts climb every quarter, results plateau, and the people who’ll buy next year never see you or know your name.\n90% of accounts audited have poor structure.",
    },
    {
      _key: "focus3",
      title: "Data nobody fully trusts",
      content:
        "Duplicate records, half-updated deal stages and tracking that stops at the form fill. When sales, finance and marketing each pull a different number, every report starts a debate, and the ad platforms optimise toward the wrong audience.\nPristine data hygiene is key to enterprise success.",
    },
  ],
};

export const H1 = {
  id: "H1",
  question: "Which best describes your business?",
  options: [
    { value: "b2b", label: "B2B, with a considered sales cycle" },
    { value: "b2c", label: "B2C services" },
    { value: "ecom", label: "Ecommerce / DTC" },
    { value: "mix", label: "A mix" },
  ],
};

// "pipeline" for B2B, "revenue" for everyone else
export const term = (track) => (track === "b2b" ? "pipeline" : "revenue");

export const INDUSTRIES = [
  "Professional services",
  "Financial services",
  "Health",
  "Property & construction",
  "Technology / SaaS",
  "Retail & consumer",
  "Education",
  "Other",
];

export const OTHER_MAX_LENGTH = 50;

export const H2 = {
  id: "H2",
  question: "What industry are you in?",
  // "Other" opens an optional text field, saved as H2_other
  options: INDUSTRIES.map((label) => ({
    value: label,
    label,
    other: label === "Other",
  })),
  otherPlaceholder: "Type your industry (optional)",
};

export const H3 = {
  id: "H3",
  question: "What's your highest priority in the next 12 months?",
  options: [
    { value: "grow", label: "Grow pipeline or revenue on the same budget" },
    { value: "prove", label: "Prove marketing's return to the CEO or board" },
    { value: "cac", label: "Bring acquisition costs down" },
    { value: "markets", label: "Enter new markets or segments" },
    { value: "budget", label: "Defend or increase my budget" },
  ],
};

// Results subheadline, personalised by H3
export const PRESSURE_HEADLINES = {
  grow: (t) => `You need to grow ${t} on the same budget. Here's where the headroom is.`,
  prove: () => "You need to prove marketing's return. Here's where the case is weakest.",
  cac: () => "You need to bring acquisition costs down. Here's what's holding them up.",
  markets: () => "You're entering new markets. Here's what needs to be ready first.",
  budget: () => "You need to defend your budget. Here's where the case needs work.",
};

// Ends the leadership summary: "Addressing them would {outcome}."
export const PRESSURE_OUTCOMES = {
  grow: (t) => `grow ${t} on the current budget`,
  prove: () => "strengthen the case for marketing's return",
  cac: () => "bring acquisition costs down",
  markets: () => "set up entry into new markets",
  budget: () => "build the case to protect and grow the budget",
};

// ── Stage 2: Benchmark questions ───────────────────────────────────────────

const o = (label, points) => ({ label, points });

export const QUESTIONS = [
  // Pillar 1: Measurement & leadership confidence
  {
    id: "CM1",
    pillar: "measurement",
    question: "When you report to the CEO or board, what's the headline number?",
    options: [
      o("Leads, traffic or engagement", 1),
      o("Pipeline or revenue contribution, on an attribution model leadership accepts", 3),
      o("Cost per lead and ROAS by channel", 2),
      o("It changes. We don't have one consistent number", 0),
    ],
  },
  {
    id: "CM2",
    pillar: "measurement",
    question: "How much does leadership trust marketing's numbers?",
    options: [
      o("Fully. Finance and marketing report the same revenue figure", 3),
      o("Some scepticism. Sales and marketing tell different stories", 1),
      o("Mostly, with the odd debate over attribution", 2),
      o("Marketing is still seen as a cost centre", 0),
    ],
  },
  {
    id: "CM3",
    pillar: "measurement",
    question:
      "If your budget were cut by 30% tomorrow, could you show leadership exactly what revenue you'd lose?",
    options: [
      o("Roughly, at a total level", 2),
      o("We've never modelled it", 0),
      o("Yes, modelled channel by channel", 3),
      o("We'd struggle to put a number on it", 1),
    ],
  },

  // Pillar 2: Acquisition strategy
  {
    id: "CM4",
    pillar: "acquisition",
    question:
      "How much of your spend is raising awareness, building interest & creating demand, rather than chasing prospects who are ready to buy today?",
    options: [
      o(
        "Almost all of it chases ready-to-buy prospects: search, retargeting and bottom-of-funnel",
        0,
      ),
      o("A deliberate split, roughly 30 to 40% building demand", 2),
      o("Mostly chasing ready-to-buy, with a little brand activity", 1),
      o(
        "A planned split with over 40% building demand, measured on pipeline impact",
        3,
      ),
    ],
  },
  {
    id: "CM5",
    pillar: "acquisition",
    question:
      "What happens to your cost per acquisition when you increase spend?",
    options: [
      o("It holds or falls, because demand we built earlier is converting", 3),
      o("It rises steadily every quarter", 1),
      o("It jumps quickly. We hit a ceiling", 0),
      o("It stays fairly stable", 2),
      o("We haven't tracked it closely", 0),
    ],
  },
  {
    id: "CM6",
    pillar: "acquisition",
    question:
      "When you invest in brand or awareness, how do you know it's working?",
    options: [
      o("We don't really measure it, or we don't run brand activity", 0),
      o("Reach, impressions and engagement", 0),
      o(
        "We look at whether enquiries or sales lift while campaigns are running",
        1,
      ),
      o(
        "We track whether branded searches, direct traffic and inbound enquiries go up over time",
        2,
      ),
      o(
        "We test it, e.g. comparing regions or audiences that saw it against those that didn't, tied to pipeline or revenue",
        3,
      ),
    ],
  },
  {
    id: "CM7",
    pillar: "acquisition",
    question:
      "What share of new pipeline or revenue comes from your single biggest channel?",
    options: [
      o("Under 25%", 3),
      o("60 to 80%", 0),
      o("40 to 60%", 1),
      o("Over 80%", 0),
      o("25 to 40%", 2),
      o("Not sure", 0),
    ],
  },
  {
    id: "CM8",
    pillar: "acquisition",
    question: "How do you develop and test creative and messaging?",
    options: [
      o("Assets are produced as needed, with little structured testing", 0),
      o("Regular testing, mostly within paid media", 2),
      o("Occasional A/B tests", 1),
      o(
        "A testing roadmap built on customer research, with winning messages rolled out across every channel",
        3,
      ),
    ],
  },
  {
    // Intel only: goes to the lead email and HubSpot, never scored
    id: "CM9",
    pillar: "acquisition",
    multi: true,
    scored: false,
    // Two columns even though some labels are long
    columns: 2,
    question: "Which platforms are you currently advertising on?",
    options: [
      { value: "google_search", label: "Google Search" },
      { value: "pmax_shopping", label: "Performance Max / Shopping" },
      { value: "youtube", label: "YouTube" },
      { value: "demand_gen", label: "Demand Gen" },
      { value: "microsoft", label: "Microsoft Ads (Bing)" },
      { value: "amazon", label: "Amazon Ads" },
      {
        value: "retail_media",
        label: "Retail media (Woolworths Cartology, Coles 360, etc.)",
      },
      { value: "apple_search", label: "Apple Search Ads" },
      { value: "meta", label: "Meta (Facebook & Instagram)" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "tiktok", label: "TikTok" },
      { value: "pinterest", label: "Pinterest" },
      { value: "snapchat", label: "Snapchat" },
      { value: "reddit", label: "Reddit" },
      { value: "x", label: "X (Twitter)" },
      { value: "programmatic", label: "Programmatic / display" },
      { value: "native", label: "Native (Taboola, Outbrain)" },
      { value: "audio", label: "Audio & podcasts (Spotify, LiSTNR)" },
      { value: "offline", label: "TV / radio / out-of-home" },
      // Opens an optional text field, saved as CM9_other
      { value: "other", label: "Other", other: true },
    ],
    otherPlaceholder: "Other platforms (optional)",
  },

  // Pillar 3: Website & conversion
  {
    id: "CM10",
    pillar: "conversion",
    question:
      "Do you know your website conversion rate, broken down by channel and landing page?",
    options: [
      o("Roughly. We check it occasionally", 1),
      o("Yes, by channel and landing page, reviewed monthly", 3),
      o("No, or I'm not sure", 0),
      o("Yes, but only site-wide", 2),
    ],
  },
  {
    id: "CM11",
    pillar: "conversion",
    question: "Where does your campaign traffic land?",
    options: [
      o("Homepage or general pages", 0),
      o("Relevant product or service pages", 2),
      o("One landing page for most campaigns", 1),
      o("Dedicated pages per campaign and audience, matched to the ad's message", 3),
    ],
  },
  {
    id: "CM12",
    pillar: "conversion",
    question: "How do you improve website conversion?",
    options: [
      o("An ongoing CRO program, with a testing roadmap and user research", 3),
      o("A redesign every few years", 0),
      o("Regular updates based on analytics, with little formal testing", 2),
      o("The occasional test or tweak", 1),
      o("We don't actively work on improving website conversion", 0),
    ],
  },

  // Pillar 4: Data, CRM & martech
  {
    id: "CM13",
    pillar: "data",
    question: "How would you rate your CRM hygiene?",
    options: [
      o("Clean. Required fields, deduplication and ownership rules are enforced", 3),
      o("Patchy. We clean it before every major report", 1),
      o("Mostly reliable, with known gaps", 2),
      o("We don't trust it, or I'm not sure", 0),
    ],
  },
  {
    id: "CM14",
    pillar: "data",
    question: "How consistently does sales update the CRM?",
    options: [
      o("Rarely. Deals live in inboxes and spreadsheets", 0),
      o("Every deal stage and closed-won / lost reason, every time", 3),
      o("Stages get updated, but loss reasons are hit and miss", 2),
      o("Only when we chase them", 1),
    ],
  },
  {
    id: "CM15",
    pillar: "data",
    question: "How well is your CRM connected to the rest of your stack?",
    options: [
      o(
        "Fully. Website, ad platforms and sales tools sync, and closed deals feed back to the ad platforms",
        3,
      ),
      o("Connected to the website and email, but not the ad platforms", 2),
      o("Some integrations, plenty of manual exports", 1),
      o("Mostly manual, or not sure", 0),
    ],
  },
  {
    id: "CM16",
    pillar: "data",
    question: "How do you bring customer data together across touchpoints?",
    options: [
      o("It's siloed. There's no single view of the customer", 0),
      o("A CDP or data warehouse, used for segmentation and personalisation", 3),
      o("Spread across tools and joined manually when needed", 1),
      // A mid-size business doesn't need a CDP, so this still scores 2
      o("Mostly in the CRM, connected to our key tools", 2),
    ],
  },

  // Pillar 5: Content strategy
  {
    id: "CM17",
    pillar: "content",
    question: "How does content help you win customers?",
    options: [
      o("Mostly social posts, blogs & ad creative to stay visible", 1),
      o(
        "Planned around how people decide to buy, from first hearing about us to purchase, and measured on sales or pipeline",
        3,
      ),
      o("Ad hoc, when the team has time", 0),
      o("Mainly proof that helps people buy, like case studies, reviews & UGC", 2),
    ],
  },
  {
    id: "CM18",
    pillar: "content",
    question: "How do your leaders show up as voices in your market?",
    options: [
      o("Regularly, with a clear point of view tied to our positioning", 3),
      o("Not at all", 0),
      o("Mostly company announcements and reshares", 1),
      o("Occasional posts with no real strategy behind them", 2),
    ],
  },
  {
    id: "CM19",
    pillar: "content",
    question:
      "How visible is your brand in AI search (ChatGPT, Perplexity, Google AI Overviews)?",
    options: [
      o("We track it and actively optimise for it", 3),
      o("We've checked, but haven't optimised for it", 2),
      o("We rank in Google and assume AI search follows", 1),
      o("It's not something we've looked at yet", 0),
    ],
  },

  // Pillar 6: Positioning & brand
  {
    id: "CM20",
    pillar: "positioning",
    question:
      "Ask five people in your sales team what makes you different. What happens?",
    // B2C, ecom and mix wording
    questionAlt:
      "Ask five people in your team what makes you different. What happens?",
    options: [
      o("Five different answers", 0),
      o("The same core message, mostly", 2),
      o("Similar themes, different words", 1),
      o("The same answer, and customers repeat it back to us", 3),
    ],
  },
  {
    id: "CM21",
    pillar: "positioning",
    question: "How often do deals come down to price?",
    options: [
      o("Rarely. We win on value", 3),
      o("Sometimes", 2),
      o("Most of the time", 0),
      o("Often, in competitive deals", 1),
    ],
  },

  // Pillar 7: Budget allocation
  {
    id: "CM22",
    pillar: "budget",
    question: "How is next year's marketing budget set?",
    options: [
      o("Last year's figure, plus or minus a percentage", 1),
      o("Bottom-up, from revenue targets and channel CAC", 3),
      o("Whatever finance allocates", 0),
      o("A mix of top-down targets and channel performance", 2),
    ],
  },
  {
    id: "CM23",
    pillar: "budget",
    question: "Which number governs your paid media spend?",
    options: [
      o("In-platform ROAS or cost per lead", 1),
      o("Spend against budget", 0),
      o("Pipeline or revenue by channel", 2),
      o("Blended CAC or MER, against payback period or LTV", 3),
    ],
  },

  // Pillar 8: Team & partners
  {
    id: "CM24",
    pillar: "team",
    question: "How would you describe your team's capacity?",
    options: [
      o("Stretched. Execution squeezes out strategy", 0),
      o("Strategy and execution both covered, with headroom to test", 3),
      o("Covering the basics, with no room to test", 1),
      o("Capable, with a few skill gaps we're filling", 2),
    ],
  },
  {
    id: "CM25",
    pillar: "team",
    question: "How do your agencies or external partners operate?",
    options: [
      o("Accountable to commercial outcomes and bringing ideas to us", 3),
      o("They report on activity rather than outcomes", 1),
      o("Solid, but we drive most of the thinking", 2),
      // Scores 0 but flags "Agency under review" in the lead email
      { label: "We're reviewing or replacing at least one", points: 0, agencyReview: true },
      // Not scored, so the pillar is scored on CM24 alone
      o("We don't use external partners", null),
    ],
  },
];

// Question text for the business type (only CM20 changes)
export function questionsFor(track) {
  return QUESTIONS.map((q) =>
    q.questionAlt && track !== "b2b" ? { ...q, question: q.questionAlt } : q,
  );
}

// Short labels for the lead email and HubSpot answer summary. Call openers
// (from the lowest answer) are added here once the insight library is written.
export const QUESTION_META = {
  CM1: { label: "Headline number to leadership" },
  CM2: { label: "Leadership trust in the numbers" },
  CM3: { label: "Impact of a 30% budget cut" },
  CM4: { label: "Spend building demand" },
  CM5: { label: "Acquisition cost at scale" },
  CM6: { label: "Measuring brand impact" },
  CM7: { label: "Share from biggest channel" },
  CM8: { label: "Creative & messaging testing" },
  CM9: { label: "Ad platforms" },
  CM10: { label: "Conversion rate visibility" },
  CM11: { label: "Campaign landing pages" },
  CM12: { label: "Improving conversion" },
  CM13: { label: "CRM hygiene" },
  CM14: { label: "Sales CRM updates" },
  CM15: { label: "CRM integration" },
  CM16: { label: "Single customer view" },
  CM17: { label: "How content wins customers" },
  CM18: { label: "Leaders as market voices" },
  CM19: { label: "AI search visibility" },
  CM20: { label: "Team on what makes you different" },
  CM21: { label: "Deals coming down to price" },
  CM22: { label: "How budget is set" },
  CM23: { label: "Number governing paid spend" },
  CM24: { label: "Team capacity" },
  CM25: { label: "Agencies & partners" },
};

// Insight library, keyed by question ID + option letter (A = first option), for
// every answer worth 0 or 1 point: { read, told, firstMove, opener }. `read` goes
// in the lead email; `told` and `firstMove` on the priority card (the first move
// comes from the pillar's weakest answer). To be written once the draft is signed
// off; cards and emails skip any line that's missing.
export const INSIGHTS = {};

export function insightFor(question, answer, points) {
  if (points === null || points > 1) return null;
  return INSIGHTS[`${question.id}_${String.fromCharCode(65 + answer)}`] || null;
}

// ── Stage 3: Qualification (fit score, hidden) ─────────────────────────────

export const QUALIFICATION_INTRO =
  "Last step. Five quick questions so we can tailor your results to your organisation’s size.";

export const QUALIFICATION_QUESTIONS = [
  {
    id: "Q1",
    key: "revenue",
    question: "Company annual revenue?",
    options: [
      o("Under $5M", 0),
      o("$5M to $20M", 15),
      o("$20M to $100M", 25),
      o("$100M+", 25),
    ],
  },
  {
    id: "Q2",
    key: "budget",
    question: "Annual marketing budget, including team and media?",
    options: [
      o("Under $250k", 0),
      o("$250k to $1M", 15),
      o("$1M to $5M", 25),
      o("$5M+", 25),
    ],
  },
  {
    id: "Q3",
    key: "role",
    question: "Your role?",
    options: [
      o("CMO / Head of Marketing", 20),
      o("Founder / CEO", 20),
      o("Marketing Director or Manager", 15),
      // Opens an optional text field, saved as Q3_other
      { label: "Other", points: 0, other: true },
    ],
    otherPlaceholder: "Your role (optional)",
  },
  {
    id: "Q4",
    key: "partners",
    question: "Where are you with external partners?",
    options: [
      { label: "Reviewing or replacing an agency", points: 15, agencyReview: true },
      o("Looking to add a specialist partner", 15),
      o("Building capability in-house", 5),
      o("Happy with current partners", 5),
    ],
  },
  {
    id: "Q5",
    key: "timeline",
    question: "When are you planning to act on this?",
    options: [
      o("Now, it's a priority", 15),
      o("Before the next budget cycle", 10),
      o("Later this year", 5),
      o("Just benchmarking", 0),
    ],
  },
];

// Any other role gets "Not the decision-maker" in the lead email
export const DECISION_MAKER_ROLES = ["CMO / Head of Marketing", "Founder / CEO"];

// ── Stage 4: Gate ──────────────────────────────────────────────────────────

export const GATE = {
  headline: "Your benchmark is ready.",
  subhead:
    "We've scored your marketing function across eight pillars and identified your three priorities, each with the business case behind it. Where should we send your report?",
  button: "See my results",
  // Both unticked by default. Only marketingOptin adds people to nurture.
  checkboxes: [
    {
      key: "marketingOptin",
      label: "Send me industry insights & unique strategies I won't find online.",
    },
    {
      key: "sessionRequested",
      label: "I'd like a strategy session to walk through my results.",
    },
  ],
  microcopy:
    "Your results appear on the next screen, with a shareable report sent to your inbox. We'll never share your details.",
};

// Work email only. Matches the domain's first label, so yahoo.com.au and
// hotmail.co.uk are caught too.
const FREE_EMAIL =
  /@(gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|icloud|me|aol|proton|protonmail|bigpond)\./i;

export const isWorkEmail = (email) => !FREE_EMAIL.test(email);

// ── Stage 5: Results ───────────────────────────────────────────────────────

// Names to be finalised alongside the quiz name
export const TIERS = [
  {
    min: 0,
    name: "Reactive",
    color: "var(--mesm-red)",
    bullets: [
      "Marketing runs on effort rather than a system.",
      "Leadership can't see what it returns, so the budget is always exposed.",
      "This is where the fastest gains are.",
    ],
  },
  {
    min: 40,
    name: "Established",
    color: "var(--mesm-yellow)",
    bullets: [
      "The engine runs, but it's built to capture demand rather than create it.",
      "Costs creep up as you scale.",
    ],
  },
  {
    min: 60,
    name: "Strategic",
    color: "#86ef7d",
    bullets: [
      "Your foundations are stronger than most.",
      "Two or three gaps are capping what marketing can prove and deliver.",
    ],
  },
  {
    min: 80,
    name: "Leader",
    color: "var(--accent)",
    bullets: [
      "Leadership sees marketing as a growth driver.",
      "Your job now is widening the gap.",
    ],
  },
];

// Priority cards: pillars under 60, lowest first, max 3. `firstMove` comes from
// the insight library once it's written. `working` is the "What's working" line
// when the pillar is their strongest.
export const PRIORITIES = {
  measurement: {
    headline: "Make marketing's return undeniable",
    businessCase:
      "When leadership can't see what marketing returns, it's treated as a cost, and costs get cut first.",
    working:
      "Leadership can see what marketing returns. That makes every budget conversation easier, and it's the base the other pillars build on.",
  },
  acquisition: {
    headline: "Build demand before you need it",
    businessCase:
      "Spending mostly on in-market buyers caps growth at the size of today's demand, and costs rise as competitors bid for the same people.",
    working:
      "You're building demand, not just capturing it. That keeps acquisition costs in check as you scale.",
  },
  conversion: {
    headline: "Turn more of your traffic into revenue",
    businessCase:
      "Every point of conversion you lift makes all your media spend more efficient at once. It's usually the cheapest growth available.",
    working:
      "Your website turns traffic into results, so every dollar of media works harder.",
  },
  data: {
    headline: "Make your data something people trust",
    businessCase:
      "If sales and finance don't trust the CRM, every report starts an argument instead of a decision.",
    working:
      "Your data is trusted. Reports lead to decisions, not debates about whose numbers are right.",
  },
  content: {
    headline: "Make content a pipeline asset",
    businessCase:
      "Content built for visibility gets ignored. Content mapped to how buyers decide shortens sales cycles and lowers acquisition costs.",
    working:
      "Your content earns its place in the pipeline. It moves buyers forward instead of just keeping you visible.",
  },
  positioning: {
    headline: "Give the market one reason to choose you",
    businessCase:
      "When your own team can't say what makes you different, buyers default to price, and margin pays for it.",
    working:
      "Your team and your market know why you're different, which protects price and margin.",
  },
  budget: {
    headline: "Move money to where it returns",
    businessCase:
      "Budgets set by last year's figure fund last year's plan. Reallocating on performance is growth you've already paid for.",
    working:
      "Your budget follows performance, so money moves to where it returns.",
  },
  team: {
    headline: "Free your team to think",
    businessCase:
      "A team buried in execution has no time to test, and without testing, performance flatlines.",
    working:
      "Your team has room to think and test, and your partners are pulling their weight.",
  },
};

export const NO_PRIORITIES_MESSAGE =
  "Every pillar scored 60 or above. Your priorities are about widening the gap, not closing it.";

// Score range label for each tier, e.g. "40 to 59"
export function tierRange(tier) {
  const i = TIERS.findIndex((t) => t.name === tier.name);
  const max = i < TIERS.length - 1 ? TIERS[i + 1].min - 1 : 100;
  return `${tier.min} to ${max}`;
}

// Pillar status on the results page
export const PILLAR_STATUS = [
  { min: 0, name: "Needs focus", color: "var(--mesm-red)" },
  { min: 60, name: "Solid", color: "var(--mesm-yellow)" },
  { min: 80, name: "Strong", color: "#86ef7d" },
];

export function pillarStatus(score) {
  return [...PILLAR_STATUS].reverse().find((s) => score >= s.min);
}

export const CTA = {
  // High and mid fit. Same shape as the Growth Leak Review CTA (ReviewCta).
  session: {
    eyebrow: "Next step",
    headline: "Want a second set of eyes?",
    body: [
      "Book a 45-minute strategy session with me. We'll work through your benchmark, discuss your priorities and map the first moves, ready to take to your leadership team.",
    ],
    button: "Book a strategy session",
    microcopy: "45 minutes · Confidential · No obligation",
    image:
      "https://cdn.sanity.io/images/wpr5jlmc/production/88f1166772a3d1184533e298e8be8391e37d2afb-4000x4000.jpg",
    caption: "Petar Petrovic - Founder",
    form: {
      heading: "Book your strategy session",
      bestTimeLabel: "Best time to reach you",
      bestTimes: ["Morning", "Afternoon", "Either"],
      messagePlaceholder: "Anything we should know before the session? (optional)",
      submit: "Book a strategy session",
      microcopy: "We'll be in touch within one business day to lock in a time.",
    },
    thanks: {
      headline: (firstName) =>
        firstName ? `You're booked in, ${firstName}` : "You're booked in",
      body: "We're already reviewing your benchmark. Expect a call or email from us within one business day to confirm a time.",
    },
  },
  // Low fit: the full report download
  report: {
    eyebrow: "Next step",
    headline: "Take your benchmark to your leadership team",
    body: [
      "Download the full report: your score, all eight pillars and your three priorities, each with the business case behind it.",
    ],
    button: "Download the full report",
  },
};

// How long results links work: the prospect's share link, and ours in the lead email
export const SHARE_LINK_DAYS = 30;
export const INTERNAL_LINK_DAYS = 90;

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_QUIZ_BOOKING_URL || "/connect";
