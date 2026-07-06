export type SegmentId = "medical" | "power" | "petrochemical" | "finance" | "insurance" | "technology";

export type EventItem = {
  id: string;
  name: string;
  segment: SegmentId;
  segmentLabel: string;
  tier: "Major" | "Minor";
  city: string;
  venue: string;
  dates: string;
  audience: string;
  why: string;
  source: string;
  image: string;
  plays: string[];
  sponsorPriority?: number;
  sponsorLabel?: string;
};

export type CityGuide = {
  city: string;
  positioning: string;
  image?: string;
  tone?: string;
  businessEnergy?: string;
  neighborhoods: string[];
  picks: Array<{ name: string; type: string; note: string }>;
  activities: Array<{ name: string; type: string; note: string }>;
};

export type Destination = {
  city: string;
  country: string;
  slug: string;
  mood: string;
  visualTone: string;
  whyGo: string;
  hostingStyle: string;
  signatureMove: string;
};

export const segments = [
  { id: "all", label: "All segments" },
  { id: "medical", label: "Medical" },
  { id: "power", label: "Power" },
  { id: "petrochemical", label: "Petrochemical" },
  { id: "finance", label: "Finance" },
  { id: "insurance", label: "Business Insurance" },
  { id: "technology", label: "Technology" }
] as const;

export const sectorProfiles: Record<SegmentId, {
  buyer: string;
  goFor: string[];
  avoidIf: string;
  sponsorship: string;
}> = {
  finance: {
    avoidIf: "You are not ready to explain compliance, integration, risk, and economics quickly.",
    buyer: "Banks, payment networks, fintechs, capital markets, compliance teams, and investors",
    goFor: ["Partnership development", "Investor meetings", "Enterprise sales", "Product scouting"],
    sponsorship: "$20k-$250k+ for brand presence, meetings, and sponsored content"
  },
  insurance: {
    avoidIf: "Your pitch is not mapped to lines of business, loss ratio, claims, or distribution outcomes.",
    buyer: "Carriers, brokers, MGAs, reinsurers, claims leaders, underwriting, and insurtech investors",
    goFor: ["Carrier-broker meetings", "Claims demos", "Distribution partnerships", "Investor coverage"],
    sponsorship: "$15k-$175k+ for booths, demo suites, receptions, and newsletter inventory"
  },
  medical: {
    avoidIf: "You do not have a clear provider, payer, device, or investor target list.",
    buyer: "Health systems, payers, pharma, device, and health technology buyers",
    goFor: ["Enterprise buyer meetings", "Investor coverage", "Product launches", "Partnership dinners"],
    sponsorship: "$25k-$250k+ depending on booth, reception, and speaking package"
  },
  petrochemical: {
    avoidIf: "You cannot support a long-cycle, relationship-heavy sales motion.",
    buyer: "Energy majors, NOCs, chemical producers, traders, logistics, and infrastructure teams",
    goFor: ["Executive relationship building", "Market intelligence", "Regional partner dinners", "Commercial negotiations"],
    sponsorship: "$20k-$300k+ for global sponsorship, hospitality, and meeting suites"
  },
  power: {
    avoidIf: "Your offer is not tied to generation, grid, storage, reliability, or project delivery.",
    buyer: "Utilities, IPPs, developers, grid operators, EPCs, and OEMs",
    goFor: ["Utility account coverage", "Fleet owner meetings", "Grid technology demos", "Technical buyer access"],
    sponsorship: "$15k-$180k+ depending on expo footprint and hosted events"
  },
  technology: {
    avoidIf: "You cannot cut through heavy sponsor noise with a specific account plan.",
    buyer: "Enterprise IT, cloud, AI, cybersecurity, data, software partners, and developers",
    goFor: ["Account-based dinners", "Cloud and AI launches", "Partner ecosystem coverage", "Executive demos"],
    sponsorship: "$30k-$500k+ at major platform events"
  }
};

export const costProfiles: Record<string, { hotel: string; dinner: string; room: string; pressure: string }> = {
  "Abu Dhabi": { dinner: "$180-$380/person", hotel: "$240-$700/night", pressure: "Very high during global energy weeks", room: "$3k-$25k" },
  Atlanta: { dinner: "$140-$300/person", hotel: "$180-$450/night", pressure: "High when downtown and Buckhead demand collide", room: "$1.5k-$10k" },
  Bangkok: { dinner: "$100-$250/person", hotel: "$140-$420/night", pressure: "High near BITEC and premium hotel districts", room: "$1k-$9k" },
  Chicago: { dinner: "$150-$300/person", hotel: "$180-$480/night", pressure: "High around McCormick Place anchor weeks", room: "$1.5k-$10k" },
  Houston: { dinner: "$140-$280/person", hotel: "$160-$420/night", pressure: "Moderate to high for energy and medical weeks", room: "$1k-$8k" },
  "Las Vegas": { dinner: "$175-$350/person", hotel: "$220-$650/night", pressure: "Very high during mega-conference overlap", room: "$2k-$15k" },
  London: { dinner: "$170-$420/person", hotel: "$260-$850/night", pressure: "Very high around Olympia, ExCeL, Mayfair, and City finance weeks", room: "$2k-$22k" },
  Miami: { dinner: "$180-$400/person", hotel: "$260-$750/night", pressure: "Very high in Miami Beach and Brickell", room: "$2k-$18k" },
  "New York": { dinner: "$175-$450/person", hotel: "$280-$800/night", pressure: "Always high for premium Midtown and Hudson Yards rooms", room: "$2k-$20k" },
  Honolulu: { dinner: "$150-$360/person", hotel: "$280-$850/night", pressure: "High for resort blocks, telecom weeks, incentives, and premium oceanfront rooms", room: "$2k-$18k" },
  "Hawaii Island": { dinner: "$140-$330/person", hotel: "$260-$780/night", pressure: "High when resort conferences compress demand near Waikoloa", room: "$1.5k-$14k" },
  Paris: { dinner: "$180-$450/person", hotel: "$260-$900/night", pressure: "Very high during innovation, aerospace, luxury, and citywide event weeks", room: "$2k-$24k" },
  "Salt Lake City": { dinner: "$125-$250/person", hotel: "$170-$430/night", pressure: "Moderate, with premium pressure near convention hotels", room: "$1k-$7k" },
  Tokyo: { dinner: "$140-$360/person", hotel: "$200-$720/night", pressure: "High near Makuhari, Marunouchi, Ginza, and premium international hotel corridors", room: "$1.5k-$18k" }
};

export const events: EventItem[] = [
  {
    audience: "Global technology buyers, Fortune 500 innovation teams, media, investors, startups, consumer electronics, mobility, AI",
    city: "Las Vegas",
    dates: "January 6-9, 2027",
    id: "ces-2027",
    image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1400&q=82",
    name: "CES 2027",
    plays: ["Stack executive demos by hotel tower", "Use dinner suites for partner launches", "Host late-night client tables after show-floor fatigue"],
    segment: "technology",
    segmentLabel: "Technology",
    source: "https://www.ces.tech/",
    sponsorLabel: "Featured sponsor slot",
    sponsorPriority: 100,
    tier: "Major",
    venue: "Las Vegas, NV",
    why: "One of the world’s largest technology stages, where product launches, enterprise scouting, media, investors, and global buyers converge."
  },
  {
    audience: "Health systems, payers, digital health, pharma, investors, employers",
    city: "Las Vegas",
    dates: "November 15-18, 2026",
    id: "hlth-2026",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=82",
    name: "HLTH 2026",
    plays: ["Host payer-provider dinners early in the week", "Reserve private rooms near the Strip", "Use breakfast meetings for investor and partner coverage"],
    segment: "medical",
    segmentLabel: "Medical",
    source: "https://www.hlth.com/",
    sponsorLabel: "Healthcare sponsor slot",
    sponsorPriority: 86,
    tier: "Major",
    venue: "The Venetian Expo",
    why: "A high-density healthcare dealmaking week for digital health, payer strategy, care delivery, and health tech partnerships."
  },
  {
    audience: "Radiology, imaging, AI diagnostics, medical device, hospital buyers",
    city: "Chicago",
    dates: "November 29-December 3, 2026",
    id: "rsna-2026",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=82",
    name: "RSNA 2026",
    plays: ["Book steakhouse rooms two to three months ahead", "Use hotel lounges for quick demos", "Plan small specialist dinners by modality"],
    segment: "medical",
    segmentLabel: "Medical",
    source: "https://www.rsna.org/annual-meeting",
    tier: "Major",
    venue: "McCormick Place",
    why: "The anchor radiology and imaging event, with strong equipment, AI, workflow, and hospital procurement relevance."
  },
  {
    audience: "Solar, storage, grid tech, developers, financiers, EPCs, utilities",
    city: "Las Vegas",
    dates: "November 16-19, 2026",
    id: "replus-2026",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=82",
    name: "RE+ 2026",
    plays: ["Host project finance dinners by geography", "Reserve private rooms near convention hotels", "Use breakfast slots for utility meetings"],
    segment: "power",
    segmentLabel: "Power",
    source: "https://www.re-plus.com/",
    sponsorLabel: "Energy sponsor slot",
    sponsorPriority: 76,
    tier: "Major",
    venue: "Las Vegas Convention Center",
    why: "One of the largest clean energy gatherings for renewables, storage, grid infrastructure, finance, and project development."
  },
  {
    audience: "Oil, gas, chemicals, petrochemicals, LNG, energy executives, national oil companies",
    city: "Abu Dhabi",
    dates: "November 2-5, 2026",
    id: "adipec-2026",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=82",
    name: "ADIPEC 2026",
    plays: ["Plan executive dinners by operator or region", "Reserve hotel meeting suites early", "Use sponsored receptions for multi-client coverage"],
    segment: "petrochemical",
    segmentLabel: "Petrochemical",
    source: "https://www.adipec.com/",
    tier: "Major",
    venue: "ADNEC Centre Abu Dhabi",
    why: "A global energy and industrial gathering with heavy executive presence across upstream, downstream, chemicals, and energy transition."
  },
  {
    audience: "Payments, banking, fintech, fraud, embedded finance, investors, enterprise partnerships",
    city: "Las Vegas",
    dates: "October 25-28, 2026",
    id: "money2020-usa-2026",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=82",
    name: "Money20/20 USA 2026",
    plays: ["Use private rooms for bank and fintech partner dinners", "Plan investor breakfasts before keynote blocks", "Buy sponsored visibility around payment and fraud themes"],
    segment: "finance",
    segmentLabel: "Finance",
    source: "https://us.money2020.com/",
    sponsorLabel: "Finance sponsor slot",
    sponsorPriority: 94,
    tier: "Major",
    venue: "The Venetian",
    why: "A dense finance and fintech dealmaking week where banks, payment networks, startups, and enterprise buyers converge."
  },
  {
    audience: "European enterprise technology buyers, AI leaders, startups, corporate innovation, investors, government, global brands",
    city: "Paris",
    dates: "June 16-19, 2027",
    id: "vivatech-2027",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=82",
    name: "VivaTech 2027",
    plays: ["Host polished Seine-side dinners", "Book salons for investor-founder roundtables", "Use breakfast briefings for European market entry"],
    segment: "technology",
    segmentLabel: "Technology",
    source: "https://vivatech.com/",
    sponsorLabel: "Global innovation feature",
    sponsorPriority: 82,
    tier: "Major",
    venue: "Paris Expo Porte de Versailles",
    why: "Paris’ flagship innovation week brings together startups, corporate leaders, investors, and global tech brands with serious European market gravity."
  },
  {
    audience: "Aerospace, defense, mobility, airlines, governments, manufacturers, investors, national delegations",
    city: "Paris",
    dates: "June 14-20, 2027",
    id: "paris-air-show-2027",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=82",
    name: "Paris Air Show 2027",
    plays: ["Reserve formal hospitality near Le Bourget", "Host defense and aerospace account dinners by delegation", "Use private salons for government and OEM meetings"],
    segment: "technology",
    segmentLabel: "Aerospace",
    source: "https://www.siae.fr/en/",
    tier: "Major",
    venue: "Paris-Le Bourget",
    why: "A global aerospace and defense anchor event where industrial strategy, procurement, national delegations, and executive hospitality overlap."
  },
  {
    audience: "Enterprise tech buyers, AI, founders, investors, policy, global innovation teams, London corporate ecosystem",
    city: "London",
    dates: "June 7-11, 2027",
    id: "london-tech-week-2027",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=82",
    name: "London Tech Week 2027",
    plays: ["Use Mayfair and City private rooms for enterprise dinners", "Host investor breakfasts near Olympia", "Build a private-club style evening for top accounts"],
    segment: "technology",
    segmentLabel: "Technology",
    source: "https://londontechweek.com/",
    sponsorLabel: "European tech feature",
    sponsorPriority: 78,
    tier: "Major",
    venue: "Olympia London and across London",
    why: "London’s broad tech week ties enterprise innovation, capital, policy, and private-market networking into one citywide business event."
  },
  {
    audience: "Travel boards, airlines, hospitality groups, tour operators, destination marketers, global travel buyers",
    city: "London",
    dates: "November 3-5, 2026",
    id: "wtm-london-2026",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1400&q=82",
    name: "World Travel Market London 2026",
    plays: ["Host destination buyer dinners by region", "Use hotel lounges for tourism-board briefings", "Build sponsor inventory around travel buyers"],
    segment: "finance",
    segmentLabel: "Travel & Hospitality",
    source: "https://www.wtm.com/london/en-gb.html",
    tier: "Major",
    venue: "ExCeL London",
    why: "One of the most influential travel and tourism marketplaces, connecting global buyers, destinations, hospitality brands, and tourism investors."
  },
  {
    audience: "Gaming, entertainment, IP owners, platforms, developers, hardware, media, investors, brand partnerships",
    city: "Tokyo",
    dates: "September 17-21, 2026",
    id: "tokyo-game-show-2026",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1400&q=82",
    name: "Tokyo Game Show 2026",
    plays: ["Use business days for publisher and platform meetings", "Host compact Ginza or Marunouchi dinners", "Stack IP and entertainment partner meetings before public days"],
    segment: "technology",
    segmentLabel: "Gaming & Media",
    source: "https://events.nikkeibp.co.jp/tgs/2026/",
    tier: "Major",
    venue: "Makuhari Messe",
    why: "A global gaming and interactive entertainment anchor with business days for deals, distribution, platforms, IP, and media coverage."
  },
  {
    audience: "Japanese and global electronics, Society 5.0, enterprise technology, manufacturing, mobility, government, co-creation leaders",
    city: "Tokyo",
    dates: "October 13-16, 2026",
    id: "ceatec-2026",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1400&q=82",
    name: "CEATEC 2026",
    plays: ["Run precision buyer meetings around Makuhari", "Use Tokyo dinners for senior executive follow-through", "Package sponsor placements around manufacturing and AI adoption"],
    segment: "technology",
    segmentLabel: "Technology",
    source: "https://www.ceatec.com/en/application/outline/",
    tier: "Major",
    venue: "Makuhari Messe",
    why: "Japan’s advanced technology exhibition connects electronics, manufacturing, mobility, AI, and cross-industry transformation."
  },
  {
    audience: "Telecommunications, subsea cable, data centers, cloud infrastructure, Pacific Rim investors, C-level digital infrastructure leaders",
    city: "Honolulu",
    dates: "January 17-20, 2027",
    id: "ptc-honolulu-2027",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=82",
    name: "PTC Honolulu 2027",
    plays: ["Use resort hospitality for C-level infrastructure meetings", "Host Pacific Rim investor dinners", "Plan morning oceanfront briefings before panels"],
    segment: "technology",
    segmentLabel: "Digital Infrastructure",
    source: "https://aptelecom.com/event/ptc-honolulu-2027/",
    sponsorLabel: "Pacific Rim feature",
    sponsorPriority: 72,
    tier: "Major",
    venue: "Hilton Hawaiian Village Waikiki Beach Resort",
    why: "A premier Pacific Rim telecommunications and digital infrastructure gathering where executives, investors, and technologists meet in a high-trust resort setting."
  },
  {
    audience: "Information systems, AI, cybersecurity, digital government, academic and practitioner technology leaders",
    city: "Hawaiʻi Island",
    dates: "January 5-8, 2027",
    id: "hicss-2027",
    image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1400&q=82",
    name: "HICSS 2027",
    plays: ["Bridge academic research and practitioner innovation", "Use resort breakfasts for research-industry conversations", "Capture AI and information-systems insights for strategy teams"],
    segment: "technology",
    segmentLabel: "Information Systems",
    source: "https://hicss.hawaii.edu/",
    tier: "Major",
    venue: "Hilton Waikoloa Village, Big Island",
    why: "A long-running systems sciences conference connecting research, AI, cybersecurity, digital transformation, and practitioner insight in Hawaiʻi."
  },
  {
    audience: "Banking, capital markets, payments, transaction banking, compliance, infrastructure",
    city: "Miami",
    dates: "September 28-October 1, 2026",
    id: "sibos-2026",
    image: "https://images.unsplash.com/photo-1565373677928-90e963765eac?auto=format&fit=crop&w=1400&q=82",
    name: "Sibos 2026",
    plays: ["Host bank-client dinners on Miami Beach", "Use breakfast briefings for compliance and payments teams", "Reserve hotel suites for private partnership meetings"],
    segment: "finance",
    segmentLabel: "Finance",
    source: "https://www.sibos.com/",
    tier: "Major",
    venue: "Miami Beach Convention Center",
    why: "A global banking infrastructure event with strong executive presence across payments, securities, compliance, and financial messaging."
  },
  {
    audience: "Carriers, brokers, reinsurers, insurtech, claims, underwriting, distribution leaders",
    city: "Las Vegas",
    dates: "October 13-15, 2026",
    id: "itc-vegas-2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=82",
    name: "ITC Vegas 2026",
    plays: ["Book broker-carrier dinners by line of business", "Use sponsored suites for claims and underwriting demos", "Host small reinsurer and insurtech investor tables"],
    segment: "insurance",
    segmentLabel: "Business Insurance",
    source: "https://vegas.insuretechconnect.com/",
    sponsorLabel: "Insurance sponsor slot",
    sponsorPriority: 80,
    tier: "Major",
    venue: "Mandalay Bay",
    why: "A major insurance innovation gathering where carriers, brokers, technology companies, and investors meet around underwriting, claims, and distribution."
  },
  {
    audience: "Cloud, AI, cybersecurity, data, enterprise software, infrastructure, partners",
    city: "Las Vegas",
    dates: "November 30-December 4, 2026",
    id: "aws-reinvent-2026",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=82",
    name: "AWS re:Invent 2026",
    plays: ["Plan account-based dinners by cloud workload", "Use suites for private demos", "Reserve hospitality blocks around AI and security launches"],
    segment: "technology",
    segmentLabel: "Technology",
    source: "https://reinvent.awsevents.com/",
    tier: "Major",
    venue: "Las Vegas conference campus",
    why: "A large enterprise technology event where cloud, AI, and software vendors can stack meetings with customers already in market."
  }
];

export const cityGuides: CityGuide[] = [
  {
    activities: [
      { name: "Sphere hospitality block", note: "High-impact group entertainment when schedules allow", type: "After-hours" },
      { name: "Topgolf Las Vegas", note: "Easy hosted group format near the Strip", type: "Client activity" },
      { name: "Wynn/Encore lounges", note: "Useful for small executive follow-ups", type: "Late meeting" }
    ],
    city: "Las Vegas",
    image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1200&q=82",
    tone: "Spectacle, speed, private rooms, and late-night deal heat.",
    businessEnergy: "Best when the goal is to compress a year of meetings into four electric days.",
    neighborhoods: ["The Strip", "Venetian/Palazzo", "Wynn corridor"],
    picks: [
      { name: "SW Steakhouse", note: "High-end executive dinner setting at Wynn", type: "Steakhouse" },
      { name: "Bazaar Meat", note: "Large-format client dinner option", type: "Private dining" },
      { name: "Delmonico Steakhouse", note: "Strong fit near Venetian Expo", type: "Convenient dinner" }
    ],
    positioning: "High-capacity expo hosting with private rooms, suites, and late-night client options."
  },
  {
    activities: [
      { name: "Seine-side reception", note: "Elegant hospitality with high perceived value for global executives", type: "After-hours" },
      { name: "Private salon dinner", note: "Best for investor, aerospace, luxury, and European market-entry conversations", type: "Client hosting" }
    ],
    businessEnergy: "Paris makes business feel curated: polished rooms, patient dinners, high-context relationships.",
    city: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=82",
    neighborhoods: ["Porte de Versailles", "Le Bourget", "Saint-Germain", "8th Arrondissement"],
    picks: [
      { name: "Le Clarence", note: "Formal executive dinner energy", type: "Fine dining" },
      { name: "Girafe", note: "High-impact view and hospitality setting", type: "Client dinner" },
      { name: "Private hotel salon", note: "Best for sponsor, investor, or delegation meetings", type: "Private room" }
    ],
    positioning: "Luxury hospitality, innovation, aerospace, and high-context European relationship building.",
    tone: "Champagne precision, salons, institutional elegance, and global innovation."
  },
  {
    activities: [
      { name: "Mayfair private-club evening", note: "High-trust format for finance, investor, and enterprise relationships", type: "Executive hosting" },
      { name: "City breakfast briefing", note: "Efficient for banking, legal, insurance, and technology leaders", type: "Meeting move" }
    ],
    businessEnergy: "London rewards preparation: named targets, formal rooms, and serious follow-up.",
    city: "London",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=82",
    neighborhoods: ["Mayfair", "The City", "Shoreditch", "Olympia", "Royal Docks"],
    picks: [
      { name: "The Wolseley", note: "Classic breakfast or client meal setting", type: "Institutional dining" },
      { name: "Hawksmoor Guildhall", note: "Finance-friendly steakhouse format", type: "Steakhouse" },
      { name: "Private members' room", note: "Good for board-level or investor conversations", type: "Private room" }
    ],
    positioning: "Finance, insurance, technology, travel, and private-market hospitality in one global capital.",
    tone: "Institutional, clubby, precise, globally connected."
  },
  {
    activities: [
      { name: "Ginza executive dinner", note: "Quiet, premium, high-signal relationship setting", type: "Client dinner" },
      { name: "Shibuya neon walk-and-talk", note: "Memorable brand and media energy after formal sessions", type: "After-hours" }
    ],
    businessEnergy: "Tokyo is about precision: fewer wasted meetings, deeper preparation, and memorable execution.",
    city: "Tokyo",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=82",
    neighborhoods: ["Marunouchi", "Ginza", "Shibuya", "Roppongi", "Makuhari"],
    picks: [
      { name: "Ginza private dining", note: "Polished executive hosting with discretion", type: "Private dining" },
      { name: "Roppongi Hills club room", note: "Good for international teams and investors", type: "Executive room" },
      { name: "Marunouchi hotel lounge", note: "Efficient between-meeting environment", type: "Meeting lounge" }
    ],
    positioning: "Technology, gaming, manufacturing, media, and enterprise transformation with unmatched operational polish.",
    tone: "Neon discipline, ritual, precision, and future-facing business culture."
  },
  {
    activities: [
      { name: "Oceanfront executive breakfast", note: "High-trust format for strategic conversations", type: "Meeting move" },
      { name: "Resort incentive reception", note: "Excellent for rewarding teams and deepening partner relationships", type: "Incentive hosting" }
    ],
    businessEnergy: "Hawaiʻi turns meetings into memory: longer attention, fewer distractions, stronger relationship recall.",
    city: "Honolulu",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    neighborhoods: ["Waikiki", "Ala Moana", "Kakaʻako", "Ko Olina"],
    picks: [
      { name: "Oceanfront resort private room", note: "Best for senior relationship building", type: "Private dining" },
      { name: "Waikiki hospitality suite", note: "Convenient for telecom and incentive groups", type: "Suite" },
      { name: "Sunset reception lawn", note: "High-emotion sponsor or incentive format", type: "Reception" }
    ],
    positioning: "Incentive travel, telecom, digital infrastructure, systems research, and relationship-heavy executive retreats.",
    tone: "Warm, generous, restorative, Pacific Rim business trust."
  },
  {
    activities: [
      { name: "West Loop private dining crawl", note: "Good for smaller client clusters", type: "Group hosting" },
      { name: "Architectural river cruise", note: "Memorable non-dinner option in warmer months", type: "Client activity" }
    ],
    city: "Chicago",
    neighborhoods: ["West Loop", "River North", "South Loop"],
    picks: [
      { name: "Bavette's", note: "Polished client dinner room", type: "Steakhouse" },
      { name: "Gibsons Italia", note: "Executive-friendly private dining", type: "River view dining" },
      { name: "RPM Steak", note: "Reliable group dinner option", type: "Steakhouse" }
    ],
    positioning: "Excellent for major medical conferences, finance dinners, imaging demos, and steakhouse-led client hosting."
  },
  {
    activities: [
      { name: "Brickell cocktail corridor", note: "Efficient for finance and banking groups", type: "After-hours" },
      { name: "Miami Beach hotel cabanas", note: "Useful for informal relationship time", type: "Day hosting" }
    ],
    city: "Miami",
    neighborhoods: ["Miami Beach", "Brickell", "Wynwood"],
    picks: [
      { name: "Prime 112", note: "High-energy executive dinner option", type: "Steakhouse" },
      { name: "Zuma Miami", note: "Strong finance and international hosting fit", type: "Client dinner" },
      { name: "Komodo", note: "Large-format client entertainment option", type: "Private dining" }
    ],
    positioning: "Finance and banking event market with Miami Beach, Brickell, and design-forward private dining."
  },
  {
    activities: [
      { name: "Al Maryah Island receptions", note: "Strong hotel and restaurant density", type: "Executive hosting" },
      { name: "Louvre Abu Dhabi", note: "Premium cultural option for senior guests", type: "Client activity" }
    ],
    city: "Abu Dhabi",
    neighborhoods: ["ADNEC", "Al Maryah Island", "Corniche"],
    picks: [
      { name: "Zuma Abu Dhabi", note: "High-end international hospitality", type: "Client dinner" },
      { name: "Hakkasan Abu Dhabi", note: "Formal hosted dinner option", type: "Private dining" },
      { name: "The Oak Room", note: "Executive steakhouse fit", type: "Steakhouse" }
    ],
    positioning: "Global energy executive market with hotel suites, formal dinners, and sponsored receptions."
  }
];

export const destinations: Destination[] = [
  {
    city: "Las Vegas",
    country: "United States",
    hostingStyle: "High-energy dinners, suites, spectacle, and late-night networking.",
    mood: "Electric",
    signatureMove: "Stack meetings by hotel tower, then host one unforgettable dinner.",
    slug: "las-vegas",
    visualTone: "neon gold / black glass / Strip heat",
    whyGo: "The fastest place to compress enterprise tech, finance, energy, insurance, and media meetings."
  },
  {
    city: "Paris",
    country: "France",
    hostingStyle: "Private salons, Seine-side dinners, polished hospitality, and high-context introductions.",
    mood: "Elegant",
    signatureMove: "Turn a conference meeting into a formal dinner that feels like a relationship milestone.",
    slug: "paris",
    visualTone: "champagne / stone / couture restraint",
    whyGo: "Innovation, aerospace, luxury, and European market access meet in rooms that feel consequential."
  },
  {
    city: "London",
    country: "United Kingdom",
    hostingStyle: "Breakfast briefings, private clubs, finance dinners, and institutional credibility.",
    mood: "Institutional",
    signatureMove: "Use Mayfair or the City for a serious room with senior people and a clear ask.",
    slug: "london",
    visualTone: "oxblood / brass / rain-dark finance",
    whyGo: "Capital, enterprise technology, insurance, travel, law, and investor networks are unusually dense."
  },
  {
    city: "Tokyo",
    country: "Japan",
    hostingStyle: "Precise meetings, compact executive dinners, media energy, and unforgettable after-hours atmosphere.",
    mood: "Precise",
    signatureMove: "Use business-day discipline, then let Tokyo make the evening memorable.",
    slug: "tokyo",
    visualTone: "neon cyan / lacquer black / controlled motion",
    whyGo: "Gaming, electronics, manufacturing, AI, and media meet with deep execution culture."
  },
  {
    city: "Honolulu",
    country: "Hawaiʻi",
    hostingStyle: "Oceanfront trust-building, incentive rewards, Pacific Rim executive conversations.",
    mood: "Restorative",
    signatureMove: "Make the business conversation feel like a reward people remember.",
    slug: "hawaii",
    visualTone: "sunset coral / ocean teal / resort warmth",
    whyGo: "The place for relationship-heavy meetings, incentives, telecom, and retreat-level strategic work."
  }
];

export function getScore(event: EventItem) {
  const cityDemand = events.filter((item) => item.city === event.city).length;
  const sectorDemand = events.filter((item) => item.segment === event.segment).length;
  return Math.min(100, 48 + (event.tier === "Major" ? 18 : 7) + Math.min(cityDemand * 5, 18) + Math.min(sectorDemand * 4, 16));
}

export function getSignalLabel(score: number) {
  if (score >= 85) return "Must-plan";
  if (score >= 74) return "High-value";
  if (score >= 64) return "Selective";
  return "Watchlist";
}
