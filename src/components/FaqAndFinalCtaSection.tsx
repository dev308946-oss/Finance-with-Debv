import React, { useState } from 'react';
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
      {/* SECTION 11 — FAQ ACCORDION */}
      <section
        id="faq"
        className="scroll-mt-16 border-b border-white/[0.08] bg-[#06080C] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-wider text-emerald-400">
              10. FREQUENTLY ASKED QUESTIONS
            </p>
            <h2
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {faqSection.heading}
            </h2>
          </div>

          <div className="mt-10 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
            {faqSection.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFaq(item.id, item.question)}
                    aria-expanded={isOpen}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  >
                    <span className="font-display text-base font-bold text-white sm:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-5 pr-8 text-sm leading-relaxed text-slate-300 sm:text-base">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 12 — FINAL CTA */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-market-grid py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_65%)]"
        />

        <div className="mx-auto max-w-[820px] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-emerald-400">
            {brand.upperName}
          </p>

          <h2
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {finalCta.headline}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-slate-300 sm:text-lg">
            {finalCta.subheadline}
          </p>

          <p className="mt-4 font-mono-tabular text-2xl font-extrabold text-emerald-400 sm:text-3xl">
            {finalCta.price}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center">
            <a
              href={SITE_CONFIG.links.PAYMENT_URL}
              onClick={(e) => onPaymentLinkClick(e, 'final_cta')}
              className="inline-flex min-h-[54px] w-full max-w-md items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-sm font-bold tracking-tight text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-150 hover:bg-emerald-400 active:scale-[0.99] whitespace-nowrap sm:text-base"
            >
              <span>{finalCta.buttonText}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>

            <p className="mt-4 text-xs font-medium text-slate-300 sm:text-sm">
              {finalCta.smallLine}
            </p>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="bg-[#05070A] pt-10 pb-28 text-xs text-slate-400 md:pb-12">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="font-display text-sm font-bold text-white">
              {brand.communityName}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {brand.coreMessage} · Educational Finance Community
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#what-is-inside" className="hover:text-white transition-colors">
              Inside
            </a>
            <a href="#discussions" className="hover:text-white transition-colors">
              Discussions
            </a>
            <a href="#resources" className="hover:text-white transition-colors">
              Resources
            </a>
            <a href="#tools" className="hover:text-white transition-colors">
              Tools
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
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
              className="hover:text-emerald-400 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM CTA: "₹199/month → JOIN COMMUNITY" */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-white/[0.1] bg-[#070A0E]/95 px-4 py-2.5 backdrop-blur-md md:hidden">
        <div className="mx-auto max-w-md">
          <a
            href={SITE_CONFIG.links.PAYMENT_URL}
            onClick={(e) => onPaymentLinkClick(e, 'sticky_mobile_cta')}
            className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold tracking-tight text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] whitespace-nowrap"
          >
            <span>{pricing.mobileStickyCtaText}</span>
          </a>
        </div>
      </div>
    </>
  );
};
