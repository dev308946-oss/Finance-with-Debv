import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface PricingSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onPaymentLinkClick,
}) => {
  const { pricingSection, pricing } = SITE_CONFIG;

  return (
    <section
      id="pricing"
      className="scroll-mt-16 border-b border-white/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border-2 border-emerald-500/50 bg-[#0C131C] p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono-tabular font-semibold tracking-wider text-emerald-400">
              MEMBERSHIP ACCESS
            </span>
            <span className="text-slate-400">{pricing.heroSmallText}</span>
          </div>

          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            {pricingSection.heading}
          </h2>

          {/* 8 Prominent Checklist Items */}
          <ul className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {pricingSection.checklist.map((item, idx) => (
              <li
                key={item}
                className={`flex items-start gap-3 text-sm ${
                  idx === 0
                    ? 'font-bold text-emerald-300'
                    : 'font-medium text-slate-100'
                }`}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="mt-7 flex items-baseline justify-between border-t border-white/[0.09] pt-6">
            <span className="font-mono-tabular text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {pricingSection.price}
            </span>
            <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
              EVERY MARKET DAY + FULL ACCESS
            </span>
          </div>

          {/* Primary CTA: JOIN THE COMMUNITY */}
          <div className="mt-6">
            <a
              href={SITE_CONFIG.links.PAYMENT_URL}
              onClick={(e) => onPaymentLinkClick(e, 'pricing_card_cta')}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold tracking-tight text-slate-950 shadow-lg shadow-emerald-500/15 transition-all duration-150 hover:bg-emerald-400 active:scale-[0.99] whitespace-nowrap sm:text-base"
            >
              <span>{pricingSection.ctaText}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
