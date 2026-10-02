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
      {/* SECTION 8 — FAQ ACCORDION (#0A1018) */}
      <section
        id="faq"
        className="scroll-mt-16 border-b border-[#1B2735] bg-[#0A1018] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[820px] px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.14em] uppercase text-[#19D3A2] sm:text-[12px]">
              FAQ
            </p>
            <h2
              className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]"
              style={{ textWrap: 'balance' }}
            >
              {faqSection.heading}
            </h2>
          </motion.div>

          <div className="mt-8 divide-y divide-[#1B2735] border-t border-b border-[#1B2735]">
            {faqSection.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFaq(item.id, item.question)}
                    aria-expanded={isOpen}
                    className="flex min-h-[54px] w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-[#19D3A2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19D3A2]"
                  >
                    <span className="font-display text-[16px] font-semibold text-[#F5F7FA] sm:text-[17px]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#8D99A8] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#19D3A2]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-4 pr-8 text-[15px] leading-[1.65] text-[#8D99A8]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA (#070B12) */}
      <section className="relative overflow-hidden border-b border-[#1B2735] bg-[#070B12] py-18 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(25,211,162,0.07),transparent_65%)]"
        />

        <div className="mx-auto max-w-[720px] px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#F5F7FA] sm:text-[38px]"
            style={{ textWrap: 'balance' }}
          >
            {finalCta.headline}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-[1.65] text-[#8D99A8] sm:text-[17px]">
            {finalCta.subheadline}
          </p>

          <p className="mt-5 font-mono-tabular text-[26px] font-bold text-[#F5F7FA] sm:text-[32px]">
            {finalCta.price}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center">
            <a
              href={SITE_CONFIG.links.PAYMENT_URL}
              onClick={(e) => onPaymentLinkClick(e, 'final_cta')}
              className="inline-flex min-h-[50px] w-full max-w-xs items-center justify-center gap-2 rounded-[14px] bg-[#16E0A5] px-7 py-3.5 text-[14px] font-bold tracking-tight text-[#070B12] shadow-[0_0_26px_rgba(22,224,165,0.18)] transition-all duration-150 hover:bg-[#19D3A2] hover:shadow-[0_0_32px_rgba(22,224,165,0.28)] active:scale-[0.99] whitespace-nowrap sm:text-[15px]"
            >
              <span>{finalCta.buttonText}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>

            <p className="mt-4 text-[12px] text-[#8D99A8]">
              {finalCta.smallText}
            </p>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="bg-[#070B12] pt-10 pb-28 text-xs text-[#8D99A8] md:pb-12">
        <div className="mx-auto flex max-w-[1140px] flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="font-display text-sm font-bold text-[#F5F7FA]">
              {brand.communityName}
            </p>
            <p className="mt-1 text-xs text-[#8D99A8]">
              Educational &amp; discussion-based finance community. Not investment advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#8D99A8]">
            <a href="#real-products" className="hover:text-[#F5F7FA] transition-colors">
              Products
            </a>
            <a href="#benefits" className="hover:text-[#F5F7FA] transition-colors">
              Community
            </a>
            <a href="#how-it-works" className="hover:text-[#F5F7FA] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#F5F7FA] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#F5F7FA] transition-colors">
              FAQ
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
              className="hover:text-[#19D3A2] transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM CTA: "₹199/month   JOIN COMMUNITY" */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-[#1B2735] bg-[#070B12]/95 px-4 py-2.5 backdrop-blur-md md:hidden">
        <div className="mx-auto max-w-md">
          <a
            href={SITE_CONFIG.links.PAYMENT_URL}
            onClick={(e) => onPaymentLinkClick(e, 'sticky_mobile_cta')}
            className="flex min-h-[46px] w-full items-center justify-between rounded-[12px] bg-[#16E0A5] px-5 py-3 text-[13px] font-extrabold tracking-tight text-[#070B12] shadow-[0_0_20px_rgba(22,224,165,0.18)] active:scale-[0.99] whitespace-nowrap"
          >
            <span className="font-mono-tabular">₹199/month</span>
            <span>JOIN COMMUNITY →</span>
          </a>
        </div>
      </div>
    </>
  );
};
