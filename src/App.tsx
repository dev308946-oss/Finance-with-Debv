/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SITE_CONFIG } from './config/siteConfig';
import { trackEvent } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ToolsSection } from './components/ToolsSection';
import { BenefitsSection } from './components/BenefitsSection';
import { ContributorsSection } from './components/ContributorsSection';
import { PricingSection } from './components/PricingSection';
import { FaqAndFinalCtaSection } from './components/FaqAndFinalCtaSection';
import { InteractiveModals, ModalType } from './components/InteractiveModals';

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handlePaymentLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    source: string
  ) => {
    e.preventDefault();
    trackEvent(SITE_CONFIG.analytics.events.joinCtaClick, {
      source,
      price: SITE_CONFIG.pricing.amount,
      paymentUrl: SITE_CONFIG.links.PAYMENT_URL,
    });
    setActiveModal({ type: 'payment' });
  };

  const handleViewClosingBellSample = () => {
    setActiveModal({ type: 'closing_bell_sample' });
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0F172A] selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar onPaymentLinkClick={handlePaymentLinkClick} />

      {/* 9-Section Conversion Hierarchy */}
      <main>
        {/* 1. HERO */}
        <HeroSection
          onPaymentLinkClick={handlePaymentLinkClick}
          onViewClosingBellSample={handleViewClosingBellSample}
        />

        {/* 2. WHAT YOU ACTUALLY GET — REAL PRODUCTS (The Closing Bell, IPO Check, NISM Series XV) */}
        <ToolsSection onViewClosingBellSample={handleViewClosingBellSample} />

        {/* 3. WHAT'S INCLUDED IN THE COMMUNITY (6 Concise Cards) */}
        <BenefitsSection />

        {/* 4. WHO YOU'LL FIND INSIDE & 5. HOW JOINING WORKS */}
        <ContributorsSection />

        {/* 6. PRICING & 7. WHO'S BEHIND FINANCE WITH DEV */}
        <PricingSection onPaymentLinkClick={handlePaymentLinkClick} />

        {/* 8. FAQ & 9. FINAL CTA + STICKY MOBILE CTA */}
        <FaqAndFinalCtaSection
          onPaymentLinkClick={handlePaymentLinkClick}
          onSocialOrCommunityClick={handleSocialOrCommunityClick}
        />
      </main>

      {/* Modals: Manual Payment Checkout & The Closing Bell Sample Preview */}
      <InteractiveModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenPaymentModal={() => setActiveModal({ type: 'payment' })}
      />
    </div>
  );
}
