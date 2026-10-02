import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowUpRight, ExternalLink, Copy } from 'lucide-react';
import { SITE_CONFIG, OFFICIAL_UPI_ID } from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

interface PricingSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onPaymentLinkClick,
}) => {
  const { pricingSection, pricing, founderSection, links } = SITE_CONFIG;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUpi = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(OFFICIAL_UPI_ID).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <>
      {/* SECTION 6 — TRY BEFORE YOU JOIN + FOCAL PRICING CARD (#0A1018) */}
      <section
        id="pricing"
        className="scroll-mt-16 border-b border-[#1B2735] bg-[#0A1018] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          {/* COMPACT "TRY BEFORE YOU JOIN" BAR IMMEDIATELY BEFORE PRICING */}
          <motion.div
            id="try-before-you-join"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-10 max-w-2xl rounded-[16px] border border-[#1B2735] bg-[#0D141D] p-6 sm:p-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2]">
                  TRY BEFORE YOU JOIN
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-[#8D99A8]">
                  Explore some of the Finance With Dev tools for free before becoming a member.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:shrink-0">
                <a
                  href={links.FREE_IPO_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(SITE_CONFIG.analytics.events.ipoToolClick, {
                      url: links.FREE_IPO_TOOL_URL,
                    })
                  }
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-[10px] border border-[#1B2735] bg-[#070B12] px-4 py-2 text-xs font-semibold text-[#F5F7FA] transition-colors hover:border-[#19D3A2]/50 hover:text-[#19D3A2] whitespace-nowrap"
                >
                  <span>TRY IPO CHECK</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>

                <a
                  href={links.FREE_NISM_XV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(SITE_CONFIG.analytics.events.nismTestClick, {
                      url: links.FREE_NISM_XV_URL,
                      tool: 'nism_xv',
                    })
                  }
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-[10px] border border-[#1B2735] bg-[#070B12] px-4 py-2 text-xs font-semibold text-[#F5F7FA] transition-colors hover:border-[#19D3A2]/50 hover:text-[#19D3A2] whitespace-nowrap"
                >
                  <span>TRY 40 FREE NISM XV MCQs</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>

                <a
                  href={links.FREE_NISM_VIII_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(SITE_CONFIG.analytics.events.nismTestClick, {
                      url: links.FREE_NISM_VIII_URL,
                      tool: 'nism_viii',
                    })
                  }
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-[10px] border border-[#1B2735] bg-[#070B12] px-4 py-2 text-xs font-semibold text-[#F5F7FA] transition-colors hover:border-[#19D3A2]/50 hover:text-[#19D3A2] whitespace-nowrap"
                >
                  <span>TRY 40 FREE NISM VIII MCQs</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </div>

            {/* Natural transition prompt */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#1B2735] pt-4 text-xs">
              <span className="font-medium text-[#F5F7FA]">
                Want the full experience?
              </span>
              <span className="font-mono-tabular font-semibold text-[#19D3A2]">
                ₹199/month ↓
              </span>
            </div>
          </motion.div>

          {/* FOCAL PRICING CARD */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45 }}
            className="relative mx-auto max-w-xl rounded-[18px] border border-[#19D3A2]/45 bg-[#101925] p-7 shadow-[0_0_55px_rgba(25,211,162,0.08)] sm:p-10"
          >
            {/* Title */}
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#19D3A2] sm:text-[12px]">
              {pricingSection.heading}
            </p>

            {/* Strong White Price (Most Visually Important Element) */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono-tabular text-[38px] font-extrabold tracking-tight text-[#F5F7FA] sm:text-[48px]">
                {pricingSection.price}
              </span>
            </div>

            {/* Supporting Line */}
            <p className="mt-2.5 border-b border-[#1B2735] pb-6 text-[15px] leading-[1.6] text-[#8D99A8]">
              {pricingSection.supportingLine}
            </p>

            {/* Concise 6-Item Benefits List */}
            <ul className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {pricingSection.checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] font-medium text-[#F5F7FA]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#19D3A2]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Official UPI Payment Box */}
            <div className="mt-7 rounded-[14px] border border-[#1B2735] bg-[#070B12] p-4">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono-tabular text-[10px] font-semibold tracking-wider uppercase text-[#8D99A8]">
                    OFFICIAL COMMUNITY UPI ID
                  </p>
                  <p className="mt-0.5 font-mono-tabular text-[15px] font-bold text-[#F5F7FA] select-all">
                    {OFFICIAL_UPI_ID}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-[10px] px-3 py-1.5 text-xs font-bold transition-all duration-150 shrink-0 ${
                    isCopied
                      ? 'bg-[#19D3A2] text-[#070B12]'
                      : 'border border-[#19D3A2]/40 bg-[#19D3A2]/10 text-[#19D3A2] hover:bg-[#16E0A5] hover:text-[#070B12]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>COPIED ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPY UPI ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-[#1B2735] pt-2 text-[11px] text-[#8D99A8]">
                <span>Amount: <strong className="text-[#F5F7FA]">₹199</strong></span>
                <span>Manual Verification</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="mt-6">
              <a
                href={links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'pricing_card_cta')}
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#16E0A5] px-6 py-3.5 text-[14px] font-bold tracking-tight text-[#070B12] shadow-[0_0_26px_rgba(22,224,165,0.18)] transition-all duration-150 hover:bg-[#19D3A2] hover:shadow-[0_0_32px_rgba(22,224,165,0.28)] active:scale-[0.99] whitespace-nowrap sm:text-[15px]"
              >
                <span>{pricingSection.ctaText}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              {/* Non-Refundable Policy Lines (Clearly Visible & Understated) */}
              <div className="mt-5 space-y-1.5 border-t border-[#1B2735] pt-4 text-[12px] leading-relaxed text-[#8D99A8]">
                <p>{pricing.nonRefundableNotePrimary}</p>
                <p>{pricing.nonRefundableNoteSecondary}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 — WHO'S BEHIND FINANCE WITH DEV (#070B12) */}
      <section
        id="about"
        className="scroll-mt-16 border-b border-[#1B2735] bg-[#070B12] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start gap-6 rounded-[18px] border border-[#1B2735] bg-[#0D141D] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.24)] sm:flex-row sm:items-center sm:gap-8 sm:p-8"
          >
            {links.FOUNDER_PHOTO_URL ? (
              <img
                src={links.FOUNDER_PHOTO_URL}
                alt="Dev — Finance With Dev"
                referrerPolicy="no-referrer"
                className="h-20 w-20 shrink-0 rounded-[16px] border border-[#19D3A2]/35 object-cover sm:h-24 sm:w-24"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[16px] border border-[#19D3A2]/35 bg-[#0A1018] font-mono-tabular sm:h-24 sm:w-24"
              >
                <span className="text-lg font-extrabold tracking-wider text-[#F5F7FA]">
                  DEV
                </span>
                <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-[#19D3A2]">
                  FWD
                </span>
              </div>
            )}

            <div>
              <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2]">
                ABOUT
              </p>
              <h2 className="mt-1.5 font-display text-[22px] font-bold tracking-[-0.015em] text-[#F5F7FA] sm:text-[26px]">
                {founderSection.heading}
              </h2>
              <div className="mt-3 space-y-2.5 text-[15px] leading-[1.65] text-[#8D99A8]">
                {founderSection.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
