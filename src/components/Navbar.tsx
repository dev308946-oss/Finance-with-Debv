import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

interface NavbarProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPaymentLinkClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Products', href: '#real-products' },
    { label: 'Community', href: '#benefits' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (label: string) => {
    trackEvent(SITE_CONFIG.analytics.events.navSectionClick, { section: label });
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-30 border-b border-[#1B2735] bg-[#070B12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <a
          href="#"
          className="font-display text-base font-bold tracking-tight text-[#F5F7FA] sm:text-lg whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#19D3A2]"
        >
          {SITE_CONFIG.brand.name}
        </a>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#8D99A8]"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.label)}
              className="py-1 text-[#8D99A8] transition-colors duration-150 hover:text-[#F5F7FA] whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Primary Join Button + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href={SITE_CONFIG.links.PAYMENT_URL}
            onClick={(e) => onPaymentLinkClick(e, 'navbar_cta')}
            className="inline-flex min-h-[40px] items-center justify-center rounded-[12px] bg-[#16E0A5] px-4 py-2 text-xs font-bold tracking-tight text-[#070B12] shadow-[0_0_20px_rgba(22,224,165,0.14)] transition-all duration-150 hover:bg-[#19D3A2] hover:shadow-[0_0_24px_rgba(22,224,165,0.24)] whitespace-nowrap shrink-0 sm:text-[13px]"
          >
            {SITE_CONFIG.pricing.navCtaText}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-[12px] border border-[#1B2735] bg-[#0D141D] text-[#F5F7FA] transition-colors hover:border-[#2A3C52] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#1B2735] bg-[#0A1018] px-4 py-3 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="flex min-h-[44px] items-center justify-between rounded-[10px] px-3 py-2 text-sm font-medium text-[#F5F7FA] transition-colors hover:bg-[#0D141D] hover:text-[#19D3A2]"
              >
                <span>{item.label}</span>
                <span className="font-mono-tabular text-xs text-[#8D99A8]">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
