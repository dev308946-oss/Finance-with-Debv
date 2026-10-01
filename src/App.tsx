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
import { ComparisonSection } from './components/ComparisonSection';
import { InsideCommunitySection } from './components/InsideCommunitySection';
import { DiscussionsAndResourcesSection } from './components/DiscussionsAndResourcesSection';
import { ContributorsSection } from './components/ContributorsSection';
import { ToolsSection } from './components/ToolsSection';
import { AudienceAndNoteSection } from './components/AudienceAndNoteSection';
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

      {/* Main Content Flow */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onPaymentLinkClick={handlePaymentLinkClick}
          onPremiumIpoClick={handlePremiumIpoClick}
        />

        {/* 2. What's Inside the Community (Daily Market Brief + 01–06 Ordered Benefits) */}
        <BenefitsSection onPremiumIpoClick={handlePremiumIpoClick} />

        {/* 3. Free vs Community Comparison */}
        <ComparisonSection onPaymentLinkClick={handlePaymentLinkClick} />

        {/* 4. What Happens Inside the Community? (Ongoing Activity Feed) */}
        <InsideCommunitySection />

        {/* 5. Market Discussions & Curated Learning Resources */}
        <DiscussionsAndResourcesSection />

        {/* 6. Finance-Focused Community (4 Member Stage Cards) */}
        <ContributorsSection />

        {/* 7. Tools (Basic IPO Check + Expandable NISM Certification Suite) */}
        <ToolsSection onPremiumIpoClick={handlePremiumIpoClick} />

        {/* 8. Who Should Join? */}
        <AudienceAndNoteSection />

        {/* 9. Pricing Card */}
        <PricingSection onPaymentLinkClick={handlePaymentLinkClick} />

        {/* 10. FAQ + Final Message CTA + Sticky Mobile Bottom CTA */}
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
