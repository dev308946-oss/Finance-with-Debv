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
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-[#0F172A] sm:text-lg whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F172A]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#0F172A] text-white font-mono-tabular text-xs font-bold">
            FD
          </div>
          <span>{SITE_CONFIG.brand.name}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#475569]"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.label)}
              className="py-1 transition-colors duration-150 hover:text-[#0F172A] whitespace-nowrap"
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
            className="inline-flex min-h-[38px] items-center justify-center rounded-[8px] bg-[#0F172A] px-4 py-2 text-xs font-semibold tracking-tight text-white transition-all duration-150 hover:bg-[#1E293B] whitespace-nowrap shrink-0 sm:text-[13px]"
          >
            {SITE_CONFIG.pricing.navCtaText}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white text-[#0F172A] transition-colors hover:bg-[#F8FAFC] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-4 py-3 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="flex min-h-[40px] items-center justify-between rounded-[6px] px-3 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              >
                <span>{item.label}</span>
                <span className="font-mono-tabular text-xs text-[#94A3B8]">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
