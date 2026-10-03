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
      {/* SECTION 6 — TRY BEFORE YOU JOIN + FOCAL PRICING CARD */}
      <section
        id="pricing"
        className="scroll-mt-16 border-b border-[#E2E8F0] bg-white py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          {/* COMPACT "TRY BEFORE YOU JOIN" BAR IMMEDIATELY BEFORE PRICING */}
          <motion.div
            id="try-before-you-join"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-10 max-w-2xl rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669]">
                  TRY BEFORE YOU JOIN
                </p>
                <p className="mt-1 text-[14px] leading-[1.6] text-[#475569]">
                  Explore some of the Finance With Dev tools for free before becoming a member.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:shrink-0">
                <a
                  href={links.FREE_IPO_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(SITE_CONFIG.analytics.events.ipoToolClick, {
                      url: links.FREE_IPO_TOOL_URL,
                    })
                  }
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[6px] border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9] whitespace-nowrap shadow-xs"
                >
                  <span>TRY IPO CHECK</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
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
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[6px] border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9] whitespace-nowrap shadow-xs"
                >
                  <span>TRY 40 FREE NISM XV MCQs</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
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
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[6px] border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#F1F5F9] whitespace-nowrap shadow-xs"
                >
                  <span>TRY 40 FREE NISM VIII MCQs</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Natural transition prompt */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3 text-xs">
              <span className="font-medium text-[#475569]">
                Want the full experience?
              </span>
              <span className="font-mono-tabular font-bold text-[#059669]">
                ₹199/month ↓
              </span>
            </div>
          </motion.div>

          {/* Focal Membership Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="relative mx-auto max-w-xl rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] p-6 shadow-sm sm:p-8"
          >
            {/* Title */}
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
              {pricingSection.heading}
            </p>

            {/* Price */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-mono-tabular text-[34px] font-extrabold tracking-tight text-[#0F172A] sm:text-[40px]">
                {pricingSection.price}
              </span>
            </div>

            {/* Supporting Line */}
            <p className="mt-1.5 border-b border-[#E2E8F0] pb-5 text-[14px] leading-[1.6] text-[#475569]">
              {pricingSection.supportingLine}
            </p>

            {/* Concise 6-Item Benefits List */}
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pricingSection.checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13px] font-medium text-[#0F172A]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Official UPI Payment Box */}
            <div className="mt-6 rounded-[8px] border border-[#CBD5E1] bg-white p-4 shadow-xs">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#64748B]">
                    OFFICIAL COMMUNITY UPI ID
                  </p>
                  <p className="mt-0.5 font-mono-tabular text-[15px] font-bold text-[#0F172A] select-all">
                    {OFFICIAL_UPI_ID}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-bold transition-all duration-150 shrink-0 ${
                    isCopied
                      ? 'bg-[#059669] text-white'
                      : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F1F5F9]'
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

              <div className="mt-2.5 flex items-center justify-between border-t border-[#E2E8F0] pt-2 text-[11px] text-[#64748B]">
                <span>Amount: <strong className="text-[#0F172A]">₹199</strong></span>
                <span>Manual Verification</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="mt-6">
              <a
                href={links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'pricing_card_cta')}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-6 py-3 text-[14px] font-bold tracking-tight text-white shadow-sm transition-all duration-150 hover:bg-[#1E293B] active:scale-[0.99] whitespace-nowrap"
              >
                <span>{pricingSection.ctaText}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              {/* Non-Refundable Policy Lines */}
              <div className="mt-4 space-y-1 border-t border-[#E2E8F0] pt-3.5 text-[11px] leading-relaxed text-[#64748B]">
                <p>{pricing.nonRefundableNotePrimary}</p>
                <p>{pricing.nonRefundableNoteSecondary}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 — WHO'S BEHIND FINANCE WITH DEV */}
      <section
        id="about"
        className="scroll-mt-16 border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18"
      >
        <div className="mx-auto max-w-[840px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start gap-5 rounded-[12px] border border-[#CBD5E1] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-7"
          >
            {links.FOUNDER_PHOTO_URL ? (
              <img
                src={links.FOUNDER_PHOTO_URL}
                alt="Dev — Finance With Dev"
                referrerPolicy="no-referrer"
                className="relative block h-20 w-20 shrink-0 rounded-[10px] border border-[#CBD5E1] object-cover sm:h-22 sm:w-22"
              />
            ) : (
              <div
                aria-hidden="true"
                className="relative flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-[#F1F5F9] font-mono-tabular sm:h-22 sm:w-22"
              >
                <span className="text-base font-extrabold tracking-wider text-[#0F172A]">
                  DEV
                </span>
                <span className="text-[10px] font-bold tracking-wider text-[#059669]">
                  FWD
                </span>
              </div>
            )}

            <div className="w-full min-w-0">
              <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669]">
                ABOUT
              </p>
              <h2 className="mt-1 font-display text-[20px] font-bold tracking-[-0.015em] text-[#0F172A] sm:text-[24px]">
                {founderSection.heading}
              </h2>
              <div className="mt-2.5 space-y-2 text-[14px] leading-[1.6] text-[#475569]">
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
