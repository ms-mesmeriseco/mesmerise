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

// FAQ on the landing page; answers render as HTML
export const LANDING_FAQ = [
  {
    question: "What is the Growth Leak Audit?",
    textContent:
      "A diagnostic that scores your marketing across six pillars: positioning, offer, traffic, conversion, tracking & nurture. It finds where revenue is leaking. You get a score, a tier & your three biggest leaks, ranked.",
  },
  {
    question: "Who is it built for?",
    textContent:
      "Lead gen businesses that sell through enquiries, bookings & quotes, and ecommerce brands that sell online.",
  },
  {
    question: "What is a growth leak?",
    textContent:
      "It's anywhere money goes in & doesn't come back out as revenue. Ads sending traffic to a homepage is a common one, for instance. Leads sitting dormant and waiting days for a reply are another. </br>Most businesses have three or four leaks quietly draining the bank account and pipeline.",
  },
  {
    question: "Why not just spend more on ads?",
    textContent:
      "Because more ad spend exposes a broken system, creating waste and anxiety. Most businesses aim almost everything at people ready to buy today, but their conversion tracking is wrong.</br>There are unique ways to open up market share and create demand even when interest rates are through the roof, and consumer sentiment is the lowest it’s been in decades. ",
  },
  {
    question: "How long does it take?",
    textContent: "About 4 minutes.",
  },
  {
    question: "What if I don't know the answer to a question?",
    textContent:
      "Choose “Not sure”. It's a legit answer and tells us everything we need to know. If you can't say what your conversion rate is or where your sales come from, that blind spot is a leak in itself.",
  },
  {
    question: "What do I get at the end?",
    textContent:
      "<ul class='list-disc pl-5 space-y-1'><li>Your overall score out of 100</li><li>Your tier: Invisible, Commodity, Contender or Category of One</li><li>A breakdown across all six pillars</li><li>Your biggest leaks, what each one is costing you & the first fix for each</li></ul> </br>Your results appear on screen as soon as you finish, & a copy goes to your inbox.",
  },
  {
    question: "Is it free? What's the catch?",
    textContent:
      "It's free.<br /><br />We built it because the same mistakes and pitfalls show up in nearly every business we audit, and a 4-minute diagnostic finds them faster than a discovery call. If your results show something we can fix, we can walk you through it and show you how we could help. ",
  },
  {
    question: "Will someone call me?",
    textContent:
      "Only if you ask. </br>If your results suggest we can help, you'll be offered a 30-minute Growth Leak Review where we go through your results, look at your website & ads, and show you the fixes that will have the biggest impact. </br>Book in for a chat if you feel up for it; it's your decision.",
  },
  {
    question: "I already have an agency. Is this still worth doing?",
    textContent:
      "Yeah, what difference does it make?</br>Think of it as a second opinion that takes 4 minutes. If your current setup is working, your score will say so. If it isn't, you'll know exactly where to look & what to ask.",
  },
  {
    question: "What does a low score mean?",
    textContent:
      "It means the future is bright and the opportunity is there. Businesses in the Invisible & Commodity tiers usually see the biggest returns because there's so much headroom to grow.",
  },
];

// ListIconsFocus under the landing hero; the component numbers the cards itself
export const LANDING_FOCUS = {
  title: {
    _type: "richText",
    content: [
      pt("fh", "You might be making at least one of these mistakes", "h2"),
    ],
  },
  listItems: [
    {
      _key: "focus1",
      title: "You're fishing in the pond instead of the ocean",
      content:
        "Most marketing is aimed at people ready to buy today. That's the smallest & most expensive part of your market, and every competitor is bidding on the same audience. Costs rise every quarter while the much bigger group who'll buy next month never knows your name.\nThe secret to deep scale and market penetration comes from reaching people before they're ready to buy, with a message that meets them at their level of awareness.",
    },
    {
      _key: "focus2",
      title: "Your tracking is wrong",
      content:
        "Ad platforms pamper the metrics so you spend more money. Without proper conversion tracking, you're scaling what looks like it works & cutting what actually does. The platforms then optimise for the wrong signal and find you more of the wrong customer.",
    },
    {
      _key: "focus3",
      title: "Buyers can't tell you apart",
      content:
        "When your brand looks & sounds like everyone else, buyers turn sceptical, you become commoditised, and they compare you on price. Every discount, every “can you do better?” and every lost quote traces back to the same issue.\nSpending more on ads won't solve this problem. You need positioning built on how people actually choose: status, identity, emotional clarity & trust.",
    },
  ],
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

// "Other" opens a required text field, saved as H2_other
export function industryQuestion(track) {
  const list = track === "leadgen" ? LEADGEN_INDUSTRIES : ECOM_INDUSTRIES;
  return {
    id: "H2",
    question: "What industry are you in?",
    options: list.map((label) =>
      label === "Other"
        ? { value: label, label, other: true }
        : { value: label, label },
    ),
    otherPlaceholder: "Type your industry",
    otherRequired: true,
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
    { value: "cpa", label: "Pay less to win each customer" },
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
      "If a customer compared you to your top 3 competitors, what would stand out about you first?",
    options: [
      o("Not sure, I haven't thought about it", 0),
      o(
        "Something clear that makes us different, that they'd tell a friend about",
        3,
      ),
      o("Our price", 1),
      o("Our reviews & reputation", 2),
    ],
  },
  {
    id: "LG2",
    pillar: "positioning",
    question: "How often do customers push back on your price?",
    options: [
      o("Rarely. They already expect to pay what we charge", 3),
      o("Most of the time", 0),
      o("Sometimes, usually with people who aren't a great fit", 2),
      o("Often enough that we drop our price to win the job", 1),
    ],
  },
  {
    id: "LG3",
    pillar: "positioning",
    question: "Who is your marketing written for?",
    options: [
      o("Anyone who might need us", 0),
      o(
        "One clear type of customer, and it talks about their specific problems",
        3,
      ),
      o("A couple of loose groups", 1),
      o("A clear type of customer, but it mostly talks about us", 2),
    ],
  },
  {
    id: "LG4",
    pillar: "offer",
    question:
      "When someone new finds you, what's the first thing you offer them?",
    options: [
      o("A “Contact us” form", 0),
      o("A free quote or consultation", 1),
      o(
        "A specific, named first step, like an audit or assessment, with a clear result",
        3,
      ),
      o("A free guide or download", 2),
    ],
  },
  {
    id: "LG5",
    pillar: "offer",
    question: "What do you do to make buying from you feel low-risk?",
    options: [
      o("Nothing specific", 0),
      o("Reviews, testimonials or case studies on the website", 1),
      o(
        "A guarantee, a clear process, and proof that speaks to each type of customer",
        3,
      ),
      o("A clear explanation of how it works & what to expect", 2),
    ],
  },
  {
    id: "LG6",
    pillar: "traffic",
    multi: true,
    question: "Where do your new leads come from?",
    options: [
      { label: "Google Ads", kind: "paid" },
      { label: "Microsoft Ads (Bing)", kind: "paid" },
      { label: "Facebook & Instagram ads", kind: "paid" },
      { label: "LinkedIn", kind: "both" },
      { label: "TikTok", kind: "paid" },
      { label: "YouTube", kind: "paid" },
      { label: "Showing up on Google (SEO)", kind: "organic" },
      { label: "Google Business Profile / Maps", kind: "organic" },
      {
        label: "AI search (ChatGPT, Google AI answers)",
        kind: "organic",
      },
      {
        label: "Directories & marketplaces (hipages, Oneflare, etc.)",
        kind: "paid",
      },
      { label: "Referrals & word of mouth", kind: "organic" },
      { label: "Email", kind: "organic" },
      { label: "Events & networking", kind: "organic" },
      // Counts towards the channel total but isn't paid or organic.
      // Opens an optional text field, saved as LG6_other
      { label: "Other", other: true },
    ],
    otherPlaceholder: "Other channels (optional)",
  },
  {
    id: "LG7",
    pillar: "traffic",
    question:
      "If your biggest source of leads stopped tomorrow, what would happen?",
    options: [
      o("We'd lose most of our leads", 0),
      o("We'd feel it, but other sources would carry us", 2),
      o("Barely a dent. No one source brings in more than 40% of our leads", 3),
      o("We'd lose about half", 1),
    ],
  },
  {
    id: "LG8",
    pillar: "traffic",
    question: "How often do you launch new ads?",
    options: [
      o("Every month", 3),
      o("We're not running ads right now", 0),
      o("Every 6 months or so", 1),
      o("When results start dropping", 2),
    ],
  },
  {
    id: "LG9",
    pillar: "conversion",
    question: "When people click your ads or social posts, where do they land?",
    options: [
      o("Our homepage", 0),
      o("A page built for that specific ad or audience", 3),
      o("The page for that service", 1),
      o("One landing page we use for all our ads", 2),
      o("Not sure", 0),
    ],
  },
  {
    id: "LG10",
    pillar: "conversion",
    question: "What does your enquiry form look like?",
    options: [
      o("Short, with a few questions that weed out the wrong people", 3),
      o("Long, we ask for all the details upfront", 2),
      o("Name, email, phone & message", 1),
      o("We don't really have one. People call or email", 0),
    ],
  },
  {
    id: "LG11",
    pillar: "conversion",
    question: "Do you know how many website visitors turn into enquiries?",
    options: [
      o("No idea", 0),
      o("Roughly", 1),
      o("Yes, more than 5 in every 100", 3),
      o("Yes, fewer than 5 in every 100", 2),
    ],
  },
  {
    id: "LG12",
    pillar: "tracking",
    question: "How do you know if your marketing is working?",
    options: [
      o("We track what it costs to win a good lead or a sale", 3),
      o("We track what it costs to get a lead", 2),
      o("Clicks, views or followers", 1),
      o("Gut feel", 0),
    ],
  },
  {
    id: "LG13",
    pillar: "tracking",
    question: "When you win a job, can you tell which ad it came from?",
    options: [
      o(
        "Yes, and we send that back to the ad platforms so they find more people like them",
        3,
      ),
      o(
        "Mostly, through our CRM or sales system, but it isn't linked to our ads",
        2,
      ),
      o("Only if we ask the customer how they found us", 1),
      o("No", 0),
    ],
  },
  {
    id: "LG14",
    pillar: "nurture",
    question: "How quickly does a new lead hear back from you?",
    options: [
      o("Within 15 minutes", 3),
      o("Within the hour", 2),
      o("Same day or next business day", 1),
      o("It depends who's around", 0),
    ],
  },
  {
    id: "LG15",
    pillar: "nurture",
    question: "What happens to someone who doesn't buy after the first call?",
    options: [
      o("We follow up a couple of times, then move on", 1),
      o(
        "We follow up, and they get automatic emails that keep them warm until they're ready",
        3,
      ),
      o("Nothing set up", 0),
      o("We keep track of them and follow up manually", 2),
    ],
  },
];

// ── Stage 2B: Ecom track ───────────────────────────────────────────────────

export const ECOM_QUESTIONS = [
  {
    id: "EC1",
    pillar: "positioning",
    question: "Why do your best customers buy from you and not the next store?",
    options: [
      o("Our brand. They connect with what we stand for", 3),
      o("Price or a sale", 0),
      o("The product itself, its quality or something unique about it", 2),
      o("Convenience. We were the first they found", 1),
    ],
  },
  {
    id: "EC2",
    pillar: "positioning",
    question: "How much do your sales rely on discounts?",
    options: [
      o("Most months, we need a sale to hit our numbers", 0),
      o(
        "We run a few planned sales, and full-price sales stay strong in between",
        3,
      ),
      o("We run a discount whenever things go quiet", 1),
      o("We rarely discount, but haven't tested whether we should", 2),
    ],
  },
  {
    id: "EC3",
    pillar: "positioning",
    question:
      "Could a stranger tell what makes your brand different within 5 seconds of landing on your homepage?",
    options: [
      o("Yes, straight away", 3),
      o("They'd know what we sell, but not why we're different", 1),
      o("Probably not", 0),
      o("Mostly, after a bit of scrolling", 2),
    ],
  },
  {
    id: "EC4",
    pillar: "offer",
    question:
      "Do you know how much profit you make on each order after product costs, shipping, fees & ads?",
    options: [
      o("Yes, for each product, and we use it to set our ad targets", 3),
      o("Roughly, across the whole store", 2),
      o(
        "We know our product margin, but not what's left after shipping, fees & ads",
        1,
      ),
      o("No", 0),
    ],
  },
  {
    id: "EC5",
    pillar: "offer",
    question: "How do you get customers to spend more per order?",
    options: [
      o("We don't really", 0),
      o("Free shipping over a certain amount", 1),
      o("Bundles, add-ons & free shipping, and we test them regularly", 3),
      o("Bundles or add-ons on some products", 2),
    ],
  },
  {
    id: "EC6",
    pillar: "traffic",
    multi: true,
    question: "Where do your sales come from?",
    options: [
      { label: "Facebook & Instagram ads", kind: "paid" },
      { label: "Google Shopping / Performance Max", kind: "paid" },
      { label: "Google Search ads", kind: "paid" },
      { label: "Microsoft Ads (Bing)", kind: "paid" },
      { label: "YouTube & Google display ads (Demand Gen)", kind: "paid" },
      { label: "TikTok", kind: "paid" },
      { label: "Showing up on Google (SEO)", kind: "organic" },
      { label: "AI search (ChatGPT, Google AI answers)", kind: "organic" },
      { label: "Email & SMS", kind: "organic", emailSms: true },
      { label: "Influencers & affiliates", kind: "paid" },
      { label: "Marketplaces (Amazon, eBay)", kind: "paid" },
      // Counts towards the channel total. Opens an optional text field, saved as EC6_other
      { label: "Other", other: true },
    ],
    otherPlaceholder: "Other channels (optional)",
  },
  {
    id: "EC7",
    pillar: "traffic",
    question: "How much of your sales come from your biggest ad platform?",
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
    question: "How many new ads do you try each month?",
    options: [
      o("Fewer than 3", 0),
      o("10 or more, based on what's working", 3),
      o("3 to 5", 1),
      o("6 to 9", 2),
    ],
  },
  {
    id: "EC9",
    pillar: "conversion",
    question: "Out of every 100 people who visit your store, how many buy?",
    options: [
      o("I don't know", 0),
      o("Less than 1", 1),
      o("1 to 2.5", 2),
      o("More than 2.5", 3),
    ],
  },
  {
    id: "EC10",
    pillar: "conversion",
    question: "How would you describe your product pages?",
    options: [
      o(
        "Great photos, reviews, clear benefits, and answers to common questions on every page",
        3,
      ),
      o("Supplier photos and a basic description", 0),
      o("Good photos and copy, but not many reviews", 2),
      o("They're fine, we haven't looked at them in a while", 1),
    ],
  },
  {
    id: "EC11",
    pillar: "conversion",
    question:
      "When did you last test a change on your website or checkout to see if it sold more?",
    options: [
      o("Never", 0),
      o("In the last month. We test changes all the time", 3),
      o("Over 6 months ago", 1),
      o("In the last 3 months", 2),
    ],
  },
  {
    id: "EC12",
    pillar: "tracking",
    question: "How do you know if your marketing is working?",
    options: [
      o("What Facebook or Google say our ads made", 1),
      o(
        "Total sales vs total ad spend across everything, and the profit left over",
        3,
      ),
      o("Our sales in Shopify", 2),
      o("Mostly gut feel", 0),
    ],
  },
  {
    id: "EC13",
    pillar: "tracking",
    question:
      "Can Facebook and Google still see your sales when people block cookies or tracking?",
    options: [
      o("Yes, it's fully set up and we check it regularly", 3),
      o("I'm not sure", 0),
      o(
        "Partly. The basic pixel is there, but the full setup isn't finished",
        1,
      ),
      o("Yes, but it was set up once and hasn't been checked since", 2),
    ],
  },
  {
    id: "EC14",
    pillar: "nurture",
    question: "Which automatic emails or texts do you have running?",
    options: [
      o(
        "Welcome, abandoned cart, browsed but didn't buy, after purchase & win-back, each tailored to the customer",
        3,
      ),
      o("Just a welcome email or abandoned cart", 1),
      o("None, we only send one-off emails", 0),
      o("Welcome & abandoned cart, plus one or two others", 2),
    ],
  },
  {
    id: "EC15",
    pillar: "nurture",
    question: "How much of your sales come from repeat customers?",
    options: [
      o("Under 15%", 1),
      o("Over 35%", 3),
      o("I don't know", 0),
      o("15 to 35%", 2),
    ],
  },
];

// ── Insight library ────────────────────────────────────────────────────────
// Email label and call opener per question. The opener is used when that
// question holds the lead's lowest-scoring answer.
export const QUESTION_META = {
  LG1: {
    label: "Next to competitors",
    opener:
      "You weren't sure what a prospect would notice first next to your competitors. If they had to pick between you and the next quote, what would tip them in your favour?",
  },
  LG2: {
    label: "Price pushback",
    opener:
      "You mentioned price comes up on most deals. What do you think happens in the buyer's head right before that objection?",
  },
  LG3: {
    label: "Marketing written for",
    opener:
      "Who's the client you'd clone if you could? Does your website talk to them specifically?",
  },
  LG4: {
    label: "First offer to cold prospects",
    opener:
      "When someone lands on your site cold, what's the first thing you offer?",
  },
  LG5: {
    label: "Making it low-risk to buy",
    opener:
      "What's the biggest fear a new client has before they sign with you?",
  },
  LG6: {
    label: "Lead channels",
    opener:
      "Most of your leads come from one or two places. How long have you relied on that mix?",
  },
  LG7: {
    label: "If main source switched off",
    opener:
      "You said losing your main lead source would wipe out most of your pipeline. Where do most of your leads come from right now?",
  },
  LG8: {
    label: "New creative cadence",
    opener: "When did you last launch a new angle in your ads?",
  },
  LG9: {
    label: "Where traffic lands",
    opener:
      "Your ads point to the homepage. What do you want someone to do in the first 10 seconds there?",
  },
  LG10: {
    label: "Enquiry form",
    opener:
      "How do people get in touch now, and how many of those enquiries turn out to be a good fit?",
  },
  LG11: {
    label: "Landing page CVR",
    opener:
      "You weren't sure of your conversion rate. Out of every 100 people who land on the site, how many do you think enquire?",
  },
  LG12: {
    label: "Success metric",
    opener: "How do you decide whether a month of marketing was a good month?",
  },
  LG13: {
    label: "Deal-to-ad attribution",
    opener:
      "When a big job closes, can you tell which ad or campaign it came from?",
  },
  LG14: {
    label: "Speed to lead",
    opener: "Walk me through what happens the minute a new enquiry comes in.",
  },
  LG15: {
    label: "Follow-up after first call",
    opener: "What happens to the people who say 'not right now'?",
  },
  EC1: {
    label: "Why customers buy",
    opener:
      "You said customers mostly buy on price or promotion. What happens to sales the week after a sale ends?",
  },
  EC2: {
    label: "Discount dependence",
    opener:
      "How many months last year did you hit target without a promo running?",
  },
  EC3: {
    label: "Homepage clarity",
    opener:
      "If someone landed on your homepage from a cold ad, what would you want them to feel in the first 5 seconds?",
  },
  EC4: {
    label: "Contribution margin",
    opener: "Do you know the ROAS you need just to break even on an order?",
  },
  EC5: {
    label: "AOV tactics",
    opener:
      "What's your average order value, and what's stopped you pushing it up?",
  },
  EC6: {
    label: "Sales channels",
    opener:
      "Most of your revenue runs through one or two channels. What happened the last time one of them had a bad month?",
  },
  EC7: {
    label: "Biggest paid channel share",
    opener:
      "Over 70% of revenue comes from one channel. How did the last big Meta or Google change hit you?",
  },
  EC8: {
    label: "Creatives tested per month",
    opener: "How many new creatives went live last month, and who briefs them?",
  },
  EC9: {
    label: "Store CVR",
    opener:
      "You weren't sure of your conversion rate. Out of 100 visitors, how many do you think buy?",
  },
  EC10: {
    label: "Product pages",
    opener:
      "When did you last look at your best-selling product page as if you were a new customer?",
  },
  EC11: {
    label: "Last site test",
    opener:
      "What's the last thing you changed on the site, and did you measure what it did?",
  },
  EC12: {
    label: "Success metric",
    opener:
      "How closely does the ROAS in your ad accounts match the revenue in Shopify?",
  },
  EC13: {
    label: "Server-side tracking",
    opener:
      "You weren't sure if your tracking is server-side. Who set it up, and when did someone last check it?",
  },
  EC14: {
    label: "Email & SMS flows",
    opener: "What happens to someone who adds to cart and doesn't check out?",
  },
  EC15: {
    label: "Returning customer revenue",
    opener: "What does a customer do after their first order with you?",
  },
};

// Typed "Other" channels (LG6_other / EC6_other) and industry (H2_other),
// trimmed to this length
export const OTHER_MAX_LENGTH = 50;

// Lines for every answer worth 0 or 1 point. Keys match the library: question
// ID + option letter (A = first option). Multi-select channel questions are
// keyed by points instead (LG6_0 = 0 to 1 channels, LG6_1 = 2 channels).
// read goes in the internal lead email; told and why go on the results page.
const ins = (read, told, why) => ({ read, told, why });

export const INSIGHTS = {
  LG1_A: ins(
    "Has never defined their difference. Almost certainly being compared on price.",
    "You're not sure what sets you apart from your competitors.",
    "If you can't name the difference, buyers can't either, so they compare on price.",
  ),
  LG1_C: ins(
    "Competing on price is their positioning. Margin is under constant pressure.",
    "Price is what sets you apart.",
    "Whoever competes on price can always be undercut, and the buyers it attracts leave for the next discount.",
  ),
  LG2_B: ins(
    "Price objections on most deals. Value isn't established before the call.",
    "Prospects push back on price on most deals.",
    "Price objections mean value wasn't built before the conversation started. By then you're negotiating.",
  ),
  LG2_D: ins(
    "Discounting to close. Margin leaks on every deal and trains buyers to ask.",
    "You often discount to close.",
    "Every discount comes straight off profit and teaches the next buyer to ask for one.",
  ),
  LG3_A: ins(
    "No defined ICP. Messaging is generic and lands with no one in particular.",
    "Your marketing speaks to anyone who might need you.",
    "Messaging written for everyone feels written for no one. The right buyers don't see themselves in it.",
  ),
  LG3_C: ins(
    "Some targeting, but not sharp enough to make the right buyer feel understood.",
    "You target a couple of loose segments.",
    "Loose targeting means loose messaging. Your best-fit clients don't feel it was written for them.",
  ),
  LG4_A: ins(
    "No front-end offer. Asking cold traffic for a sales conversation straight away.",
    "A “contact us” form is the first step you offer.",
    "Cold prospects aren't ready to talk to sales. Without a low-risk first step, most of your traffic leaves without raising its hand.",
  ),
  LG4_B: ins(
    "Commodity offer. Puts them straight into price comparison.",
    "A free quote or consultation is your first offer.",
    "A free quote invites comparison shopping. It positions you as one of several options before you've shown why you're different.",
  ),
  LG5_A: ins(
    "No risk reversal. Buyers carry all the risk of saying yes.",
    "You don't do anything specific to make buying from you feel low-risk.",
    "Buyers hesitate when the risk sits with them. If you don't remove it, they delay, or they choose someone who does.",
  ),
  LG5_B: ins(
    "Generic social proof, not matched to the buyer's specific doubts.",
    "You rely on reviews, testimonials or case studies on the website.",
    "Generic proof gets skimmed. Proof that answers a buyer's specific doubt is what moves them to act.",
  ),
  LG6_0: ins(
    "One channel. Fully exposed to platform changes and rising costs.",
    "Your leads come from one channel.",
    "One channel means one point of failure. When costs rise or the algorithm shifts, your pipeline shifts with it.",
  ),
  LG6_1: ins(
    "Thin channel mix, likely all bottom of funnel.",
    "Your leads come from two channels.",
    "Two channels is still thin. Most businesses at this stage are fishing in the same small pond as their competitors.",
  ),
  LG7_A: ins(
    "Single point of failure. One platform change and the pipeline stops.",
    "Losing your main lead source would wipe out most of your pipeline.",
    "One algorithm update, policy change or price rise and your pipeline goes with it.",
  ),
  LG7_D: ins(
    "Heavy concentration. A bad quarter on one platform halves the pipeline.",
    "Losing your main lead source would cost you about half your leads.",
    "Half your pipeline depends on one platform you don't control.",
  ),
  LG8_B: ins(
    "No paid acquisition. Growth is capped by referrals and organic.",
    "You're not running ads right now.",
    "Without paid reach, growth depends on who already knows you. That caps how fast you can grow.",
  ),
  LG8_C: ins(
    "Stale creative. Ad fatigue is pushing lead costs up.",
    "You launch new ad creative every 6 months.",
    "Ads wear out in weeks. Running the same creative for six months means paying more for every lead as it fatigues.",
  ),
  LG9_A: ins(
    "Paid traffic to the homepage. Message match broken, conversion suffers.",
    "Your ads send people to your homepage.",
    "A homepage tries to speak to everyone. Paid traffic needs a page that continues the exact conversation the ad started.",
  ),
  LG9_C: ins(
    "Relevant, but not built to convert campaign traffic.",
    "Your ads send people to a service page.",
    "Service pages inform. They're rarely built to turn a click into an enquiry.",
  ),
  LG9_E: ins(
    "Doesn't know where ad traffic lands. Nobody owns what happens after the click.",
    "You're not sure where your paid and social traffic lands.",
    "If you don't know where people land, you can't tell whether the ad or the page is losing them.",
  ),
  LG10_D: ins(
    "No capture mechanism. Leads get lost and can't be tracked.",
    "You don't really have an enquiry form, and people call or email.",
    "Without a form, you can't capture, track or qualify leads. Some of them simply get lost.",
  ),
  LG10_C: ins(
    "Generic form with no qualifying questions. Poor-fit leads get through, and good ones aren't prioritised.",
    "Your enquiry form asks for name, email, phone and message.",
    "A generic form can't separate a high-value client from a tyre-kicker, so your team spends time on the wrong leads.",
  ),
  LG11_A: ins(
    "Doesn't know CVR. No way to judge whether the pages or the ads are the problem.",
    "You don't know how many website visitors turn into enquiries.",
    "Without it, you can't tell whether your ads or your pages are the problem, so you can't fix either.",
  ),
  LG11_B: ins(
    "Rough idea only. Decisions are based on feel.",
    "You roughly know your conversion rate.",
    "A rough number hides small drops that add up to a lot of lost enquiries.",
  ),
  LG12_D: ins(
    "Judging marketing by feel. No feedback loop.",
    "You judge marketing by gut feel.",
    "Feeling busy and being profitable are different things. Without a number, you can't tell which spend is working.",
  ),
  LG12_C: ins(
    "Tracking vanity metrics. Optimising for attention over revenue.",
    "You judge marketing on clicks, impressions or followers.",
    "Clicks don't pay the bills. Optimise for them and you'll get more clicks with no extra clients.",
  ),
  LG13_D: ins(
    "No closed-loop attribution. Ad platforms optimise for any lead, good or bad.",
    "You can't tell which ad a won job came from.",
    "If the platforms only see form fills, they'll keep finding people who fill in forms and never buy.",
  ),
  LG13_C: ins(
    "Self-reported attribution. Unreliable, and nothing feeds back to the ads.",
    "You only know where clients came from if you ask them.",
    "People misremember how they found you, and none of it reaches the ad platforms to improve targeting.",
  ),
  LG14_D: ins(
    "No response process. Leads go cold before anyone calls.",
    "How fast a new lead hears from you depends on who's around.",
    "Leads contact several businesses at once. The first to respond usually wins the work.",
  ),
  LG14_C: ins(
    "Slow response. Competitors are calling first.",
    "New leads hear from you the same or next business day.",
    "By the next day, most leads have already spoken to someone else.",
  ),
  LG15_C: ins(
    "No nurture. Every lead that isn't ready today is lost.",
    "Nothing structured happens to leads who don't buy the first time.",
    "Most buyers aren't ready on first contact. Without follow-up, you hand them to whoever stays in touch.",
  ),
  LG15_A: ins(
    "Gives up too early. Most sales need more touchpoints than this.",
    "You follow up a couple of times, then move on.",
    "Most buyers need more touchpoints than that. Stopping at two leaves the sale to the next business that calls.",
  ),
  EC1_B: ins(
    "Customers are buying the deal. No brand loyalty, price-led growth.",
    "Your best customers buy on price or promotion.",
    "Customers who come for the price leave for a better one. You have to pay to win them back every time.",
  ),
  EC1_D: ins(
    "Winning by showing up first in the feed or search. Easily displaced.",
    "Customers buy mostly for convenience, because you showed up first.",
    "Showing up first can be bought by any competitor with a bigger budget.",
  ),
  EC2_A: ins(
    "Discount-dependent. Margin eroding, customers trained to wait for sales.",
    "Most months you need a promo to hit target.",
    "Constant promos train customers to wait for the next sale and shrink the margin on every order.",
  ),
  EC2_C: ins(
    "Discounts used as a panic button. No margin plan for sale events.",
    "You discount reactively when things go quiet.",
    "Reactive discounts cut margin without a plan, and customers learn that quiet periods mean cheaper prices.",
  ),
  EC3_C: ins(
    "Brand isn't landing. Cold traffic bounces before the story is told.",
    "A stranger probably couldn't tell what your brand stands for from your homepage.",
    "Cold visitors decide in seconds. If they can't see why you're different, they go back to scrolling.",
  ),
  EC3_B: ins(
    "Product is clear, difference isn't. Reads like a commodity store.",
    "Visitors would know what you sell but not why you're different.",
    "Knowing what you sell gives no reason to buy from you. Without a reason, buyers compare on price.",
  ),
  EC4_D: ins(
    "No grasp of unit economics. Could be scaling at a loss.",
    "You don't know how much profit you make on each order.",
    "Without it, you can't set an ad target that makes money. You could be growing revenue and losing profit.",
  ),
  EC4_C: ins(
    "Knows gross margin only. Break-even ROAS probably set too low.",
    "You know your product margin, but not what's left after shipping, fees and ads.",
    "Gross margin ignores shipping, fees, returns and ad spend. The real profit per order is usually far lower than it looks.",
  ),
  EC5_A: ins(
    "No AOV strategy. Paying full acquisition cost for single-item orders.",
    "You don't actively work on getting customers to spend more per order.",
    "Every order costs the same to acquire. Bigger baskets are the cheapest way to make ad spend pay back.",
  ),
  EC5_B: ins(
    "One basic lever. Bundles and upsells untested.",
    "Free shipping is your main lever for order value.",
    "Free shipping helps, but bundles and upsells usually move order value much further.",
  ),
  EC6_0: ins(
    "One channel. Fully exposed to platform changes and CPM rises.",
    "Your sales come from one channel.",
    "One channel means one point of failure. When costs rise or the algorithm shifts, your revenue shifts with it.",
  ),
  EC6_1: ins(
    "Thin mix, probably no owned channel like email.",
    "Your sales come from two channels.",
    "Two channels is still exposed, especially without email and SMS, the channels you own outright.",
  ),
  EC7_A: ins(
    "Extreme concentration. One platform controls the business.",
    "Over 70% of revenue comes from one paid channel.",
    "One platform you don't control decides how good your month is.",
  ),
  EC7_C: ins(
    "Heavy concentration. A bad month on one platform hurts badly.",
    "Over half your revenue comes from one paid channel.",
    "When that channel has a bad month, so does your business.",
  ),
  EC8_A: ins(
    "Creative starved. Ad fatigue is driving costs up.",
    "You test fewer than 3 new creatives a month.",
    "Creative is the main lever left in paid social. Fewer than 3 a month means costs rise as ads wear out.",
  ),
  EC8_C: ins(
    "Under-testing. Not enough volume to find winners.",
    "You test 3 to 5 new creatives a month.",
    "Most creatives don't win. At this volume, you're not testing enough to find the ones that do.",
  ),
  EC9_A: ins(
    "Doesn't know CVR. Can't tell if the site or the ads are the problem.",
    "You don't know your store's conversion rate.",
    "Without it, you can't tell whether your ads or your site are losing sales, so you can't fix either.",
  ),
  EC9_B: ins(
    "Low CVR. The site is wasting most of the ad spend that reaches it.",
    "Your store converts under 1% of visitors.",
    "At under 1%, most of the traffic you pay for leaves without buying. Small lifts here are worth more than more traffic.",
  ),
  EC10_B: ins(
    "Commodity product pages. Nothing to justify the price.",
    "Your product pages use supplier photos and a basic description.",
    "If your page looks like every other seller's, the buyer chooses the cheapest one.",
  ),
  EC10_D: ins(
    "Neglected product pages. Probably missing proof and objection handling.",
    "Your product pages are fine but haven't been reviewed in a while.",
    "Product pages are where the buying decision happens. Unanswered doubts there become abandoned carts.",
  ),
  EC11_A: ins(
    "No CRO. Every site decision is a guess.",
    "You've never tested anything on your site or checkout.",
    "Every untested element is a guess, and some of those guesses are costing you sales right now.",
  ),
  EC11_C: ins(
    "CRO stalled. Site performance drifting.",
    "It's been over 6 months since you tested anything on the site.",
    "Customer behaviour and traffic change constantly. A site that isn't tested slowly falls behind.",
  ),
  EC12_D: ins(
    "No measurement framework. Spend decisions are guesses.",
    "You mostly judge marketing by gut feel.",
    "Without a number, you can't tell which spend is making money and which is losing it.",
  ),
  EC12_A: ins(
    "Trusting platform-reported ROAS. Likely over-counted.",
    "You judge marketing on what Facebook or Google say your ads made.",
    "Every platform takes credit for the same sale. Added together, they often claim more revenue than you actually made.",
  ),
  EC13_B: ins(
    "Unknown tracking setup. Platforms are probably missing conversions.",
    "You're not sure whether Facebook and Google can see your sales when people block tracking.",
    "Browser tracking misses a large share of conversions. If the platforms can't see sales, they can't find more buyers like them.",
  ),
  EC13_C: ins(
    "Incomplete server-side setup. Data gaps are hurting optimisation.",
    "Your tracking is only partly set up.",
    "Gaps in tracking mean the platforms optimise on incomplete data, so they find fewer of the right buyers.",
  ),
  EC14_C: ins(
    "No automation. Leaving the easiest revenue on the table.",
    "You don't have any automatic emails running, only one-off sends.",
    "Abandoned cart and welcome flows are the cheapest sales you'll ever make, and right now none of them are running.",
  ),
  EC14_B: ins(
    "Minimal flows. Post-purchase and win-back missing.",
    "You only run a welcome email or abandoned cart flow.",
    "Most repeat revenue comes from post-purchase and win-back flows, and those aren't running yet.",
  ),
  EC15_C: ins(
    "Doesn't track retention. LTV unknown, so CAC targets are guesses.",
    "You don't know how much revenue comes from returning customers.",
    "Without knowing lifetime value, you can't know how much you can afford to pay for a new customer.",
  ),
  EC15_A: ins(
    "Retention problem. Nearly every sale carries full acquisition cost.",
    "Under 15% of revenue comes from returning customers.",
    "You're paying full price to acquire almost every sale. The margin sits in the second and third order.",
  ),
};

export function insightFor(question, answer, points) {
  if (points > 1) return null;
  const key = question.multi
    ? `${question.id}_${points}`
    : `${question.id}_${String.fromCharCode(65 + answer)}`;
  return INSIGHTS[key] || null;
}

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
    question: "What's made you look at your marketing now?",
    options: [
      o("Results have dropped or stalled", 15),
      o("We're planning a growth push or launch", 10),
      o("Budget or planning season is coming up", 10),
      o("Just curious", 0),
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

// Any other role gets "Not the decision-maker" in the internal lead email
export const DECISION_MAKER_ROLES = [
  "Founder / owner / CEO",
  "Marketing lead / CMO",
];

// ── Stage 4: Gate ──────────────────────────────────────────────────────────

export const GATE = {
  headline: "Your Growth Leak report is ready.",
  subhead:
    "We've scored you across six pillars and found where your marketing is leaking. Where should we send it?",
  button: "Show my results",
  // Both unticked by default. Only marketingOptin adds people to nurture.
  checkboxes: [
    {
      key: "marketingOptin",
      label:
        "Send me industry insights & unique strategies I won't find online.",
    },
    {
      key: "wantsCall",
      label: "I'd like a strategy session to review my results.",
    },
  ],
  microcopy:
    "Your results appear on the next screen & a copy goes to your inbox. We'll never share your details.",
};

// ── Stage 5: Results ───────────────────────────────────────────────────────

export const TIERS = [
  {
    min: 0,
    name: "Invisible",
    color: "var(--mesm-red)",
    bullets: [
      "Buyers can't see why you're different.",
      "Spend is leaking before it reaches anyone ready to buy.",
      "The upside: fixes here pay back fast.",
    ],
  },
  {
    min: 40,
    name: "Commodity",
    color: "var(--mesm-yellow)",
    bullets: [
      "You're generating demand, then losing it to whoever's cheapest.",
      "Your audience can't tell you apart, so it defaults to price.",
    ],
  },
  {
    min: 60,
    name: "Contender",
    color: "#86ef7d",
    bullets: [
      "The foundations work.",
      "Two or three specific gaps are capping your growth.",
    ],
  },
  {
    min: 80,
    name: "Category of One",
    color: "var(--accent)",
    bullets: [
      "Buyers come to you already sold.",
      "You're in the top tier of businesses we audit.",
      "Your job now is carving out a larger moat.",
    ],
  },
];

const LEAKS = {
  positioning: {
    headline: "You look like everyone else",
    cost: "When buyers can't see a difference, they compare on price. Every ad dollar works harder to win a sale that should already be yours.",
    firstFix:
      "Write down the one thing you do that your top 3 competitors can't claim, then put it in your headline, ads and first call.",
    working:
      "Your positioning is clear. Buyers can see why you're different, which keeps your brand elevated.",
  },
  offer: {
    headline: "Your offer asks too much, too soon",
    cost: "Cold prospects won't jump straight to “talk to sales” or “buy now”. Without a low-risk first step, you're paying for clicks that were never going to convert.",
    firstFix:
      "Create one low-risk first step (a short audit, assessment or session) with a named outcome, and lead every campaign with it.",
    working:
      "Your offer gives buyers a clear, low-risk reason to take the next step.",
  },
  offerEcom: {
    headline: "You don't know what a sale is worth",
    cost: "Without contribution margin, you can't set a ROAS target that makes money. You could be scaling at a loss and calling it growth.",
    firstFix:
      "Calculate contribution margin per order for your top 5 products, then set your break-even ROAS from it.",
    working:
      "Your offer gives buyers a clear, low-risk reason to take the next step.",
  },
  traffic: {
    headline: "One channel is holding up the business",
    cost: "One algorithm update, one policy change or one price rise away from a bad quarter. Concentration risk is still risk.",
    firstFix:
      "Add one channel that reaches people before they search, so a single platform never controls your pipeline.",
    working:
      "You're not dependent on one channel. A bad month on one platform won't sink the business.",
  },
  conversion: {
    headline: "Your traffic arrives and leaves",
    cost: "You're paying to bring people in, then sending them somewhere that doesn't finish the job. Fixing conversion is the cheapest growth you'll ever buy.",
    firstFix:
      "Send every campaign to its own landing page that continues the ad's message, with a short qualifying form.",
    working:
      "Your site turns visitors into enquiries or sales. Every dollar of traffic works harder because of it.",
  },
  tracking: {
    headline: "You're optimising blind",
    cost: "The ad platforms are optimising for whatever you feed them. Feed them the wrong signal and they'll find you more of the wrong customer.",
    firstFix:
      "Connect closed deals in your CRM back to the ad platforms so they learn which leads turn into clients.",
    working:
      "You know what's working. Your spend decisions are based on real numbers.",
  },
  nurture: {
    headline: "Leads are going cold in your inbox",
    cost: "Most leads don't buy on first contact. Slow responses and no follow-up hand them to the competitor who answered first.",
    firstFix:
      "Respond to every new lead within 15 minutes, and put anyone who doesn't buy into an automated follow-up sequence.",
    working:
      "You stay in touch after first contact, so fewer leads and customers slip away.",
  },
  retention: {
    headline: "You're paying to acquire the same customer twice",
    cost: "Without flows and a retention program, every sale starts from zero. Your margin sits in the second order.",
    firstFix:
      "Launch abandoned cart, post-purchase and win-back flows, starting with abandoned cart.",
    working:
      "You stay in touch after first contact, so fewer leads and customers slip away.",
  },
};

// Score range label for each tier, e.g. "40 to 59"
export function tierRange(tier) {
  const i = TIERS.indexOf(tier);
  const max = i < TIERS.length - 1 ? TIERS[i + 1].min - 1 : 100;
  return `${tier.min} to ${max}`;
}

// First fix for ecom (and "both") where the leak entry is shared with lead gen
const ECOM_FIXES = {
  positioning:
    "Write down why your best customers chose you, in their words (look at your testimonials), and make that the first thing a new visitor reads.",
  traffic:
    "Get email and SMS working as a revenue channel, then add a second paid channel so one platform never controls your month.",
  conversion:
    "Rebuild your top product page with reviews, clear benefits and answers to the three questions customers ask most.",
  tracking:
    "Compare blended MER (total revenue ÷ total ad spend) against platform ROAS, then finish your server-side tracking.",
};

export function leakFor(pillar, track) {
  const isEcom = track !== "leadgen";
  if (pillar === "offer" && isEcom) return LEAKS.offerEcom;
  if (pillar === "nurture" && isEcom) return LEAKS.retention;
  if (isEcom && ECOM_FIXES[pillar]) {
    return { ...LEAKS[pillar], firstFix: ECOM_FIXES[pillar] };
  }
  return LEAKS[pillar];
}

// Pillar status on the results page
export const PILLAR_STATUS = [
  { min: 0, name: "Leaking", color: "var(--mesm-red)" },
  { min: 60, name: "OK", color: "var(--mesm-yellow)" },
  { min: 80, name: "Strong", color: "#86ef7d" },
];

export function pillarStatus(score) {
  return [...PILLAR_STATUS].reverse().find((s) => score >= s.min);
}

export const CTA = {
  // Two-column CTA at the base of the results page; the button opens a short form
  call: {
    eyebrow: "Next steps",
    headline: "Want help to plug these leaks?",
    body: [
      "Book a free 30-minute Growth Leak Review. I will go through your results, look at your website & acquisition strategy, and I'll show you the first three fixes that will move the needle.",
      "No pressure. You'll leave with a clear plan and confidence in your next steps.",
    ],
    button: "Book my review",
    microcopy: "Free · 30 minutes · No obligation",
    // Pinned to the bottom of the results page until the CTA scrolls into view
    floatingButton: "Book my strategy session",
    image:
      "https://cdn.sanity.io/images/wpr5jlmc/production/88f1166772a3d1184533e298e8be8391e37d2afb-4000x4000.jpg",
    caption: "Petar Petrovic - Founder",
    // Expands inline under the copy; name, email & company pre-fill from the gate
    form: {
      // Replace the headline & body once the form is open
      headline: "Let's fix your leaks and unlock deep scale",
      ticks: [
        "Your results, explained",
        "Your site & ads, reviewed",
        "Clarity & confidence in your strategy",
      ],
      heading: "Book your Growth Leak Review",
      bestTimeLabel: "Best time to reach you",
      bestTimes: ["Morning", "Afternoon", "Either"],
      messagePlaceholder: "Anything we should know before the call? (optional)",
      submit: "Book my review",
      microcopy: "We'll be in touch within one business day to lock in a time.",
    },
    // Replaces the right column once the form is sent
    thanks: {
      headline: (firstName) =>
        firstName ? `You're booked in, ${firstName}` : "You're booked in",
      body: "We're already reviewing your results. Expect a call or email from us within one business day to confirm a time.",
    },
  },
  resource: {
    headline: "Start with your biggest leak",
    body: [
      "We've sent you a step-by-step guide to fixing your lowest-scoring pillar. More playbooks are on the way.",
    ],
    button: "Get the guide",
  },
};

// How long results links work: the prospect's share link, and ours in the lead email
export const SHARE_LINK_DAYS = 30;
export const INTERNAL_LINK_DAYS = 90;

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_QUIZ_BOOKING_URL || "/connect";
export const GUIDE_URL =
  process.env.NEXT_PUBLIC_QUIZ_GUIDE_URL || "/cro-checklist";
