import React from 'react';
import { X, ExternalLink, Check } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export type ModalType =
  | { type: 'payment' }
  | { type: 'premium_ipo' }
  | { type: 'placeholder_link'; keyName: string; placeholderValue: string }
  | null;

interface InteractiveModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenPaymentModal: () => void;
}

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  activeModal,
  onClose,
  onOpenPaymentModal,
}) => {
  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/[0.12] bg-[#0B1018] p-6 shadow-2xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* MODAL 1: PAYMENT / JOIN COMMUNITY */}
        {activeModal.type === 'payment' && (
          <div>
            <p className="font-mono-tabular text-xs font-semibold tracking-wider text-emerald-400">
              {SITE_CONFIG.brand.upperName}
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
              Join {SITE_CONFIG.brand.communityName}
            </h3>
            <p className="mt-1 font-mono-tabular text-sm font-semibold text-emerald-400">
              {SITE_CONFIG.pricing.formattedPrice} · {SITE_CONFIG.pricing.heroSmallText}
            </p>

            <div className="my-5 border-t border-white/[0.08]" />

            <p className="text-xs font-semibold tracking-wider text-slate-400">
              INCLUDED IN YOUR MEMBERSHIP
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-200">
              {SITE_CONFIG.pricingSection.checklist.slice(0, 8).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-[#070A0E] p-4">
              <p className="text-xs font-semibold text-emerald-400">
                Payment URL Placeholder Configured
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                This button points to{' '}
                <code className="font-mono-tabular text-white">
                  {SITE_CONFIG.links.PAYMENT_URL}
                </code>
                . Update <code className="font-mono-tabular text-emerald-300">PAYMENT_URL</code> in{' '}
                <code className="font-mono-tabular text-slate-200">src/config/siteConfig.ts</code>{' '}
                with your live payment link to send visitors directly to checkout.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={SITE_CONFIG.links.FREE_IPO_TOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.07]"
              >
                <span>Try Free IPO Check</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: PREMIUM IPO TOOL (COMMUNITY ACCESS) */}
        {activeModal.type === 'premium_ipo' && (
          <div>
            <p className="font-mono-tabular text-xs font-semibold tracking-wider text-emerald-400">
              COMMUNITY MEMBER TOOL
            </p>
            <h3 className="mt-1.5 font-display text-xl font-bold text-white sm:text-2xl">
              Premium IPO Analysis
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              The Premium IPO Analysis experience is unlocked for members of the{' '}
              <strong className="text-white">{SITE_CONFIG.brand.communityName}</strong>{' '}
              ({SITE_CONFIG.pricing.compactPrice}).
            </p>

            <div className="mt-5 rounded-xl border border-white/[0.09] bg-[#070A0E] p-4 text-xs">
              <p className="font-semibold text-emerald-400">
                Link Configuration (<code className="font-mono-tabular">PREMIUM_IPO_TOOL_URL</code>):
              </p>
              <p className="mt-1 leading-relaxed text-slate-300">
                Currently set to{' '}
                <code className="font-mono-tabular text-white">
                  {SITE_CONFIG.links.PREMIUM_IPO_TOOL_URL}
                </code>{' '}
                in <code className="font-mono-tabular text-slate-200">src/config/siteConfig.ts</code>.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={SITE_CONFIG.links.FREE_IPO_TOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08]"
              >
                <span>Open Free Basic IPO Check</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Join Community — ₹199/mo
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: OTHER PLACEHOLDER URLS (INSTAGRAM_URL / COMMUNITY_URL) */}
        {activeModal.type === 'placeholder_link' && (
          <div>
            <p className="font-mono-tabular text-xs font-semibold tracking-wider text-emerald-400">
              CENTRAL LINK CONFIGURATION
            </p>
            <h3 className="mt-1.5 font-display text-xl font-bold text-white">
              {activeModal.keyName}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Update <code className="font-mono-tabular text-emerald-300">{activeModal.keyName}</code>{' '}
              (currently <code className="font-mono-tabular text-white">{activeModal.placeholderValue}</code>) in{' '}
              <code className="font-mono-tabular text-slate-200">src/config/siteConfig.ts</code>.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
