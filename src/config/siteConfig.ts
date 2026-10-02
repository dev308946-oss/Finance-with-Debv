/**
 * ============================================================================
 * FINANCE WITH DEV COMMUNITY — CENTRAL CONFIGURATION
 * ============================================================================
 * Single source of truth for external links, manual payment verification
 * settings, pricing, real products, community benefits, and FAQ content.
 */

export const PAYMENT_LINK = 'YOUR_PAYMENT_LINK_HERE';
export const COMMUNITY_PRICE = '₹199';
export const MEMBERSHIP_DURATION = '1 Month';
export const ADMIN_EMAIL = 'YOUR_ADMIN_EMAIL_HERE';

export const FREE_NISM_XV_URL = 'https://nismxvresearchanalyst-4m18.vercel.app/';
export const FREE_IPO_TOOL_URL = 'https://ipo-check-financewithdev.ai.studio';
export const PREMIUM_IPO_TOOL_URL = 'YOUR_COMMUNITY_IPO_TOOL_LINK';
export const PAYMENT_URL = PAYMENT_LINK;
export const COMMUNITY_URL = 'YOUR_COMMUNITY_LINK_HERE';
export const INSTAGRAM_URL = 'YOUR_INSTAGRAM_LINK_HERE';

// Optional URL if you host the sample PDF file directly (e.g., '/the-closing-bell-sample.pdf')
// When set to a PDF URL, "VIEW SAMPLE" can also open/embed the PDF directly.
export const CLOSING_BELL_SAMPLE_PDF_URL = '';

// Optional founder photo URL (leave empty to show the clean monogram placeholder)
export const FOUNDER_PHOTO_URL = '';

export type MembershipSubmissionStatus =
  | 'Pending Verification'
  | 'Payment Verified'
  | 'Access Sent'
  | 'Rejected';

export interface BenefitCardItem {
  id: string;
  iconName: 'newspaper' | 'chart' | 'trending' | 'book' | 'brain' | 'users';
  title: string;
  description: string;
}

export interface CommunityMemberCard {
  id: string;
  iconName: 'graduation' | 'research' | 'market' | 'career';
  title: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_CONFIG = {
  // 1. CENTRAL CONFIGURATION & LINKS
  membershipConfig: {
    PAYMENT_LINK,
    COMMUNITY_PRICE,
    MEMBERSHIP_DURATION,
    ADMIN_EMAIL,
    statuses: [
      'Pending Verification',
      'Payment Verified',
      'Access Sent',
      'Rejected',
    ] as MembershipSubmissionStatus[],
  },

  links: {
    PAYMENT_LINK,
    FREE_NISM_XV_URL,
    FREE_IPO_TOOL_URL,
    PREMIUM_IPO_TOOL_URL,
    PAYMENT_URL,
    COMMUNITY_URL,
    INSTAGRAM_URL,
    CLOSING_BELL_SAMPLE_PDF_URL,
    FOUNDER_PHOTO_URL,
  },

  // 2. BRAND
  brand: {
    name: 'Finance With Dev',
    upperName: 'FINANCE WITH DEV',
    communityName: 'Finance With Dev Community',
    coreMessage: 'Learn. Research. Discuss. Grow.',
  },

  // 3. PRICING & CTAs
  pricing: {
    amount: COMMUNITY_PRICE,
    duration: MEMBERSHIP_DURATION,
    period: 'month',
    formattedPrice: `${COMMUNITY_PRICE} / month`,
    compactPrice: `${COMMUNITY_PRICE}/month`,
    heroPrimaryCta: 'JOIN THE COMMUNITY',
    heroSecondaryCta: 'EXPLORE FREE TOOLS',
    navCtaText: 'JOIN — ₹199',
    pricingCardCta: 'JOIN THE COMMUNITY — ₹199/MONTH',
    finalCtaButton: 'JOIN THE COMMUNITY',
    mobileStickyCta: '₹199/month   JOIN COMMUNITY',
    nonRefundableNotePrimary:
      'Please note: Membership payments are non-refundable once payment has been completed.',
    nonRefundableNoteSecondary:
      'By joining, you acknowledge that the membership payment is non-refundable.',
    finalCtaNonRefundable:
      'Membership payments are non-refundable once payment has been completed.',
  },

  // 4. ANALYTICS EVENTS
  analytics: {
    enabled: true,
    events: {
      joinCtaClick: 'cta_join_community_click',
      payButtonClick: 'checkout_pay_199_click',
      paymentSubmissionSuccess: 'checkout_payment_proof_submitted',
      closingBellSampleClick: 'product_closing_bell_sample_click',
      ipoToolClick: 'tool_ipo_click',
      nismTestClick: 'tool_nism_click',
      faqExpand: 'faq_question_expand',
      navSectionClick: 'navigation_section_click',
    },
  },

  // 5. SECTION 1 — HERO
  hero: {
    label: 'FINANCE WITH DEV',
    headline: 'Your daily finance & market community',
    supportingText:
      'Daily market briefs. Research tools. Finance resources. Market discussions.',
    price: '₹199/month',
    primaryCta: 'JOIN THE COMMUNITY',
    secondaryCta: 'EXPLORE FREE TOOLS',
  },

  // 6. SECTION 2 — WHAT YOU ACTUALLY GET (THREE REAL PRODUCTS)
  realProductsSection: {
    heading: 'What You Actually Get',
    subtitle:
      'Real tools and resources built for finance learners and market enthusiasts.',
    tryBeforeYouJoin: {
      badge: 'TRY BEFORE YOU JOIN',
      text: 'Explore our free tools before becoming a member.',
    },
    closingBell: {
      name: 'The Closing Bell',
      upperName: 'THE CLOSING BELL',
      tagline: 'Daily Market Brief — Every Market Day',
      documentSubtitle: 'A daily market brief for financewithdev.',
      description:
        'A concise end-of-day market brief covering the session, FII/DII activity, major India and global developments, options levels and key events to watch.',
      supportingCopy:
        'A concise end-of-day market brief covering the developments, market activity and events that matter.',
      ctaText: 'VIEW SAMPLE',
      sectionsCovered: [
        'Nifty, Sensex & Bank Nifty',
        'How the market session unfolded',
        'Key market takeaways',
        'FII/DII flows',
        'Major India stories',
        'Global market cues',
        'Options desk / support & resistance levels',
        'Management commentary',
        'Key events and developments to watch',
      ],
    },
    ipoCheck: {
      name: 'IPO Check',
      upperName: 'IPO CHECK',
      label: 'Free Tool',
      subtitle: 'Basic IPO Analysis & Comparison',
      description:
        'Explore IPO information and key factors before making your own decision.',
      communityNote: 'Premium IPO analysis available inside the community.',
      ctaText: 'TRY FREE',
      url: FREE_IPO_TOOL_URL,
    },
    nismSeriesXv: {
      name: 'NISM Series XV — Research Analyst Practice',
      upperName: 'NISM SERIES XV',
      label: 'Free Practice',
      subtitle: 'Research Analyst Practice',
      description: 'Practice with 40 free MCQs.',
      ctaText: 'TRY 40 FREE MCQs',
      url: FREE_NISM_XV_URL,
      upcomingTools: [
        {
          title: 'NISM Series VIII — Equity Derivatives',
          status: 'Coming Soon',
        },
        {
          title: 'NISM Commodity Derivatives',
          status: 'Coming Soon',
        },
      ],
    },
  },

  // 7. SECTION 3 — WHAT'S INCLUDED IN THE COMMUNITY (6 CONCISE CARDS)
  benefitsSection: {
    heading: 'More Than Just Tools',
    subheading:
      'A practical finance community built around learning, research and staying connected with the markets.',
    cards: [
      {
        id: 'daily-market-brief',
        iconName: 'newspaper',
        title: 'Daily Market Brief',
        description: 'The Closing Bell delivered every market day.',
      },
      {
        id: 'research-ipo-tools',
        iconName: 'chart',
        title: 'Research & IPO Tools',
        description: 'Tools to help you research markets and IPOs.',
      },
      {
        id: 'market-discussions',
        iconName: 'trending',
        title: 'Market Discussions',
        description:
          'Discuss companies, sectors, earnings and market developments.',
      },
      {
        id: 'finance-learning',
        iconName: 'book',
        title: 'Finance Learning',
        description:
          'Books, articles, assignments and useful finance resources.',
      },
      {
        id: 'certification-practice',
        iconName: 'brain',
        title: 'Certification Practice',
        description:
          'NISM practice tools and other finance learning resources.',
      },
      {
        id: 'finance-community',
        iconName: 'users',
        title: 'Finance Community',
        description:
          'Learn, discuss and share ideas with other people interested in finance.',
      },
    ] as BenefitCardItem[],
  },

  // 8. SECTION 4 — WHO YOU'LL FIND INSIDE (4 CATEGORIES)
  communitySection: {
    heading: 'Built for People Serious About Finance',
    supportingText:
      'Learn with people at different stages of their finance journey. Share resources, ask questions and discuss ideas.',
    cards: [
      {
        id: 'cfa-aspirants',
        iconName: 'graduation',
        title: 'CFA Aspirants & Finance Learners',
      },
      {
        id: 'equity-research-learners',
        iconName: 'research',
        title: 'Equity Research Learners',
      },
      {
        id: 'market-enthusiasts',
        iconName: 'market',
        title: 'Market Enthusiasts',
      },
      {
        id: 'finance-career-builders',
        iconName: 'career',
        title: 'Finance Career Builders',
      },
    ] as CommunityMemberCard[],
  },

  // 9. SECTION 5 — HOW JOINING WORKS (3 STEPS)
  howItWorksSection: {
    heading: 'How It Works',
    steps: [
      {
        number: '01',
        title: 'JOIN',
        description: 'Choose the ₹199/month membership.',
      },
      {
        number: '02',
        title: 'SUBMIT YOUR DETAILS',
        description:
          'Complete the payment and submit your transaction details for verification.',
      },
      {
        number: '03',
        title: 'GET ACCESS',
        description:
          'Once your payment is verified, your community access details will be shared with you.',
      },
    ] as HowItWorksStep[],
  },

  // 10. SECTION 6 — PRICING
  pricingSection: {
    heading: 'FINANCE WITH DEV COMMUNITY',
    price: '₹199 / month',
    supportingLine:
      'Practical finance resources, market briefs, tools and community access.',
    checklist: [
      'Daily Market Brief',
      'Premium IPO Analysis',
      'NISM Practice Tools',
      'Market & IPO Discussions',
      'Finance Resources & Assignments',
      'Private Finance Community',
    ],
    ctaText: 'JOIN THE COMMUNITY — ₹199/MONTH',
  },

  // 11. SECTION 7 — WHO'S BEHIND FINANCE WITH DEV
  founderSection: {
    heading: "Who's Behind Finance With Dev?",
    paragraphs: [
      "I'm Dev, a finance enthusiast focused on equity research, markets and practical finance education.",
      'Finance With Dev was created to bring useful market information, research tools, learning resources and finance discussions together in one place.',
    ],
  },

  // 12. SECTION 8 — FAQ (6 CONCISE QUESTIONS)
  faqSection: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        id: 'faq-1',
        question: 'What do I get for ₹199/month?',
        answer:
          'Access to the Finance With Dev community, The Closing Bell daily market brief, premium IPO analysis, NISM practice tools, finance resources, assignments and market discussions.',
      },
      {
        id: 'faq-2',
        question: 'What is The Closing Bell?',
        answer:
          'The Closing Bell is a daily end-of-day market brief covering market performance, FII/DII activity, important India and global developments, options levels and key events to watch.',
      },
      {
        id: 'faq-3',
        question: 'Can I try anything before joining?',
        answer:
          'Yes. You can try the IPO Check tool and the 40 free NISM Series XV Research Analyst practice questions.',
      },
      {
        id: 'faq-4',
        question: 'Is this investment advice?',
        answer:
          'No. Finance With Dev is intended for finance education, information and discussion. Content should not be treated as personalized investment advice.',
      },
      {
        id: 'faq-5',
        question: 'How do I get access after payment?',
        answer:
          'After payment, submit your payment/transaction details. Your payment will be manually verified and community access details will then be shared with you.',
      },
      {
        id: 'faq-6',
        question: 'Can I get a refund after joining?',
        answer:
          'No. Membership payments are non-refundable once payment has been completed. Please review the available information and free tools before joining.',
      },
    ] as FAQItem[],
  },

  // 13. SECTION 9 — FINAL CTA
  finalCta: {
    headline: 'Stay Connected With Finance.',
    subheadline:
      'Market briefs. Research tools. Finance learning. One community.',
    price: '₹199/month',
    buttonText: 'JOIN THE COMMUNITY',
    smallText:
      'Membership payments are non-refundable once payment has been completed.',
  },
} as const;
