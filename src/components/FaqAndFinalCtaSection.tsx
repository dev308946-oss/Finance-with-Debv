import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

interface FaqAndFinalCtaSectionProps {
  onPaymentLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, source: string) => void;
  onSocialOrCommunityClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    label: string
  ) => void;
}

export const FaqAndFinalCtaSection: React.FC<FaqAndFinalCtaSectionProps> = ({
  onPaymentLinkClick,
  onSocialOrCommunityClick,
}) => {
  const { faqSection, finalCta, brand, pricing } = SITE_CONFIG;
  const [openId, setOpenId] = useState<string | null>(faqSection.items[0]?.id ?? null);

  const handleToggleFaq = (id: string, question: string) => {
    const nextState = openId === id ? null : id;
    setOpenId(nextState);
    if (nextState) {
      trackEvent(SITE_CONFIG.analytics.events.faqExpand, { question });
    }
  };

  return (
    <>
      {/* SECTION 8 — FAQ ACCORDION */}
      <section
        id="faq"
        className="scroll-mt-16 border-b border-[#E2E8F0] bg-white py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-[820px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#059669] sm:text-[12px]">
              FAQ
            </p>
            <h2
              className="mt-1.5 font-display text-[26px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[32px]"
              style={{ textWrap: 'balance' }}
            >
              {faqSection.heading}
            </h2>
          </motion.div>

          <div className="mt-7 divide-y divide-[#E2E8F0] border-t border-b border-[#E2E8F0]">
            {faqSection.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-4">
                  <button
                    type="button"
                    onClick={() => handleToggleFaq(item.id, item.question)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left text-[15px] font-semibold text-[#0F172A] transition-colors hover:text-[#059669]"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0F172A]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="mt-2.5 pr-6 text-[14px] leading-[1.65] text-[#475569]"
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC] py-14 sm:py-18">
        <div className="mx-auto max-w-[820px] px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-display text-[26px] font-bold tracking-tight text-[#0F172A] sm:text-[32px]">
              {finalCta.heading}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[15px] leading-[1.6] text-[#475569]">
              {finalCta.supportingText}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'final_cta_button')}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-7 py-3 text-[14px] font-bold tracking-tight text-white shadow-sm transition-all duration-150 hover:bg-[#1E293B] active:scale-[0.99] whitespace-nowrap"
              >
                <span>{finalCta.buttonText}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>

              <p className="text-xs text-[#64748B]">
                {pricing.finalCtaNonRefundable}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10 text-xs text-[#64748B] border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-sm font-bold text-[#0F172A]">
                {brand.communityName}
              </p>
              <p className="mt-1 text-[#64748B]">
                {brand.coreMessage}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[#475569]">
              <a
                href={SITE_CONFIG.links.COMMUNITY_URL}
                onClick={(e) =>
                  onSocialOrCommunityClick(
                    e,
                    SITE_CONFIG.links.COMMUNITY_URL,
                    'COMMUNITY_URL'
                  )
                }
                className="hover:text-[#0F172A] transition-colors"
              >
                Community Portal
              </a>
              <a
                href={SITE_CONFIG.links.INSTAGRAM_URL}
                onClick={(e) =>
                  onSocialOrCommunityClick(
                    e,
                    SITE_CONFIG.links.INSTAGRAM_URL,
                    'INSTAGRAM_URL'
                  )
                }
                className="hover:text-[#0F172A] transition-colors"
              >
                Instagram
              </a>
              <a
                href={SITE_CONFIG.links.PAYMENT_URL}
                onClick={(e) => onPaymentLinkClick(e, 'footer_cta')}
                className="font-semibold text-[#0F172A] hover:underline"
              >
                Join for ₹199/month
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-[#E2E8F0] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-[#94A3B8]">
            <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
            <p>For educational and research discussion purposes only.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#CBD5E1] bg-white/95 px-4 py-3 backdrop-blur-md md:hidden shadow-lg">
        <a
          href={SITE_CONFIG.links.PAYMENT_URL}
          onClick={(e) => onPaymentLinkClick(e, 'mobile_sticky_cta')}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-4 py-2 text-sm font-bold text-white shadow-sm"
        >
          <span>{pricing.mobileStickyCta}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </a>
      </div>
    </>
  );
};
