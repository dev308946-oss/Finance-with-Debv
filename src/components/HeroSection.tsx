import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper, BarChart3, BrainCircuit, TrendingUp } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface HeroSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
  onViewClosingBellSample: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPaymentLinkClick,
  onViewClosingBellSample,
}) => {
  const { hero } = SITE_CONFIG;

  return (
    <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC] bg-financial-grid py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#CBD5E1] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F172A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              <span className="font-mono-tabular tracking-wider uppercase">{hero.label}</span>
            </div>

            <h1
              className="mt-3.5 font-display text-[32px] font-bold leading-[1.12] tracking-[-0.025em] text-[#0F172A] sm:text-[42px] lg:text-[48px]"
              style={{ textWrap: 'balance' }}
            >
              {hero.headline}
            </h1>

            <p className="mt-3.5 max-w-xl text-[15px] leading-[1.6] text-[#475569] sm:text-[16px]">
              {hero.supportingText}
            </p>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-2 sm:mt-6">
              <span className="font-mono-tabular text-[28px] font-extrabold tracking-tight text-[#0F172A] sm:text-[34px]">
                {hero.price}
              </span>
              <span className="text-xs font-medium text-[#64748B]">
                cancel anytime · manual verification
              </span>
            </div>

            {/* Primary CTA + Secondary CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'hero_primary_cta')}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-6 py-3 text-[14px] font-bold tracking-tight text-white transition-all duration-150 hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
              >
                <span>{hero.primaryCta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              <a
                href="#free-tools"
                className="inline-flex min-h-[46px] items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white px-5 py-3 text-[14px] font-semibold text-[#334155] transition-colors duration-150 hover:bg-[#F1F5F9] hover:text-[#0F172A] whitespace-nowrap"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </motion.div>

          {/* Right Column: Real Products Overview Panel (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block lg:col-span-5"
          >
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 text-xs">
                <div>
                  <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#0F172A]">
                    REAL PRODUCTS &amp; COMMUNITY
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-[#334155]">
                    Built for Finance Learners &amp; Market Enthusiasts
                  </p>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-[#64748B]">
                  {hero.price}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Product 1: The Closing Bell */}
                <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-[#0F172A] shrink-0" />
                      <span className="text-[13px] font-bold text-[#0F172A]">
                        The Closing Bell
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] font-bold text-[#059669]">
                      EVERY MARKET DAY
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#64748B]">
                    End-of-day market brief covering indices, session action, FII/DII flows, India &amp; global cues, and options desk levels.
                  </p>
                  <button
                    type="button"
                    onClick={onViewClosingBellSample}
                    className="mt-2 text-[12px] font-semibold text-[#0F172A] hover:underline underline-offset-4"
                  >
                    Preview Sample Report →
                  </button>
                </div>

                {/* Product 2: IPO Check */}
                <div className="flex items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-4 w-4 text-[#0F172A] shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        IPO Check
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        Basic IPO Analysis &amp; Comparison
                      </p>
                    </div>
                  </div>
                  <a
                    href={SITE_CONFIG.links.FREE_IPO_TOOL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular text-[11px] font-bold text-[#059669] hover:underline whitespace-nowrap"
                  >
                    TRY FREE ↗
                  </a>
                </div>

                {/* Product 3: NISM Series XV */}
                <div className="flex items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit className="h-4 w-4 text-[#0F172A] shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        NISM Series XV — Research Analyst Practice
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        Practice with 40 free MCQs
                      </p>
                    </div>
                  </div>
                  <a
                    href={SITE_CONFIG.links.FREE_NISM_XV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular text-[11px] font-bold text-[#059669] hover:underline whitespace-nowrap"
                  >
                    TRY FREE ↗
                  </a>
                </div>

                {/* Product 4: NISM Series VIII */}
                <div className="flex items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="h-4 w-4 text-[#0F172A] shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        NISM Series VIII — Equity Derivatives Practice
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        Practice with 40 free MCQs
                      </p>
                    </div>
                  </div>
                  <a
                    href={SITE_CONFIG.links.FREE_NISM_VIII_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular text-[11px] font-bold text-[#059669] hover:underline whitespace-nowrap"
                  >
                    TRY FREE ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
