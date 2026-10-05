import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Check,
  ExternalLink,
  Copy,
} from 'lucide-react';
import {
  SITE_CONFIG,
  MEMBERSHIP_FORM_URL,
  OFFICIAL_UPI_ID,
  COMMUNITY_PRICE,
} from '../config/siteConfig';
import { trackEvent } from '../utils/analytics';

export type ModalType =
  | { type: 'payment' }
  | { type: 'closing_bell_sample' }
  | { type: 'placeholder_link'; keyName: string; placeholderValue: string }
  | null;

interface InteractiveModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenPaymentModal: () => void;
}

const CLOSING_BELL_PREVIEW_SECTIONS = [
  {
    number: '01',
    title: 'Nifty, Sensex & Bank Nifty',
    summary:
      'End-of-day benchmark index overview, market breadth and sector participation across the session.',
  },
  {
    number: '02',
    title: 'How the market session unfolded',
    summary:
      'Structured walkthrough of opening cues, intraday momentum shifts and closing hour action.',
  },
  {
    number: '03',
    title: 'Key market takeaways',
    summary:
      'Focused summary of the primary themes and catalysts that shaped the trading day.',
  },
  {
    number: '04',
    title: 'FII/DII flows',
    summary:
      'Provisional Foreign and Domestic Institutional Investor activity and cash market flow context.',
  },
  {
    number: '05',
    title: 'Major India stories',
    summary:
      'Important domestic corporate announcements, regulatory updates and macroeconomic developments.',
  },
  {
    number: '06',
    title: 'Global market cues',
    summary:
      'Developments across US, European and Asian markets, key commodities and bond yields.',
  },
  {
    number: '07',
    title: 'Options desk / support & resistance levels',
    summary:
      'Notable open interest build-up, strike concentration and key support & resistance zones.',
  },
  {
    number: '08',
    title: 'Management commentary',
    summary:
      'Important excerpts and takeaways from company earnings calls, investor presentations and filings.',
  },
  {
    number: '09',
    title: 'Key events and developments to watch',
    summary:
      'Upcoming economic releases, corporate actions, earnings and events on the radar for the next session.',
  },
];

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  activeModal,
  onClose,
  onOpenPaymentModal,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard
      .writeText(OFFICIAL_UPI_ID)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      })
      .catch(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
  };

  if (!activeModal) return null;

  const isReportViewer = activeModal.type === 'closing_bell_sample';

  const handleSubmitProofClick = () => {
    trackEvent(SITE_CONFIG.analytics.events.payButtonClick, {
      formUrl: MEMBERSHIP_FORM_URL,
    });
  };

  const { closingBell } = SITE_CONFIG.realProductsSection;
  const samplePdfUrl = SITE_CONFIG.links.CLOSING_BELL_SAMPLE_PDF_URL;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[94vh] w-full overflow-y-auto rounded-t-[14px] border border-[#CBD5E1] bg-white p-5 shadow-xl sm:rounded-[12px] sm:p-7 ${
          isReportViewer ? 'max-w-[860px]' : 'max-w-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* MODAL 1: PROFESSIONAL REPORT VIEWER FOR "THE CLOSING BELL" */}
        {activeModal.type === 'closing_bell_sample' && (
          <div>
            {/* Viewer Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-12">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono-tabular text-[10px] font-bold tracking-[0.14em] uppercase text-[#059669]">
                    DAILY MARKET BRIEF · REPORT VIEWER
                  </p>
                  <p className="text-xs text-[#64748B]">
                    The_Closing_Bell_Daily_Brief.pdf
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Embedded PDF Viewer if a PDF file URL is configured */}
            {samplePdfUrl && (
              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                <iframe
                  src={samplePdfUrl}
                  title="The Closing Bell Sample PDF"
                  className="h-[420px] w-full"
                />
                <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-2 text-xs">
                  <span className="text-[#64748B]">Sample PDF Document</span>
                  <a
                    href={samplePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#0F172A] hover:underline"
                  >
                    <span>Open Full PDF</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Publication Document Sheet */}
            <div className="mt-4 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6">
              {/* Document Masthead */}
              <div className="border-b-2 border-[#0F172A] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono-tabular font-bold tracking-[0.16em] uppercase text-[#64748B]">
                    FINANCEWITHDEV · DAILY MARKET BRIEF
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#059669]">
                    Delivered Every Market Day
                  </span>
                </div>

                <h2
                  id="modal-heading"
                  className="mt-1 font-display text-[22px] font-extrabold tracking-tight text-[#0F172A] sm:text-[26px]"
                >
                  {closingBell.upperName}
                </h2>
                <p className="mt-0.5 text-[13px] font-medium text-[#64748B]">
                  {closingBell.documentSubtitle}
                </p>
              </div>

              {/* 2-Column Editorial Report Sections */}
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {CLOSING_BELL_PREVIEW_SECTIONS.map((sec) => (
                  <div
                    key={sec.number}
                    className="rounded-[8px] border border-[#E2E8F0] bg-white p-3.5 shadow-2xs"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono-tabular text-xs font-bold text-[#059669]">
                        {sec.number}
                      </span>
                      <h3 className="font-display text-[14px] font-bold text-[#0F172A]">
                        {sec.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#475569]">
                      {sec.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Report Viewer Action Bar */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[42px] items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                Close Report Viewer
              </button>

              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-5 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#1E293B]"
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>Join Community to Receive Daily — ₹199/month</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: PLACEHOLDER SOCIAL LINK MODAL */}
        {activeModal.type === 'placeholder_link' && (
          <div>
            <p className="font-mono-tabular text-xs font-bold tracking-wider uppercase text-[#059669]">
              CENTRAL LINK CONFIGURATION
            </p>
            <h3
              id="modal-heading"
              className="mt-1 font-display text-lg font-bold text-[#0F172A]"
            >
              {activeModal.keyName}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#475569] sm:text-sm">
              Update{' '}
              <code className="font-mono-tabular text-[#0F172A] bg-[#F1F5F9] px-1 py-0.5 rounded">
                {activeModal.keyName}
              </code>{' '}
              (currently{' '}
              <code className="font-mono-tabular text-[#0F172A]">
                {activeModal.placeholderValue}
              </code>
              ) in{' '}
              <code className="font-mono-tabular text-[#0F172A]">
                src/config/siteConfig.ts
              </code>
              .
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-[8px] bg-[#0F172A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1E293B]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: MEMBERSHIP PAYMENT & TALLY PROOF SUBMISSION FLOW */}
        {activeModal.type === 'payment' && (
          <div>
            {/* Header */}
            <div className="pr-10">
              <h2
                id="modal-heading"
                className="font-display text-xl font-bold tracking-tight text-[#0F172A]"
              >
                Join Finance With Dev Community
              </h2>
              <p className="mt-0.5 font-mono-tabular text-base font-bold text-[#059669]">
                {SITE_CONFIG.pricing.compactPrice}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569] sm:text-[13px]">
                Complete the ₹199/month UPI payment below and submit your payment proof on our verification form.
              </p>
            </div>

            {/* Progress Indicator: 01 DETAILS -> 02 PAYMENT -> 03 CONFIRM */}
            <div
              aria-label="Checkout steps"
              className="mt-4 flex items-center justify-between rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 font-mono-tabular text-[11px] font-semibold"
            >
              <span className="text-[#0F172A] font-bold">01 DETAILS</span>
              <span aria-hidden="true" className="text-[#CBD5E1]">
                →
              </span>
              <span className="text-[#0F172A] font-bold">02 PAYMENT</span>
              <span aria-hidden="true" className="text-[#CBD5E1]">
                →
              </span>
              <span
                className={
                  isCopied ? 'text-[#0F172A] font-bold' : 'text-[#64748B]'
                }
              >
                03 CONFIRM
              </span>
            </div>

            {/* STEP 1 — COMPLETE YOUR PAYMENT VIA UPI */}
            <div className="mt-5 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-tabular font-bold tracking-wider text-[#0F172A]">
                  01 · COMPLETE YOUR PAYMENT
                </span>
                <span className="font-mono-tabular text-[#64748B]">
                  UPI Payment
                </span>
              </div>

              <h3 className="mt-1.5 font-display text-base font-bold text-[#0F172A]">
                Payment Details
              </h3>

              {/* UPI Payment Box */}
              <div className="mt-3 space-y-2.5 rounded-[8px] border border-[#E2E8F0] bg-white p-3.5 shadow-2xs">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-2.5">
                  <div>
                    <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#64748B]">
                      OFFICIAL UPI ID
                    </p>
                    <p className="mt-0.5 font-mono-tabular text-[15px] font-bold text-[#0F172A] select-all">
                      {OFFICIAL_UPI_ID}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className={`inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded-[6px] px-3 py-1 text-xs font-bold transition-all duration-150 ${
                      isCopied
                        ? 'bg-[#059669] text-white'
                        : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>COPIED ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>COPY UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <p className="font-mono-tabular text-[10px] font-bold tracking-wider uppercase text-[#64748B]">
                      AMOUNT
                    </p>
                    <p className="mt-0.5 font-mono-tabular text-[18px] font-extrabold text-[#0F172A]">
                      {COMMUNITY_PRICE}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs text-[#64748B]">
                    1 Month Membership
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#475569]">
                Pay <strong className="text-[#0F172A]">₹199</strong> to the UPI ID above using any UPI app (GPay, PhonePe, Paytm, etc.). After completing your payment, click <strong className="text-[#0F172A]">SUBMIT PAYMENT PROOF</strong> below.
              </p>
            </div>

            {/* STEP 2 — SUBMIT DETAILS & PAYMENT PROOF ON TALLY FORM */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#0F172A]">
                  02 · SUBMIT PAYMENT PROOF
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Verification Form
                </span>
              </div>

              <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-xs leading-relaxed text-[#475569]">
                <p className="font-semibold text-[#0F172A]">
                  What you will submit in the verification form:
                </p>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-[#0F172A] font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                    <span>Full Name</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                    <span>WhatsApp Number</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                    <span>City (Optional)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                    <span>UTR / Transaction ID</span>
                  </li>
                  <li className="flex items-center gap-1.5 sm:col-span-2">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                    <span>Payment Screenshot</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SUBMIT PAYMENT PROOF BUTTON (Opens https://tally.so/r/eqd6Go in a new tab) */}
            <div className="mt-5">
              <a
                href={MEMBERSHIP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSubmitProofClick}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-5 py-2.5 text-sm font-bold tracking-tight text-white shadow-sm transition-all hover:bg-[#1E293B] whitespace-nowrap"
              >
                <span>SUBMIT PAYMENT PROOF</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>

              {/* Non-Refundable & Verification Note */}
              <div className="mt-3 space-y-1 text-center text-[11px] leading-relaxed text-[#64748B]">
                <p>{SITE_CONFIG.pricing.nonRefundableNotePrimary}</p>
                <p className="flex items-center justify-center gap-1 text-[#64748B]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                  <span>
                    Once your payment is verified, your community access details will be shared on WhatsApp.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
