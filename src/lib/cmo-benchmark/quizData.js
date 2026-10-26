// CMO Benchmark (working title) — single source of truth for questions, scoring and copy.
// Points live here and are only ever used for scoring; they are never rendered.
// `points: null` marks an answer that isn't scored (the question drops out of its pillar).

export const PILLARS = [
  {
    key: "measurement",
    weight: 0.15,
    label: "Measurement & leadership confidence",
  },
  { key: "acquisition", weight: 0.15, label: "Acquisition strategy" },
  { key: "conversion", weight: 0.15, label: "Website & conversion" },
  {
    key: "data",
    weight: 0.15,
    label: "Data, CRM & martech",
    ecomLabel: "Customer data & martech",
  },
  { key: "content", weight: 0.1, label: "Content strategy" },
  { key: "positioning", weight: 0.1, label: "Positioning & brand" },
  { key: "budget", weight: 0.1, label: "Budget allocation" },
  { key: "team", weight: 0.1, label: "Team & partners" },
];

// Pillar labels for the business type (only the data pillar changes for ecom)
export function pillarsFor(track) {
  return PILLARS.map((p) =>
    p.ecomLabel && track === "ecom" ? { ...p, label: p.ecomLabel } : p,
  );
}

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

// Landing FAQ (answers render as HTML)
export const LANDING_FAQ = [
  {
    question: "What is this?",
    textContent:
      "A 7-minute diagnostic for marketing leaders. It looks at how your strategy, channels, data, budget & measurement hold up, then shows you the three moves most likely to lift pipeline & revenue.",
  },
  {
    question: "Who is it for?",
    textContent:
      "CEOs, CMOs, Marketing Directors & Heads of Marketing who own a number and have to defend a budget. It works for B2B, services & ecommerce.",
  },
  {
    question: "What do I get at the end?",
    textContent:
      "<ul class='list-disc pl-5 space-y-1'><li>An overall score out of 100 & your tier: Reactive, Established, Strategic or Leader</li><li>A score for each of the eight areas</li><li>Your three priorities, with the commercial case for each</li><li>A one-page summary you can download as a PDF and take to your board</li></ul> </br>Your results show on screen as soon as you finish, and a copy goes to your inbox.",
  },
  {
    question: "How is it scored?",
    textContent:
      "Against what we see in teams that grow pipeline predictably and can prove what their spend returns. Your score shows how close you are to that standard. It's not a ranking against other companies.",
  },
  {
    question: "What if I don't know an answer?",
    textContent:
      "Pick “Not sure”. If a number is hard to pull, that's worth knowing, and it's usually where the quickest wins are located.",
  },
  {
    question: "Is my information confidential?",
    textContent:
      "Yes. Your answers are only used to build your results and to prepare for a session if you book one.",
  },
  {
    question: "My team already performs well. Is it worth 7 minutes?",
    textContent:
      "Yes. A strong score gives you evidence to back your strategy in front of leadership. Most high-performing teams still have one or two constraints capping growth, usually where attribution, budget & channel mix meet.",
  },
  {
    question: "We already have an agency. Does that matter?",
    textContent:
      "Not at all. Treat it as a second opinion. It doesn't replace anyone. It shows you where to point your team & partners next.",
  },
  {
    question: "Will someone call me?",
    textContent:
      "Only if you ask.</br></br>At the end you can tick a box to book a strategy session, where we go through your results, review your site & ads, and map out the first moves. If you don't tick it, you just get your results.",
  },
  {
    question: "Is it free? What's the catch?",
    textContent:
      "It's free. We built it because the same constraints show up in almost every marketing team we work with, and this surfaces them faster than a discovery call. If we can help, we'll tell you. If not, you still leave with a clear plan.",
  },
  {
    question: "What does a low score mean?",
    textContent:
      "Nothing about your ability. Most marketing leaders inherit budgets, tech & structures they didn't choose.</br></br>A lower score points to the biggest upside, and gives you the business case to fix it.",
  },
];

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

export const ECOM_INDUSTRIES = [
  "Fashion & apparel",
  "Beauty & skincare",
  "Health & supplements",
  "Home & living",
  "Food & beverage",
  "Sports & fitness",
  "Jewellery & accessories",
  "Pets",
  "Kids & baby",
  "Other",
];

// Industry list for the business type: ecom gets its own list, a mix gets the
// services list with "Ecommerce / retail" in place of "Retail & consumer"
export function industriesFor(track) {
  if (track === "ecom") return ECOM_INDUSTRIES;
  if (track === "mix") {
    return INDUSTRIES.map((i) =>
      i === "Retail & consumer" ? "Ecommerce / retail" : i,
    );
  }
  return INDUSTRIES;
}

export const OTHER_MAX_LENGTH = 50;

export const H2 = {
  id: "H2",
  question: "What industry are you in?",
  otherPlaceholder: "Type your industry (optional)",
};

// "Other" opens an optional text field, saved as H2_other
export const h2For = (track) => ({
  ...H2,
  options: industriesFor(track).map((label) => ({
    value: label,
    label,
    other: label === "Other",
  })),
});

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
  grow: (t) =>
    `You need to grow ${t} on the same budget. Here's where the headroom is.`,
  prove: () =>
    "You need to prove marketing's return. Here's where the case is weakest.",
  cac: () =>
    "You need to bring acquisition costs down. Here's what's holding them up.",
  markets: () =>
    "You're entering new markets. Here's what needs to be ready first.",
  budget: () =>
    "You need to defend your budget. Here's where the case needs work.",
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
    question:
      "When you report to the CEO or board, what's the headline number?",
    options: [
      o("Leads, traffic or engagement", 1),
      o(
        "Pipeline or revenue contribution, on an attribution model leadership accepts",
        3,
      ),
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
      o(
        "Dedicated pages per campaign and audience, matched to the ad's message",
        3,
      ),
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
      o(
        "Clean. Required fields, deduplication and ownership rules are enforced",
        3,
      ),
      o("Patchy. We clean it before every major report", 1),
      o("Mostly reliable, with known gaps", 2),
      o("We don't trust it, or I'm not sure", 0),
    ],
    ecom: {
      question: "How do you use customer data to drive repeat purchases?",
      options: [
        o("Mostly the same emails to everyone", 0),
        o(
          "Flows built on purchase history, e.g. post-purchase, replenishment, win-back",
          3,
        ),
        o("The basics, like welcome & abandoned cart", 1),
        o("Some segmentation, but mostly one-off campaign sends", 2),
      ],
    },
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
    ecom: {
      question:
        "Do you know your customer lifetime value by acquisition channel?",
      options: [
        o("Yes, by channel & cohort, and it shapes how we allocate budget", 3),
        o("No, or I'm not sure", 0),
        o("Only a single overall figure", 1),
        o("Roughly, by channel, but we don't act on it much", 2),
      ],
    },
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
    ecom: {
      question:
        "How well are your store, email platform & ad platforms connected?",
      options: [
        o(
          "Fully. Purchase data, including new vs returning customers, feeds back to the ad platforms server-side",
          3,
        ),
        o(
          "Store and email are synced, ad platforms run on the standard pixel",
          2,
        ),
        o("Some integrations, plenty of manual exports", 1),
        o("Mostly manual, or not sure", 0),
      ],
    },
  },
  {
    id: "CM16",
    pillar: "data",
    question: "How do you bring customer data together across touchpoints?",
    options: [
      o("It's siloed. There's no single view of the customer", 0),
      o(
        "A CDP or data warehouse, used for segmentation and personalisation",
        3,
      ),
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
      o(
        "Mainly proof that helps people buy, like case studies, reviews & UGC",
        2,
      ),
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
    ecom: {
      question: "How much of your revenue relies on discounts or sale events?",
      options: [
        o("Very little. Most customers buy at full price", 3),
        o("Most of it. Sales drop when we're not running a promo", 0),
        o("A big chunk. We run promos most months", 1),
        o("Some, mostly around key moments like Black Friday & EOFY", 2),
      ],
    },
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
      {
        label: "We're reviewing or replacing at least one",
        points: 0,
        agencyReview: true,
      },
      // Not scored, so the pillar is scored on CM24 alone
      o("We don't use external partners", null),
    ],
  },
];

// Question text for the business type: CM20 changes for everyone but B2B, and
// ecom swaps CM13 to CM15 and CM21. IDs stay the same, so scoring and HubSpot
// properties are shared across tracks.
export function questionsFor(track) {
  return QUESTIONS.map(({ ecom, ...q }) => {
    if (ecom && track === "ecom") return { ...q, ...ecom, variant: "ecom" };
    if (q.questionAlt && track !== "b2b")
      return { ...q, question: q.questionAlt };
    return q;
  });
}

// Short labels for the lead email and HubSpot answer summary, and the call
// opener used when the question holds the lead's lowest-scoring answer. Ecom
// swaps have their own label and opener.
export const QUESTION_META = {
  CM1: {
    label: "Headline number to leadership",
    opener:
      "When you walk into a board meeting, what's the one number you lead with, and does the CFO agree with it?",
  },
  CM2: {
    label: "Leadership trust in the numbers",
    opener:
      "When marketing and finance each pull revenue numbers, how far apart are they?",
  },
  CM3: {
    label: "Impact of a 30% budget cut",
    opener:
      "If the CFO asked tomorrow what a 30% cut would cost in revenue, what would you tell them?",
  },
  CM4: {
    label: "Spend building demand",
    opener:
      "How much of next quarter's pipeline do you think already knows your name today?",
  },
  CM5: {
    label: "Acquisition cost at scale",
    opener:
      "The last time you pushed more budget in, what happened to cost per acquisition in the first month?",
  },
  CM6: {
    label: "Measuring brand impact",
    opener:
      "When brand activity runs, what's the first number you check to see if it worked?",
  },
  CM7: {
    label: "Share from biggest channel",
    opener:
      "If your biggest channel doubled its costs next month, what would you do?",
  },
  CM8: {
    label: "Creative & messaging testing",
    opener:
      "Which message has done the most for you this year, and how do you know?",
  },
  CM9: { label: "Ad platforms" },
  CM10: {
    label: "Conversion rate visibility",
    opener:
      "Which landing page converts best for you right now, and which converts worst?",
  },
  CM11: {
    label: "Campaign landing pages",
    opener:
      "Walk me through what someone sees after they click your best-performing ad.",
  },
  CM12: {
    label: "Improving conversion",
    opener:
      "What's the last change you made to the website, and what did it do to conversion?",
  },
  CM13: {
    label: "CRM hygiene",
    ecomLabel: "Repeat purchase flows",
    opener:
      "If I pulled a report from your CRM right now, how much would you trust it?",
    ecomOpener:
      "What happens to a customer in the 30 days after their first order?",
  },
  CM14: {
    label: "Sales CRM updates",
    ecomLabel: "LTV by channel",
    opener:
      "When a deal is lost, where does the reason get recorded, and who reads it?",
    ecomOpener: "Which channel brings you the customers who come back most?",
  },
  CM15: {
    label: "CRM integration",
    ecomLabel: "Store, email & ad integration",
    opener:
      "Do the ad platforms ever find out which leads turned into revenue?",
    ecomOpener:
      "Can the ad platforms tell a new customer from a returning one?",
  },
  CM16: {
    label: "Single customer view",
    opener:
      "If you wanted to see everything a customer has done with you, how many tools would you open?",
  },
  CM17: {
    label: "How content wins customers",
    opener:
      "Which piece of content has actually helped close a deal or a sale this year?",
  },
  CM18: {
    label: "Leaders as market voices",
    opener:
      "Who in your leadership team has the strongest point of view, and where do people hear it?",
  },
  CM19: {
    label: "AI search visibility",
    opener:
      "If someone asked ChatGPT for the best option in your category, would you be named?",
  },
  CM20: {
    label: "Team on what makes you different",
    opener:
      "If I asked your newest salesperson why a customer should choose you, what would they say?",
  },
  CM21: {
    label: "Deals coming down to price",
    ecomLabel: "Reliance on discounts",
    opener:
      "When you lose a deal on price, what do you think the buyer didn't see?",
    ecomOpener:
      "How many months last year did you hit target without a sale running?",
  },
  CM22: {
    label: "How budget is set",
    opener:
      "How was this year's marketing budget decided, and who signed off on the number?",
  },
  CM23: {
    label: "Number governing paid spend",
    opener:
      "What number would make you move budget from one channel to another tomorrow?",
  },
  CM24: {
    label: "Team capacity",
    opener:
      "When did your team last have a week to work on strategy instead of execution?",
  },
  CM25: {
    label: "Agencies & partners",
    opener:
      "What did your agency bring you last quarter that you didn't ask for?",
  },
};

// Insight library, keyed by question ID + option letter (A = first option), for
// every answer worth 0 or 1 point. Ecom swaps have their own answers, so they're
// keyed e.g. CM13_ecom_A. CM9 isn't scored, so it has none.
// read goes in the lead email; told and why go on the priority card.
const ins = (read, told, why) => ({ read, told, why });

export const INSIGHTS = {
  // Pillar 1: Measurement & leadership confidence
  CM1_A: ins(
    "Reports activity, not revenue. Leadership can't connect spend to growth.",
    "You report leads, traffic or engagement to leadership.",
    "Activity numbers don't tell a CEO what marketing returns, so the budget is judged on cost alone.",
  ),
  CM1_D: ins(
    "No consistent headline metric. Every report starts from scratch, and trust erodes.",
    "Your headline number to leadership changes from report to report.",
    "Without one consistent number, leadership can't track progress, and every meeting becomes a debate about the data.",
  ),
  CM2_B: ins(
    "Sales and marketing numbers don't match. Credibility is leaking upward.",
    "Sales and marketing tell different stories about results.",
    "When the numbers don't line up, leadership believes neither, and marketing's budget is the easiest to question.",
  ),
  CM2_D: ins(
    "Marketing seen as a cost centre. Budget is exposed in every downturn.",
    "Leadership still sees marketing as a cost centre.",
    "Cost centres get cut first. Until marketing is linked to revenue, the budget is always on the table.",
  ),
  CM3_B: ins(
    "Can't model what a budget cut would cost. Will struggle to defend spend.",
    "You've never modelled what revenue you'd lose if your budget were cut.",
    "If you can't show what the budget earns, you can't protect your position.",
  ),
  CM3_D: ins(
    "Knows it matters but can't quantify it. Defending budget on instinct.",
    "You'd struggle to put a number on what a 30% cut would cost.",
    "Budget conversations are won with numbers. Without one, the decision gets made on cost alone.",
  ),

  // Pillar 2: Acquisition strategy
  CM4_A: ins(
    "Nearly all spend on bottom of funnel. Fighting competitors for the same small pool.",
    "Almost all your spend goes to people who are ready to buy today.",
    "Ready-to-buy buyers are the smallest and most expensive part of the market. Acquisition costs skyrocket when bidding on the same audience as everyone else.",
  ),
  CM4_C: ins(
    "Token brand spend. Not enough to build future demand.",
    "Most of your spend chases ready-to-buy prospects, with a little brand activity.",
    "A small brand budget rarely builds enough demand to lower acquisition costs. The pipeline stays capped at today's demand.",
  ),
  CM5_B: ins(
    "CAC climbing every quarter. Demand isn't being replenished.",
    "Your cost per acquisition rises steadily every quarter.",
    "Rising costs usually mean you're running out of people who already know you. More spend speeds it up, not slows it down.",
  ),
  CM5_C: ins(
    "Hits a ceiling fast. In-market audience is exhausted.",
    "Your cost per acquisition jumps quickly when you scale.",
    "A quick jump means the in-market audience is used up. Growth needs new demand, not more budget on the same buyers.",
  ),
  CM5_E: ins(
    "Doesn't track how CAC responds to spend. Scaling blind.",
    "You haven't tracked what happens to acquisition cost when you increase spend.",
    "Without it, you can't tell whether more budget will grow revenue or just raise costs.",
  ),
  CM6_A: ins(
    "No brand activity or no measurement. Brand budget will be the first to go.",
    "You don't measure brand activity, or you don't run any.",
    "Unmeasured brand spend is the first line cut in a review, and without it, future demand dries up.",
  ),
  CM6_B: ins(
    "Measuring brand on reach and engagement. Can't show commercial impact.",
    "You measure brand on reach, impressions and engagement.",
    "Reach and engagement don't show leadership what brand returns, so it looks like a cost rather than an investment.",
  ),
  CM6_C: ins(
    "Measures short-term lift only. Misses the long-term effect of brand.",
    "You judge brand by whether enquiries or sales lift while campaigns run.",
    "Most brand impact shows up months down the line. Short-term lift undervalues it and doesn't paint the whole picture.",
  ),
  CM7_B: ins(
    "Heavy reliance on one channel. One platform change puts the number at risk.",
    "60 to 80% of new pipeline or revenue comes from one channel.",
    "One algorithm or pricing change on that platform puts most of your number at risk.",
  ),
  CM7_C: ins(
    "Concentrated in one channel. Exposed to platform changes and rising costs.",
    "40 to 60% of new pipeline or revenue comes from one channel.",
    "When one channel carries half the number, its bad month becomes your bad quarter.",
  ),
  CM7_D: ins(
    "Single-channel business. Extreme concentration risk.",
    "Over 80% of new pipeline or revenue comes from one channel.",
    "Your growth depends on a platform you don't control. Any change there flows straight through to revenue.",
  ),
  CM7_F: ins(
    "Doesn't know channel mix. Attribution gap.",
    "You're not sure how much comes from your biggest channel.",
    "If you can't see where revenue comes from, you can't tell where to put the next dollar.",
  ),
  CM8_A: ins(
    "No creative testing. Messaging is opinion, not evidence.",
    "Creative is produced as needed, with little structured testing.",
    "Creative is the biggest lever left in paid media. Without testing, you can't find the messages that lower costs.",
  ),
  CM8_C: ins(
    "Ad hoc tests. Learnings don't compound.",
    "You run occasional A/B tests.",
    "Occasional tests rarely build on each other, so the winning message never gets found or rolled out everywhere.",
  ),

  // Pillar 3: Website & conversion
  CM10_A: ins(
    "Rough view of conversion only. Can't pinpoint where traffic is lost.",
    "You only roughly know your conversion rate, and check it occasionally.",
    "A rough number hides which channels and pages are losing people. Trying to optimise your campaigns is like finding a needle in a haystack.",
  ),
  CM10_C: ins(
    "Doesn't know conversion rate. Can't separate a media problem from a website problem.",
    "You don't know your conversion rate by channel and landing page.",
    "Without it, you can't tell whether the ads or the website are underperforming, so you can't fix either.",
  ),
  CM11_A: ins(
    "Campaign traffic to the homepage. Message match broken, paid clicks wasted.",
    "Your campaign traffic lands on the homepage or general pages.",
    "A homepage tries to speak to everyone. Paid traffic converts when the page continues the ad's exact message.",
  ),
  CM11_C: ins(
    "One page for every campaign. Relevance drops as audiences differ.",
    "Most campaigns send traffic to one landing page.",
    "Different audiences need different reasons to act. One page for everyone speaks to no one.",
  ),
  CM12_B: ins(
    "Relies on redesigns. Long gaps where nothing improves.",
    "You improve conversion through a redesign every few years.",
    "Redesigns reset everything at once and rarely prove what worked. Small, constant tests are more effective and work faster.",
  ),
  CM12_D: ins(
    "Tweaks without a program. Gains don't compound.",
    "You make the occasional test or tweak.",
    "Without a testing roadmap, wins are one-offs. A steady program turns them into a lasting lift.",
  ),
  CM12_E: ins(
    "No conversion work at all. Every media dollar is working harder than it should.",
    "You don't actively work on improving website conversion.",
    "Lifting conversion makes every channel more efficient at once. It's usually the cheapest growth available.",
  ),

  // Pillar 4: Data, CRM & martech
  CM13_B: ins(
    "CRM cleaned manually before reporting. Time lost, numbers questioned.",
    "Your CRM is patchy, and gets cleaned before every major report.",
    "If the data needs cleaning before anyone sees it, every report costs time and still invites questions.",
  ),
  CM13_D: ins(
    "Doesn't trust the CRM. Reporting and targeting both compromised.",
    "You don't trust your CRM data, or you're not sure how reliable it is.",
    "If the CRM can't be trusted, neither can the reports, the targeting or the ad platform optimisation built on it.",
  ),
  CM13_ecom_A: ins(
    "No segmentation. Leaving repeat revenue on the table.",
    "You mostly send the same emails to everyone.",
    "Generic emails get ignored. Messages based on what someone bought drive the second order, where the margin is.",
  ),
  CM13_ecom_C: ins(
    "Basic flows only. Post-purchase and win-back missing.",
    "You run the basics, like welcome and abandoned cart.",
    "Most repeat revenue comes from post-purchase and win-back flows, and those aren't running yet.",
  ),
  CM14_A: ins(
    "Deals outside the CRM. No closed-loop reporting possible.",
    "Deals mostly live in inboxes and spreadsheets, not the CRM.",
    "If deals aren't in the CRM, marketing can't see which leads turn into revenue, and neither can the ad platforms.",
  ),
  CM14_D: ins(
    "CRM updated under pressure. Data is always out of date.",
    "Sales only updates the CRM when chased.",
    "Late updates mean pipeline reports are always behind, and marketing gets judged on incomplete numbers.",
  ),
  CM14_ecom_B: ins(
    "Doesn't know LTV by channel. Acquisition targets are guesses.",
    "You don't know customer lifetime value by acquisition channel.",
    "Without it, you can't tell which channels bring customers worth paying more for, so budget goes to the cheapest first order.",
  ),
  CM14_ecom_C: ins(
    "One blended LTV. Can't separate good channels from bad.",
    "You only know a single overall lifetime value figure.",
    "A blended number hides which channels bring loyal customers and which bring one-off buyers.",
  ),
  CM15_C: ins(
    "Manual exports between systems. Slow, error-prone and no feedback to ads.",
    "Your stack has some integrations, with plenty of manual exports.",
    "Manual exports are slow and error-prone, and the ad platforms never learn which leads became revenue.",
  ),
  CM15_D: ins(
    "Stack not connected. Ad platforms optimising on form fills, not revenue.",
    "Your CRM is mostly manual, or you're not sure how it's connected.",
    "If revenue data doesn't flow back to the ad platforms, they keep finding people who fill in forms but never buy.",
  ),
  CM15_ecom_C: ins(
    "Partly connected. Purchase data not feeding the ad platforms properly.",
    "Your store, email and ad platforms are partly connected, with plenty of manual exports.",
    "When purchase data doesn't flow cleanly, the ad platforms optimise on incomplete signals and find fewer of the right buyers.",
  ),
  CM15_ecom_D: ins(
    "Not connected. Ad platforms can't see real purchase data.",
    "Your store, email and ad platforms are mostly manual, or you're not sure how they connect.",
    "If the ad platforms can't see who bought, they can't find more people like them.",
  ),
  CM16_A: ins(
    "Data siloed. No single customer view, so no personalisation or accurate attribution.",
    "Your customer data is siloed, with no single view of the customer.",
    "Siloed data means every team sees a different customer, and nobody sees the full journey that led to revenue.",
  ),
  CM16_C: ins(
    "Data joined by hand. Slow insight, inconsistent answers.",
    "Your customer data is spread across tools and joined manually when needed.",
    "Manual joins take time and rarely match, so decisions wait on data or get made without it.",
  ),

  // Pillar 5: Content strategy
  CM17_A: ins(
    "Content for visibility only. Not tied to how buyers decide.",
    "Your content is mostly social posts, blogs and ad creative to stay visible.",
    "Content made to stay visible gets scrolled past. Content built around how people decide shortens the path to purchase.",
  ),
  CM17_C: ins(
    "No content plan. Output depends on spare time.",
    "Content gets made ad hoc, when the team has time.",
    "Ad hoc content can't build momentum, and buyers researching you find gaps instead of reasons to trust you.",
  ),
  CM18_B: ins(
    "Leaders invisible in market. Trust has to be built from zero every time.",
    "Your leaders don't show up as voices in your market.",
    "People buy from people, not organisations. Front-facing leadership differentiates you in today's hyper-saturated market.",
  ),
  CM18_C: ins(
    "Leaders share announcements only. No point of view, no pull.",
    "Your leaders mostly post company announcements and reshares.",
    "Announcements don't build authority. A clear point of view draws like-minded buyers to your business.",
  ),
  CM19_C: ins(
    "Assumes Google rankings carry into AI search. Untested.",
    "You rank in Google and assume AI search follows.",
    "AI search draws on different signals than Google rankings. Assuming you're visible is risky as search habits are shifting rapidly.",
  ),
  CM19_D: ins(
    "No view on AI search. Competitors may be getting recommended instead.",
    "You haven't looked at your visibility in AI search yet.",
    "More buyers start research in AI tools. Showing up at the research phase allows you to lower your acquisition costs.",
  ),

  // Pillar 6: Positioning & brand
  CM20_A: ins(
    "No shared positioning. Every team member sells a different company.",
    "Five people in your team would give five different answers about what makes you different.",
    "If your own team can't agree on the difference, buyers won't see one, and they'll compare you on price.",
  ),
  CM20_C: ins(
    "Positioning loosely shared. Message dilutes across touchpoints.",
    "Your team shares similar themes, but in different words.",
    "Different words for the same idea weaken it. One clear line is what buyers remember and repeat.",
  ),
  CM21_C: ins(
    "Most deals decided on price. Value isn't landing before the conversation.",
    "Most of your deals come down to price.",
    "When deals come down to price, value wasn't established early enough. Your margins take a hit. This might compound across deals and can quietly bleed your bottom line.",
  ),
  CM21_D: ins(
    "Loses on price in competitive deals. Differentiation is weak when compared side by side.",
    "Deals often come down to price when you're up against competitors.",
    "Side-by-side comparisons expose weak differentiation. More trust needs to be built via education. A clear reason to choose you takes price off the table.",
  ),
  CM21_ecom_B: ins(
    "Discount-dependent. Customers trained to wait for sales.",
    "Most of your revenue relies on discounts, and sales drop without a promo.",
    "Constant promos train customers to wait for the next sale, and every discount comes straight off margin.",
  ),
  CM21_ecom_C: ins(
    "Regular promos propping up revenue. Margin eroding.",
    "A big chunk of revenue relies on discounts, with promos most months.",
    "Monthly promos make full price feel optional. Heavy discounting is usually a positioning problem.",
  ),

  // Pillar 7: Budget allocation
  CM22_A: ins(
    "Budget rolled forward from last year. Not tied to targets.",
    "Next year's budget is last year's figure, plus or minus a percentage.",
    "Rolling last year's budget forward funds last year's plan, not this year's targets. Furthermore, it doesn't factor in geopolitical factors and macroeconomic changes today.",
  ),
  CM22_C: ins(
    "Marketing has no input into budget. Spend isn't linked to revenue goals.",
    "Your budget is whatever finance allocates.",
    "If marketing doesn't build the case, finance sets the number on cost, and growth targets aren't funded properly.",
  ),
  CM23_A: ins(
    "Optimising on platform-reported numbers. Likely over-credited.",
    "Your paid spend is governed by in-platform ROAS or cost per lead.",
    "Every platform takes credit for the same sale. Platform numbers alone can push budget to the wrong channels.",
  ),
  CM23_B: ins(
    "Paid media managed to budget, not return. No efficiency target.",
    "Your paid spend is governed by spend against budget.",
    "Spending the budget isn't the same as getting a return on it. Without a target, there's no signal to scale or cut.",
  ),

  // Pillar 8: Team & partners
  CM24_A: ins(
    "Team at capacity. No room for strategy or testing.",
    "Your team is stretched, and execution squeezes out strategy.",
    "When the team is always delivering, nobody has time to test; this can lead to poor performance.",
  ),
  CM24_C: ins(
    "Basics covered, nothing more. Growth relies on doing the same things harder.",
    "Your team covers the basics, with no room to test.",
    "Without room to test, growth depends on doing more of the same, and costs may escalate as the competitive landscape evolves.",
  ),
  CM25_B: ins(
    "Partners reporting activity, not outcomes. Accountability gap.",
    "Your partners report on activity rather than outcomes.",
    "Activity reports don't show what the spend returned, so you carry the accountability without the evidence.",
  ),
  // The read line also goes at the top of the lead email, with the agency flag
  CM25_D: ins(
    "AGENCY UNDER REVIEW. Strongest buying signal in the quiz. Same-day outreach.",
    "You're reviewing or replacing at least one partner.",
    "A partner change is the best moment to reset what you measure them on, so the next one is accountable to revenue from day one.",
  ),
};

export function insightFor(question, answer, points) {
  if (points === null || points > 1) return null;
  const id = question.variant
    ? `${question.id}_${question.variant}`
    : question.id;
  return INSIGHTS[`${id}_${String.fromCharCode(65 + answer)}`] || null;
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
      {
        label: "Reviewing or replacing an agency",
        points: 15,
        agencyReview: true,
      },
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
export const DECISION_MAKER_ROLES = [
  "CMO / Head of Marketing",
  "Founder / CEO",
];

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
      label:
        "Send me industry insights & unique strategies I won't find online.",
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

// Priority cards: pillars under 60, lowest first, max 3. `firstMove` shows on
// the card under "Why it matters". `working` is the "What's working" line when
// the pillar is their strongest. `ecom` overrides both for the ecom track.
export const PRIORITIES = {
  measurement: {
    headline: "Make marketing's return undeniable",
    businessCase:
      "When leadership can't see what marketing returns, it's treated as a cost, and costs get cut first.",
    firstMove:
      "Agree one revenue-linked headline number with finance, and report it the same way every month.",
    working:
      "Your numbers are trusted. Leadership sees marketing as a driver of revenue, which keeps the budget protected.",
  },
  acquisition: {
    headline: "Build demand before you need it",
    businessCase:
      "Spending mostly on in-market buyers caps growth at the size of today's demand, and costs rise as competitors bid for the same people.",
    firstMove:
      "Move a set share of budget into reaching buyers before they're in market, and measure it on branded search and pipeline over 90 days.",
    working:
      "You build demand as well as capture it, so acquisition costs hold as you scale.",
  },
  conversion: {
    headline: "Turn more of your traffic into revenue",
    businessCase:
      "Every point of conversion you lift makes all your media spend more efficient at once. It's usually the cheapest growth available.",
    firstMove:
      "Give your top 3 campaigns their own landing pages that continue the ad's message, then test one change a fortnight.",
    working:
      "Your website turns traffic into revenue efficiently, so every channel works harder.",
  },
  data: {
    headline: "Make your data something people trust",
    businessCase:
      "If sales and finance don't trust the CRM, every report starts an argument instead of a decision.",
    firstMove:
      "Lock down required fields and deal stages in the CRM, then feed closed revenue back to the ad platforms.",
    working:
      "Your data is trusted and connected, so reporting leads to decisions instead of debates.",
    ecom: {
      firstMove:
        "Build post-purchase and win-back flows based on what people bought, and send purchase data back to the ad platforms server-side.",
      working:
        "Your customer data drives repeat revenue and feeds the ad platforms the right signals.",
    },
  },
  content: {
    headline: "Make content a pipeline asset",
    businessCase:
      "Content built for visibility gets ignored. Content mapped to how buyers decide shortens sales cycles and lowers acquisition costs.",
    firstMove:
      "Map your content to the questions buyers ask at each stage, and track which pieces show up in won deals.",
    working:
      "Your content works as a sales asset, shortening the path from first touch to purchase.",
  },
  positioning: {
    headline: "Give the market one reason to choose you",
    businessCase:
      "When your own team can't say what makes you different, buyers default to price, and margin pays for it.",
    firstMove:
      "Write the one sentence that makes you different, and make sure every team member and every ad uses it.",
    working:
      "Your market knows why you're different, so you win on value, not price.",
    ecom: {
      firstMove:
        "Write the one sentence that makes you different, and plan sale events around it instead of discounting whenever sales dip.",
      working:
        "Customers buy at full price because they know why you're different.",
    },
  },
  budget: {
    headline: "Move money to where it returns",
    businessCase:
      "Budgets set by last year's figure fund last year's plan. Reallocating on performance is growth you've already paid for.",
    firstMove:
      "Build next year's budget bottom-up from revenue targets and what each channel costs to acquire a customer.",
    working: "Your budget follows performance, so money moves to what returns.",
  },
  team: {
    headline: "Free your team to think",
    businessCase:
      "A team buried in execution has no time to test, and without testing, performance flatlines.",
    firstMove:
      "Free one day a fortnight for testing, and hold partners to revenue outcomes rather than activity.",
    working:
      "Your team and partners have room to think and are accountable to results.",
  },
};

// Priority copy for the business type, with the ecom overrides applied
export function priorityFor(pillar, track) {
  const { ecom, ...copy } = PRIORITIES[pillar];
  return ecom && track === "ecom" ? { ...copy, ...ecom } : copy;
}

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
      messagePlaceholder: "Anything we should know before the session?",
      submit: "Book a strategy session",
      microcopy: "We'll be in touch shortly.",
      microcopyAlign: "left",
    },
    thanks: {
      headline: (firstName) =>
        firstName ? `You're booked in, ${firstName}` : "You're booked in",
      body: "We'll review your results shortly. Expect a call or email from us within 24 hours to confirm a time.",
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
