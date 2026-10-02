import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper, BarChart3, BrainCircuit } from 'lucide-react';
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
    <section className="relative overflow-hidden border-b border-[#1B2735] bg-[#070B12] bg-hero-grid py-14 sm:py-20 lg:py-24">
      {/* Understated top ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[420px] w-full max-w-[1040px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(25,211,162,0.08),transparent_68%)]"
      />

      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] text-[#19D3A2] sm:text-[12px]">
              {hero.label}
            </p>

            <h1
              className="mt-3.5 font-display text-[35px] font-bold leading-[1.08] tracking-[-0.025em] text-[#F5F7FA] sm:text-[46px] lg:text-[54px]"
              style={{ textWrap: 'balance' }}
            >
              {hero.headline}
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-[#8D99A8] sm:mt-5 sm:text-[17px]">
              {hero.supportingText}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3 sm:mt-7">
              <span className="font-mono-tabular text-[30px] font-bold tracking-tight text-[#F5F7FA] sm:text-[38px]">
                {hero.price}
              </span>
            </div>

            {/* Primary CTA with subtle radial green glow behind it + Secondary CTA */}
            <div className="relative mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -left-4 -z-10 h-24 w-64 rounded-full bg-[#16E0A5]/[0.14] blur-2xl"
              />

              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'hero_primary_cta')}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[14px] bg-[#16E0A5] px-7 py-3.5 text-[14px] font-bold tracking-tight text-[#070B12] shadow-[0_0_28px_rgba(22,224,165,0.18)] transition-all duration-200 hover:bg-[#19D3A2] hover:shadow-[0_0_36px_rgba(22,224,165,0.28)] active:scale-[0.99] whitespace-nowrap sm:text-[15px]"
              >
                <span>{hero.primaryCta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              <a
                href="#real-products"
                className="inline-flex min-h-[48px] items-center justify-center rounded-[14px] border border-[#1B2735] bg-[#0D141D] px-5 py-3 text-[14px] font-semibold text-[#F5F7FA] transition-colors duration-150 hover:border-[#2A3C52] hover:bg-[#111A26] whitespace-nowrap"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </motion.div>

          {/* Right Column: Real Products Overview Panel (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block lg:col-span-5"
          >
            <div className="rounded-[18px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-[#1B2735] pb-4">
                <div>
                  <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.12em] text-[#19D3A2]">
                    REAL PRODUCTS &amp; COMMUNITY
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-[#F5F7FA]">
                    Built for Finance Learners &amp; Market Enthusiasts
                  </p>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-[#8D99A8]">
                  {hero.price}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Product 1: The Closing Bell */}
                <div className="rounded-[14px] border border-[#19D3A2]/35 bg-[#0A1018] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Newspaper className="h-4 w-4 text-[#19D3A2] shrink-0" />
                      <span className="font-display text-[14px] font-bold text-[#F5F7FA]">
                        The Closing Bell
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] font-semibold tracking-wider text-[#19D3A2]">
                      EVERY MARKET DAY
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#8D99A8]">
                    End-of-day market brief covering indices, session action, FII/DII flows, India &amp; global cues, and options desk levels.
                  </p>
                  <button
                    type="button"
                    onClick={onViewClosingBellSample}
                    className="mt-2.5 text-[12px] font-semibold text-[#19D3A2] hover:underline underline-offset-4"
                  >
                    Preview Sample Report →
                  </button>
                </div>

                {/* Product 2: IPO Check */}
                <div className="flex items-center justify-between rounded-[14px] border border-[#1B2735] bg-[#0A1018] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-[#19D3A2] shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#F5F7FA]">
                        IPO Check
                      </p>
                      <p className="text-[11px] text-[#8D99A8]">
                        Basic IPO analysis &amp; comparison tool
                      </p>
                    </div>
                  </div>
                  <a
                    href={SITE_CONFIG.links.FREE_IPO_TOOL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular text-[11px] font-semibold text-[#19D3A2] hover:underline whitespace-nowrap"
                  >
                    TRY FREE ↗
                  </a>
                </div>

                {/* Product 3: NISM Series XV */}
                <div className="flex items-center justify-between rounded-[14px] border border-[#1B2735] bg-[#0A1018] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="h-4 w-4 text-[#19D3A2] shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#F5F7FA]">
                        NISM Series XV — Research Analyst Practice
                      </p>
                      <p className="text-[11px] text-[#8D99A8]">
                        Practice with 40 free MCQs
                      </p>
                    </div>
                  </div>
                  <a
                    href={SITE_CONFIG.links.FREE_NISM_XV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular text-[11px] font-semibold text-[#19D3A2] hover:underline whitespace-nowrap"
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
