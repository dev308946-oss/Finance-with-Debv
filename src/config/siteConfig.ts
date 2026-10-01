/**
 * ============================================================================
 * FINANCE WITH DEV COMMUNITY — CENTRAL CONFIGURATION
 * ============================================================================
 * Edit the URLs and content below in one place to update links, tool statuses
 * (e.g., changing "COMING SOON" to "AVAILABLE"), pricing, community member
 * stages, and FAQs across the entire website.
 */

export const FREE_NISM_XV_URL = 'https://nismxvresearchanalyst-4m18.vercel.app/';
export const FREE_IPO_TOOL_URL = 'https://ipo-check-financewithdev.ai.studio';
export const PREMIUM_IPO_TOOL_URL = 'YOUR_COMMUNITY_IPO_TOOL_LINK';
export const PAYMENT_URL = 'YOUR_PAYMENT_LINK_HERE';
export const COMMUNITY_URL = 'YOUR_COMMUNITY_LINK_HERE';
export const INSTAGRAM_URL = 'YOUR_INSTAGRAM_LINK_HERE';

export type ToolAvailabilityStatus = 'AVAILABLE' | 'COMING SOON';

export interface NismCertificationModule {
  id: string;
  code: string;
  title: string;
  shortName: string;
  status: ToolAvailabilityStatus;
  badge: string;
  description: string;
  freeTierLabel?: string;
  communityTierLabel?: string;
  freeCtaText?: string;
  freeUrl?: string;
  communityUrl?: string;
}

export interface CommunityMemberStage {
  id: string;
  index: string;
  title: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_CONFIG = {
  // 1. CENTRAL LINKS OBJECT
  links: {
    FREE_NISM_XV_URL,
    FREE_IPO_TOOL_URL,
    PREMIUM_IPO_TOOL_URL,
    PAYMENT_URL,
    COMMUNITY_URL,
    INSTAGRAM_URL,
  },

  // 2. BRAND & POSITIONING
  brand: {
    name: 'Finance With Dev',
    upperName: 'FINANCE WITH DEV',
    communityName: 'Finance With Dev Community',
    coreMessage: 'Learn. Research. Discuss. Grow.',
    supportingLine:
      'A finance community for people who want to learn markets, build practical skills, research companies and connect with other finance-focused people.',
    topicsCovered: [
      'Equity research',
      'Stock markets',
      'Trading',
      'IPOs',
      'Financial analysis',
      'NISM certifications',
      'CFA-related learning',
      'Finance careers',
      'Market discussions',
      'Educational resources',
    ],
  },

  // 3. PRICING & CTA LABELS
  pricing: {
    amount: '₹199',
    period: 'month',
    formattedPrice: '₹199 / month',
    compactPrice: '₹199/month',
    heroSmallText: 'Affordable. Practical. Community-driven.',
    primaryCtaText: 'JOIN THE COMMUNITY — ₹199/MONTH',
    secondaryHeroCtaText: "SEE WHAT'S INSIDE ↓",
    mobileStickyCtaText: '₹199/month → JOIN COMMUNITY',
    finalCtaButtonText: 'JOIN FINANCE WITH DEV',
    navCtaText: 'Join ₹199',
  },

  // 4. ANALYTICS EVENTS
  analytics: {
    enabled: true,
    events: {
      joinCtaClick: 'cta_join_community_click',
      ipoToolClick: 'tool_ipo_click',
      nismTestClick: 'tool_nism_click',
      faqExpand: 'faq_question_expand',
      navSectionClick: 'navigation_section_click',
    },
  },

  // 5. HERO SECTION
  hero: {
    headline: 'Learn Finance. Research Markets. Grow Together.',
    subheadline:
      'Tools, resources, discussions and a community built for people serious about learning finance.',
  },

  // 6. SECTION 2 — WHAT IS INSIDE? (6 CARDS + EXPANDABLE NISM MODULES)
  whatIsInside: {
    heading: 'More than just a group chat.',
    subheading:
      'Your membership gives you access to tools, learning resources, discussions and a finance-focused community.',
    ipoCard: {
      category: 'IPO RESEARCH',
      title: 'IPO Analysis & Discussion',
      description:
        'Research upcoming IPOs, understand the key factors and discuss them with other members.',
      freeNote: 'Free users can access the basic IPO checking tool.',
      premiumNote:
        'Community members get access to the more detailed/premium IPO analysis experience.',
      freeButtonText: 'TRY BASIC IPO CHECK',
      freeButtonUrl: FREE_IPO_TOOL_URL,
      premiumButtonText: 'PREMIUM — COMMUNITY ACCESS',
      premiumButtonUrl: PREMIUM_IPO_TOOL_URL,
    },
    nismCard: {
      category: 'NISM PRACTICE',
      title: 'NISM Practice & Certification Prep',
      description:
        'Practice for NISM certifications with dedicated question banks and explanations.',
    },
    additionalOverviewCards: [
      {
        id: 'overview-market-discussions',
        category: 'MARKET DISCUSSIONS',
        title: 'Market, Sector & Company Discussions',
        description:
          'Discuss market movements, company earnings, business models, sector trends and valuation with finance-focused peers.',
        highlights: ['Market Movements', 'Company Earnings', 'Sector KPIs', 'IPO Factors'],
        anchor: '#discussions',
      },
      {
        id: 'overview-learning-resources',
        category: 'LEARNING RESOURCES',
        title: 'Curated Finance Library',
        description:
          'Handpicked books, finance movies & documentaries, articles, research frameworks and useful tools.',
        highlights: ['Books & Movies', 'Articles', 'Research Frameworks', 'Websites & Tools'],
        anchor: '#resources',
      },
      {
        id: 'overview-assignments',
        category: 'PRACTICAL SKILL BUILDING',
        title: 'Finance & Research Assignments',
        description:
          'Apply what you learn through practical finance exercises, company analysis tasks and structured practice.',
        highlights: ['Equity Research Tasks', 'Financial Analysis', 'Case Exercises', 'Self-Paced'],
        anchor: '#what-happens-inside',
      },
      {
        id: 'overview-community-network',
        category: 'FINANCE-FOCUSED COMMUNITY',
        title: 'Peer Learning Network',
        description:
          'Connect with members at different stages of their finance journey to discuss concepts, share resources and exchange perspectives.',
        highlights: ['Group Discussions', 'CFA & NISM Learners', 'Career Discussions', 'Peer Perspectives'],
        anchor: '#community',
      },
    ],
  },

  // 7. MODULAR NISM CERTIFICATIONS LIST
  // Change `status: 'COMING SOON'` to `'AVAILABLE'` and set `freeUrl` when new tools launch.
  nismCertifications: [
    {
      id: 'nism-xv',
      code: 'TOOL 02',
      title: 'Research Analyst — NISM XV',
      shortName: 'NISM XV PRACTICE',
      status: 'AVAILABLE',
      badge: 'AVAILABLE NOW',
      description: 'Test your Research Analyst knowledge with practice MCQs.',
      freeTierLabel: '40 MCQs',
      communityTierLabel: '80 MCQs — Community Access',
      freeCtaText: 'TRY 40 FREE MCQs',
      freeUrl: FREE_NISM_XV_URL,
    },
    {
      id: 'nism-viii',
      code: 'TOOL 03',
      title: 'Equity Derivatives — NISM VIII',
      shortName: 'NISM VIII — EQUITY DERIVATIVES',
      status: 'COMING SOON',
      badge: 'PLANNED / COMMUNITY',
      description:
        'Practice questions and preparation resources for NISM Series VIII: Equity Derivatives.',
    },
    {
      id: 'nism-commodity',
      code: 'TOOL 04',
      title: 'Commodity Derivatives',
      shortName: 'NISM COMMODITY DERIVATIVES',
      status: 'COMING SOON',
      badge: 'PLANNED / COMMUNITY',
      description: 'Practice resources for NISM Commodity Derivatives.',
    },
  ] as NismCertificationModule[],

  // 8. SECTION 3 — MARKET DISCUSSIONS
  marketDiscussions: {
    heading: "Talk about what's happening in the markets.",
    description:
      'Discuss companies, sectors, market movements, IPOs and financial developments with other finance-focused members.',
    educationalNote:
      'All discussions are strictly educational and research-oriented. The community does not provide stock tips, personalized investment advice or guaranteed returns.',
    cards: [
      {
        id: 'market-discussion',
        index: '01',
        title: 'Market Discussion',
        description: 'Discuss market movements and important developments.',
        topics: 'Macro Trends · Index Movements · Market Sentiment',
      },
      {
        id: 'company-discussion',
        index: '02',
        title: 'Company Discussion',
        description:
          'Discuss companies, earnings, business models and financial performance.',
        topics: 'Quarterly Results · Business Models · Balance Sheets',
      },
      {
        id: 'sector-discussion',
        index: '03',
        title: 'Sector Discussion',
        description: 'Discuss sector trends, KPIs and industry developments.',
        topics: 'Industry Cycles · Operating Metrics · Value Chains',
      },
      {
        id: 'ipo-discussion',
        index: '04',
        title: 'IPO Discussion',
        description:
          'Discuss upcoming IPOs, important factors, risks and valuation.',
        topics: 'DRHP Takeaways · Key Risks · Peer Valuation',
      },
    ],
  },

  // 9. SECTION 4 — LEARNING RESOURCES
  learningResources: {
    heading: 'Curated resources for finance learners.',
    subheading:
      'Thoughtfully selected material to build practical finance depth — never a random link dump.',
    cards: [
      {
        id: 'books',
        index: '01',
        title: 'Books',
        description:
          'Finance, investing, valuation, markets and career-related book recommendations.',
      },
      {
        id: 'movies',
        index: '02',
        title: 'Movies & Documentaries',
        description:
          'Finance and business movies/documentaries worth watching.',
      },
      {
        id: 'articles',
        index: '03',
        title: 'Articles',
        description: 'Useful finance, markets and business articles.',
      },
      {
        id: 'research-resources',
        index: '04',
        title: 'Research Resources',
        description:
          'Useful reports, websites, frameworks and research material.',
      },
      {
        id: 'assignments',
        index: '05',
        title: 'Assignments',
        description: 'Practical finance and equity research assignments.',
      },
      {
        id: 'useful-tools',
        index: '06',
        title: 'Useful Tools',
        description:
          'Websites and tools that can help members learn and research.',
      },
    ],
  },

  // 10. SECTION 5 — FINANCE-FOCUSED COMMUNITY
  communitySection: {
    kicker: 'FINANCE-FOCUSED COMMUNITY',
    heading: 'Learn with people who are serious about finance.',
    subheading:
      'Connect with members at different stages of their finance journey.',
    interestsIntro:
      'The community brings together people interested in:',
    interestsList: [
      'CFA and professional finance certifications',
      'Equity Research',
      'Financial Modelling',
      'Markets & Trading',
      'Valuation',
      'Investing',
      'Finance careers',
    ],
    memberTypesHeading: 'Who you may connect with inside the community',
    memberStages: [
      {
        id: 'cfa-aspirants',
        index: '01',
        title: 'CFA Aspirants',
        description: 'People currently preparing for CFA.',
      },
      {
        id: 'cfa-level-1-cleared',
        index: '02',
        title: 'CFA Level 1 Cleared',
        description: 'Members who have completed CFA Level 1.',
      },
      {
        id: 'equity-research-learners',
        index: '03',
        title: 'Equity Research Learners',
        description:
          'People learning company analysis, financial statements and valuation.',
      },
      {
        id: 'market-enthusiasts',
        index: '04',
        title: 'Market Enthusiasts',
        description: 'People interested in markets, trading and investing.',
      },
      {
        id: 'finance-career-builders',
        index: '05',
        title: 'Finance Career Builders',
        description: 'People preparing for careers in finance.',
      },
    ] as CommunityMemberStage[],
    closingStatement:
      'The community is designed to bring together people who can learn from each other, discuss concepts, share resources and exchange perspectives.',
  },

  // 11. SECTION 6 — FREE VS COMMUNITY COMPARISON
  comparison: {
    heading: "What's free. What's inside the community.",
    freeTier: {
      title: 'FREE',
      priceLabel: '₹0',
      features: [
        'Basic IPO Check',
        '40 NISM XV MCQs',
        'Selected finance resources',
        'Free educational content',
        'Public market content',
      ],
    },
    communityTier: {
      title: 'COMMUNITY — ₹199/MONTH',
      badge: 'MEMBERS GET MORE',
      priceLabel: '₹199 / month',
      features: [
        'Premium IPO Analysis',
        '80 NISM XV MCQs',
        'Future NISM practice tools',
        'IPO Discussions',
        'Market Discussions',
        'Company & Sector Discussions',
        'Finance Assignments',
        'Curated Books',
        'Finance Movies',
        'Articles & Research Resources',
        'Private Community',
        'CFA & certification peer discussions',
      ],
    },
  },

  // 12. SECTION 7 — TOOLS SECTION
  toolsSection: {
    heading: 'Tools built for finance learners.',
    tool01: {
      code: 'TOOL 01',
      freeTitle: 'IPO CHECK',
      freeBadge: 'FREE',
      freeDescription: 'Quickly explore IPO information and key factors.',
      freeButtonText: 'OPEN IPO CHECK',
      freeUrl: FREE_IPO_TOOL_URL,
      premiumTitle: 'Premium IPO Analysis',
      premiumBadge: 'COMMUNITY',
      premiumDescription:
        'More detailed IPO analysis and member-only functionality.',
      premiumButtonText: 'COMMUNITY ACCESS',
      premiumUrl: PREMIUM_IPO_TOOL_URL,
    },
    tool02: {
      code: 'TOOL 02',
      title: 'NISM XV PRACTICE',
      description: 'Test your Research Analyst knowledge with practice MCQs.',
      comparisonBadge: '40 FREE → 80 COMMUNITY',
      buttonText: 'TRY 40 FREE MCQs',
      url: FREE_NISM_XV_URL,
    },
    tool03: {
      code: 'TOOL 03',
      title: 'NISM VIII — EQUITY DERIVATIVES',
      status: 'COMING SOON' as ToolAvailabilityStatus,
      description:
        'Dedicated Equity Derivatives practice tool for NISM Series VIII.',
    },
    tool04: {
      code: 'TOOL 04',
      title: 'NISM COMMODITY DERIVATIVES',
      status: 'COMING SOON' as ToolAvailabilityStatus,
      description: 'Dedicated practice resources for Commodity Derivatives.',
    },
  },

  // 13. SECTION 8 — WHO IS THIS FOR?
  audienceSection: {
    heading: 'Who should join?',
    cards: [
      {
        id: 'finance-students',
        index: '01',
        title: 'Finance Students',
        description:
          'For students who want practical exposure beyond textbooks.',
      },
      {
        id: 'equity-researchers',
        index: '02',
        title: 'Aspiring Equity Researchers',
        description:
          'For people interested in company analysis, valuation and research.',
      },
      {
        id: 'market-learners',
        index: '03',
        title: 'Market Learners',
        description:
          'For people who want to understand markets and discuss them with others.',
      },
      {
        id: 'career-builders',
        index: '04',
        title: 'Finance Career Builders',
        description:
          'For people preparing for finance certifications, interviews and careers.',
      },
    ],
  },

  // 14. SECTION 9 — WHAT YOU CAN EXPECT (WHAT HAPPENS INSIDE?)
  whatHappensInside: {
    heading: 'What happens inside?',
    subheading: "Examples of what you'll find inside the community.",
    items: [
      {
        id: 'resource-drop',
        label: 'RESOURCE DROP',
        description:
          'A useful finance book, article, movie or research resource.',
      },
      {
        id: 'market-discussion',
        label: 'MARKET DISCUSSION',
        description: 'Discuss an important market or sector development.',
      },
      {
        id: 'ipo-discussion',
        label: 'IPO DISCUSSION',
        description: 'Discuss an upcoming IPO and its important factors.',
      },
      {
        id: 'practice',
        label: 'PRACTICE',
        description: 'Work through finance/NISM questions or assignments.',
      },
      {
        id: 'community-discussion',
        label: 'COMMUNITY DISCUSSION',
        description: 'Ask questions and discuss finance with other members.',
      },
    ],
  },

  // 15. SECTION 10 — PRICING CHECKLIST
  pricingSection: {
    heading: 'Finance With Dev Community',
    price: '₹199 / month',
    ctaText: 'JOIN THE COMMUNITY — ₹199/MONTH',
    checklist: [
      'Premium IPO Analysis',
      'NISM Practice Resources',
      '80 NISM XV MCQs',
      'IPO Discussions',
      'Market Discussions',
      'Company & Sector Discussions',
      'Finance Assignments',
      'Curated Books & Movies',
      'Articles & Research Resources',
      'Private Community',
      'CFA & Certification Peer Discussions',
    ],
  },

  // 16. SECTION 11 — FAQ ACCORDION
  faqSection: {
    heading: 'Frequently asked questions',
    items: [
      {
        id: 'faq-1',
        question: 'What do I get for ₹199/month?',
        answer:
          'You get access to the Finance With Dev Community, member-only tools and resources, market and IPO discussions, finance assignments, NISM practice resources and other community benefits.',
      },
      {
        id: 'faq-2',
        question: 'Is the IPO tool included?',
        answer:
          'The basic IPO check is publicly available. Community members get access to the premium/member-only IPO analysis experience.',
      },
      {
        id: 'faq-3',
        question: 'How many NISM XV questions are available?',
        answer:
          'The public version contains 40 free questions. Community members get access to 80 questions.',
      },
      {
        id: 'faq-4',
        question: 'Will there be other NISM practice tests?',
        answer:
          'Yes. More certification-specific practice tools are planned, including NISM Series VIII Equity Derivatives and Commodity Derivatives.',
      },
      {
        id: 'faq-5',
        question: 'Is this an investment advisory service?',
        answer:
          'No. The community is intended for education and discussion. It does not provide personalized investment advice or guarantee investment returns.',
      },
      {
        id: 'faq-6',
        question: 'Who can join?',
        answer:
          'Anyone interested in finance, markets, equity research, trading, investing, certifications or building practical finance knowledge.',
      },
    ] as FAQItem[],
  },

  // 17. SECTION 12 — FINAL CTA
  finalCta: {
    headline: 'Build your finance knowledge with us.',
    subheadline: 'Tools. Resources. Discussions. Community.',
    price: '₹199/month',
    buttonText: 'JOIN FINANCE WITH DEV',
    smallLine: 'Start learning. Start researching. Start discussing.',
  },
} as const;
