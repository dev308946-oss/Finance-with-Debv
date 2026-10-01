/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SITE_CONFIG } from './config/siteConfig';
import { trackEvent } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { DiscussionsAndResourcesSection } from './components/DiscussionsAndResourcesSection';
import { ContributorsSection } from './components/ContributorsSection';
import { ComparisonSection } from './components/ComparisonSection';
import { ToolsSection } from './components/ToolsSection';
import { AudienceAndNoteSection } from './components/AudienceAndNoteSection';
import { InsideCommunitySection } from './components/InsideCommunitySection';
import { PricingSection } from './components/PricingSection';
import { FaqAndFinalCtaSection } from './components/FaqAndFinalCtaSection';
import { InteractiveModals, ModalType } from './components/InteractiveModals';

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handlePaymentLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    source: string
  ) => {
    trackEvent(SITE_CONFIG.analytics.events.joinCtaClick, {
      source,
      price: SITE_CONFIG.pricing.amount,
      paymentUrl: SITE_CONFIG.links.PAYMENT_URL,
    });

    if (SITE_CONFIG.links.PAYMENT_URL.startsWith('YOUR_')) {
      e.preventDefault();
      setActiveModal({ type: 'payment' });
    }
  };

  const handlePremiumIpoClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    source: string
  ) => {
    trackEvent(SITE_CONFIG.analytics.events.ipoToolClick, {
      source,
      tier: 'premium_community',
      url: SITE_CONFIG.links.PREMIUM_IPO_TOOL_URL,
    });

    if (SITE_CONFIG.links.PREMIUM_IPO_TOOL_URL.startsWith('YOUR_')) {
      e.preventDefault();
      setActiveModal({ type: 'premium_ipo' });
    }
  };

  const handleSocialOrCommunityClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    keyName: string
  ) => {
    if (url.startsWith('YOUR_')) {
      e.preventDefault();
      setActiveModal({
        type: 'placeholder_link',
        keyName,
        placeholderValue: url,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0E] text-[#F8FAFC] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Navigation */}
      <Navbar onPaymentLinkClick={handlePaymentLinkClick} />

      {/* 12-Section Conversion Flow */}
      <main>
        {/* SECTION 1 — HERO SECTION */}
        <HeroSection
          onPaymentLinkClick={handlePaymentLinkClick}
          onPremiumIpoClick={handlePremiumIpoClick}
        />

        {/* SECTION 2 — WHAT IS INSIDE? (6 Cards + Expandable Multi-NISM Prep) */}
        <BenefitsSection onPremiumIpoClick={handlePremiumIpoClick} />

        {/* SECTION 3 — MARKET DISCUSSIONS & SECTION 4 — LEARNING RESOURCES */}
        <DiscussionsAndResourcesSection />

        {/* SECTION 5 — COMMUNITY & CFA LEVEL 1 CONTRIBUTORS */}
        <ContributorsSection />

        {/* SECTION 6 — FREE VS COMMUNITY COMPARISON */}
        <ComparisonSection onPaymentLinkClick={handlePaymentLinkClick} />

        {/* SECTION 7 — TOOLS (TOOL 01 TO TOOL 04) */}
        <ToolsSection onPremiumIpoClick={handlePremiumIpoClick} />

        {/* SECTION 8 — WHO IS THIS FOR? */}
        <AudienceAndNoteSection />

        {/* SECTION 9 — WHAT YOU CAN EXPECT (WHAT HAPPENS INSIDE?) */}
        <InsideCommunitySection />

        {/* SECTION 10 — PRICING */}
        <PricingSection onPaymentLinkClick={handlePaymentLinkClick} />

        {/* SECTION 11 — FAQ & SECTION 12 — FINAL CTA + STICKY MOBILE BAR */}
        <FaqAndFinalCtaSection
          onPaymentLinkClick={handlePaymentLinkClick}
          onSocialOrCommunityClick={handleSocialOrCommunityClick}
        />
      </main>

      {/* Modal Handler for Unconfigured Placeholder Links */}
      <InteractiveModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenPaymentModal={() => setActiveModal({ type: 'payment' })}
      />
    </div>
  );
}
