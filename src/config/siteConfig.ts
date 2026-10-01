/**
 * ============================================================================
 * FINANCE WITH DEV COMMUNITY — CENTRAL CONFIGURATION
 * ============================================================================
 * Edit the URLs and content below in one place to update links, tool statuses
 * (e.g., changing "COMING SOON" to "AVAILABLE"), pricing, community benefits,
 * and FAQs across the entire website.
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
  comparisonBadge?: string;
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
      'Daily market briefs, research tools, practical learning resources and a finance-focused community — all in one place.',
    topicsCovered: [
      'Daily Market Briefs',
      'Equity Research',
      'Stock Markets',
      'IPOs',
      'Financial Analysis',
      'Valuation',
      'Finance Learning Resources',
      'Certification & Practice Tools',
      'Finance Careers',
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
    pricingCardButtonText: 'JOIN THE COMMUNITY',
    finalCtaButtonText: 'JOIN FINANCE WITH DEV — ₹199/MONTH',
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
      'Daily market briefs, research tools, practical learning resources and a finance-focused community — all in one place.',
  },

  // 6. DAILY MARKET BRIEF SPOTLIGHT & 01–06 ORDERED COMMUNITY BENEFITS
  whatIsInside: {
    heading: 'More than just a group chat.',
    subheading:
      'Your membership gives you access to daily market briefs, research tools, learning resources, discussions and a finance-focused community.',
    dailyBriefSpotlight: {
      index: '01',
      title: 'Daily Market Brief',
      orderedSummary:
        'A concise daily update covering the important developments across markets.',
      subtitle: 'Know what matters in the markets, every market day.',
      description:
        'Get a concise daily brief covering the important market developments, news and events that matter to investors and finance learners.',
      badge: 'EVERY MARKET DAY',
      bullets: [
        'Major market movements',
        'Important company developments',
        'Sector updates',
        'Global & macro developments',
        'Important financial news',
        'Key events and developments to watch',
      ],
    },
    orderedBenefits: [
      {
        index: '01',
        title: 'Daily Market Brief',
        description:
          'A concise daily update covering the important developments across markets.',
        badge: 'EVERY MARKET DAY',
        anchor: '#daily-market-brief',
      },
      {
        index: '02',
        title: 'IPO Research & Discussion',
        description:
          'Basic IPO checking for everyone, with more detailed IPO analysis available to community members.',
        badge: 'FREE & PREMIUM',
        anchor: '#tools',
      },
      {
        index: '03',
        title: 'Market Discussions',
        description:
          'Discuss market movements, companies, sectors and important financial developments.',
        badge: 'ONGOING',
        anchor: '#discussions',
      },
      {
        index: '04',
        title: 'Finance Learning',
        description:
          'Books, movies, articles, assignments and other curated finance resources.',
        badge: 'CURATED LIBRARY',
        anchor: '#resources',
      },
      {
        index: '05',
        title: 'Certification & Practice Tools',
        description:
          'NISM practice tools and other finance learning resources.',
        badge: 'PRACTICE SUITE',
        anchor: '#tools',
      },
      {
        index: '06',
        title: 'Finance-Focused Community',
        description:
          'Connect with people interested in CFA, equity research, markets, valuation and finance careers.',
        badge: 'PEER NETWORK',
        anchor: '#community',
      },
    ],
    ipoCard: {
      index: '02',
      category: 'IPO RESEARCH & DISCUSSION',
      title: 'IPO Research & Discussion',
      summary:
        'Basic IPO checking for everyone, with more detailed IPO analysis available to community members.',
      description:
        'Research upcoming IPOs, understand the key factors and discuss them with other members.',
      freeButtonText: 'TRY FREE IPO CHECK',
      freeButtonUrl: FREE_IPO_TOOL_URL,
      premiumButtonText: 'PREMIUM — COMMUNITY ACCESS',
      premiumButtonUrl: PREMIUM_IPO_TOOL_URL,
    },
  },

  // 7. EXPANDABLE / ADDABLE CERTIFICATION & PRACTICE TOOLS
  // Add more certification objects here or change status from 'COMING SOON' to 'AVAILABLE'.
  nismCertifications: [
    {
      id: 'nism-xv',
      code: 'TOOL 02',
      title: 'NISM XV — RESEARCH ANALYST',
      shortName: 'NISM XV — RESEARCH ANALYST',
      status: 'AVAILABLE',
      badge: 'AVAILABLE NOW',
      comparisonBadge: '40 FREE → 80 COMMUNITY',
      description: 'Test your Research Analyst knowledge with practice MCQs.',
      freeTierLabel: '40 FREE',
      communityTierLabel: '80 COMMUNITY',
      freeCtaText: 'TRY 40 FREE MCQs',
      freeUrl: FREE_NISM_XV_URL,
    },
    {
      id: 'nism-viii',
      code: 'TOOL 03',
      title: 'NISM VIII — EQUITY DERIVATIVES',
      shortName: 'NISM VIII — EQUITY DERIVATIVES',
      status: 'COMING SOON',
      badge: 'COMING SOON',
      description:
        'Practice resources for NISM Series VIII: Equity Derivatives.',
    },
    {
      id: 'nism-commodity',
      code: 'TOOL 04',
      title: 'COMMODITY DERIVATIVES',
      shortName: 'COMMODITY DERIVATIVES',
      status: 'COMING SOON',
      badge: 'COMING SOON',
      description: 'Practice resources for NISM Commodity Derivatives.',
    },
  ] as NismCertificationModule[],

  // 8. MARKET DISCUSSIONS SECTION
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

  // 9. LEARNING RESOURCES SECTION
  learningResources: {
    heading: 'Curated resources for finance learners.',
    subheading:
      'Books, movies, articles, assignments and other curated finance resources.',
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

  // 10. FINANCE-FOCUSED COMMUNITY SECTION (4 CARDS)
  communitySection: {
    kicker: 'FINANCE-FOCUSED COMMUNITY',
    heading: 'Finance-Focused Community',
    subtitle: 'Learn with people who are serious about finance.',
    text: 'The community brings together people at different stages of their finance journey.',
    memberStages: [
      {
        id: 'cfa-aspirants',
        index: '01',
        title: 'CFA Aspirants',
        description:
          'People preparing for CFA and other finance certifications.',
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
          'People interested in financial statements, valuation and company analysis.',
      },
      {
        id: 'market-enthusiasts',
        index: '04',
        title: 'Market Enthusiasts',
        description: 'People interested in markets, trading and investing.',
      },
    ] as CommunityMemberStage[],
    closingStatement:
      'Discuss concepts, share resources, ask questions and learn from different perspectives.',
  },

  // 11. FREE VS COMMUNITY COMPARISON
  comparison: {
    heading: "What's free. What's inside the community.",
    freeTier: {
      title: 'FREE',
      priceLabel: '₹0',
      features: [
        'Basic IPO Check',
        '40 NISM XV MCQs',
        'Selected finance resources',
        'Public educational content',
      ],
    },
    communityTier: {
      title: 'COMMUNITY — ₹199/MONTH',
      badge: 'MEMBERS GET MORE',
      priceLabel: '₹199 / month',
      highlightedFeature: 'Daily Market Brief',
      features: [
        'Daily Market Brief',
        'Premium IPO Analysis',
        '80 NISM XV MCQs',
        'Future NISM Practice Tools',
        'IPO Discussions',
        'Market Discussions',
        'Company & Sector Discussions',
        'Finance Assignments',
        'Curated Books & Movies',
        'Articles & Research Resources',
        'Private Community',
        'CFA Learners & CFA Level 1 Cleared Members',
      ],
    },
  },

  // 12. TOOLS SECTION
  toolsSection: {
    heading: 'Tools built for finance learners.',
    basicIpoTool: {
      code: 'TOOL 01',
      title: 'BASIC IPO CHECK',
      badge: 'FREE',
      description:
        'Basic IPO checking for everyone, with more detailed IPO analysis available to community members.',
      buttonText: 'TRY FREE IPO CHECK',
      url: FREE_IPO_TOOL_URL,
      premiumTitle: 'Premium IPO Analysis',
      premiumBadge: 'COMMUNITY',
      premiumDescription:
        'More detailed IPO analysis and member-only functionality.',
      premiumButtonText: 'COMMUNITY ACCESS',
      premiumUrl: PREMIUM_IPO_TOOL_URL,
    },
  },

  // 13. WHO IS THIS FOR?
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

  // 14. INSIDE THE COMMUNITY ("What happens inside the community?")
  whatHappensInside: {
    heading: 'What happens inside the community?',
    subheading:
      'Ongoing market briefs, active discussions, learning material and practice tools.',
    items: [
      {
        id: 'every-market-day',
        kicker: 'EVERY MARKET DAY',
        title: 'Daily Market Brief',
        description:
          'A concise summary of the important developments across markets.',
        featured: true,
      },
      {
        id: 'when-ipos-in-focus',
        kicker: 'WHEN IPOs ARE IN FOCUS',
        title: 'IPO Discussion',
        description:
          'Discuss upcoming IPOs and important factors to understand.',
        featured: false,
      },
      {
        id: 'throughout-the-week',
        kicker: 'THROUGHOUT THE WEEK',
        title: 'Market Discussion',
        description:
          'Discuss companies, sectors, markets and financial developments.',
        featured: false,
      },
      {
        id: 'learning',
        kicker: 'LEARNING',
        title: 'Resources & Assignments',
        description:
          'Books, articles, movies, research material and practical assignments.',
        featured: false,
      },
      {
        id: 'practice',
        kicker: 'PRACTICE',
        title: 'Finance & NISM Practice',
        description:
          'Practice questions and certification-related learning tools.',
        featured: false,
      },
      {
        id: 'community',
        kicker: 'COMMUNITY',
        title: 'Ask. Discuss. Learn.',
        description:
          'Interact with other people interested in finance and markets.',
        featured: false,
      },
    ],
  },

  // 15. PRICING CARD SECTION
  pricingSection: {
    heading: 'Finance With Dev Community',
    price: '₹199 / month',
    ctaText: 'JOIN THE COMMUNITY',
    checklist: [
      'Daily Market Brief',
      'Premium IPO Analysis',
      'Market & IPO Discussions',
      'Finance Resources',
      'Assignments',
      'NISM & Finance Practice Tools',
      'Private Community',
      'CFA & Finance-Focused Members',
    ],
  },

  // 16. FAQ ACCORDION
  faqSection: {
    heading: 'Frequently asked questions',
    items: [
      {
        id: 'faq-1',
        question: 'What do I get for ₹199/month?',
        answer:
          'You get access to the Finance With Dev Community, the Daily Market Brief every market day, member-only tools and resources, market and IPO discussions, finance assignments, NISM practice resources and other community benefits.',
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

  // 17. FINAL CTA MESSAGE
  finalCta: {
    headline: "Learn what's happening. Understand why it matters.",
    subheadline:
      'Get daily market briefs, research tools, learning resources and a finance-focused community for ₹199/month.',
    price: '₹199/month',
    buttonText: 'JOIN FINANCE WITH DEV — ₹199/MONTH',
    smallLine: 'Start learning. Start researching. Start discussing.',
  },
} as const;
