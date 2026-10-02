import React, { useState, useRef } from 'react';
import {
  X,
  ArrowUpRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  ShieldCheck,
  FileText,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  SITE_CONFIG,
  PAYMENT_LINK,
  COMMUNITY_PRICE,
  MEMBERSHIP_DURATION,
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

interface FormFieldErrors {
  fullName?: string;
  email?: string;
  whatsappNumber?: string;
  utr?: string;
  screenshot?: string;
  general?: string;
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
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
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [screenshotSizeLabel, setScreenshotSizeLabel] = useState<string>('');

  // Flow & Validation State
  const [paymentButtonClicked, setPaymentButtonClicked] = useState(false);
  const [placeholderPayNotice, setPlaceholderPayNotice] = useState(false);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    submissionId: string;
    submittedAt: string;
    status: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!activeModal) return null;

  const isReportViewer = activeModal.type === 'closing_bell_sample';

  const detailsComplete =
    fullName.trim().length >= 2 &&
    isValidEmail(email) &&
    isValidIndianPhone(whatsappNumber);

  const confirmStarted = Boolean(utr.trim() || screenshotDataUrl);

  const currentStep: 1 | 2 | 3 = confirmStarted
    ? 3
    : detailsComplete || paymentButtonClicked
    ? 2
    : 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Accepted formats: JPG, JPEG, PNG or WEBP.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Maximum file size is 5 MB. Please choose a smaller image.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotDataUrl(reader.result);
        setScreenshotFileName(file.name);
        const sizeInKb = file.size / 1024;
        setScreenshotSizeLabel(
          sizeInKb >= 1024
            ? `${(sizeInKb / 1024).toFixed(2)} MB`
            : `${Math.round(sizeInKb)} KB`
        );
        setErrors((prev) => ({ ...prev, screenshot: undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotDataUrl(null);
    setScreenshotFileName('');
    setScreenshotSizeLabel('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setPaymentButtonClicked(true);
    trackEvent(SITE_CONFIG.analytics.events.payButtonClick, {
      amount: COMMUNITY_PRICE,
      paymentLink: PAYMENT_LINK,
    });

    if (
      PAYMENT_LINK === 'YOUR_PAYMENT_LINK_HERE' ||
      PAYMENT_LINK.startsWith('YOUR_')
    ) {
      e.preventDefault();
      setPlaceholderPayNotice(true);
    }
  };

  const validateAllFields = (): boolean => {
    const nextErrors: FormFieldErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim() || !isValidEmail(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!whatsappNumber.trim() || !isValidIndianPhone(whatsappNumber)) {
      nextErrors.whatsappNumber =
        'Please enter a valid 10-digit Indian WhatsApp number.';
    }

    if (!utr.trim() || utr.trim().length < 4) {
      nextErrors.utr = 'Please enter your UTR / transaction ID.';
    }

    if (!screenshotDataUrl) {
      nextErrors.screenshot =
        'Please upload a screenshot of your successful payment.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/membership-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          whatsappNumber: whatsappNumber.trim(),
          city: city.trim(),
          utr: utr.trim(),
          screenshotDataUrl,
          screenshotFileName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrors({
          ...(data.fieldErrors || {}),
          general:
            data.error || 'Please check the highlighted fields and try again.',
        });
        setIsSubmitting(false);
        return;
      }

      trackEvent(SITE_CONFIG.analytics.events.paymentSubmissionSuccess, {
        submissionId: data.submissionId,
      });

      setSubmittedRecord({
        submissionId: data.submissionId,
        submittedAt: data.submittedAt,
        status: data.status || 'Pending Verification',
      });
    } catch {
      setErrors({
        general: 'Network error while submitting your payment proof. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { closingBell } = SITE_CONFIG.realProductsSection;
  const samplePdfUrl = SITE_CONFIG.links.CLOSING_BELL_SAMPLE_PDF_URL;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[94vh] w-full overflow-y-auto rounded-t-[20px] border border-[#1B2735] bg-[#0D141D] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:rounded-[18px] sm:p-8 ${
          isReportViewer ? 'max-w-[860px]' : 'max-w-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[12px] border border-[#1B2735] bg-[#0A1018] text-[#8D99A8] transition-colors hover:border-[#2A3C52] hover:text-[#F5F7FA]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* MODAL 1: PROFESSIONAL REPORT VIEWER FOR "THE CLOSING BELL" */}
        {activeModal.type === 'closing_bell_sample' && (
          <div>
            {/* Viewer Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pr-12">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#19D3A2]/30 bg-[#19D3A2]/10 text-[#19D3A2]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono-tabular text-[11px] font-bold tracking-[0.14em] uppercase text-[#19D3A2]">
                    DAILY MARKET BRIEF · REPORT VIEWER
                  </p>
                  <p className="text-xs text-[#8D99A8]">
                    The_Closing_Bell_Daily_Brief.pdf
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Embedded PDF Viewer if a PDF file URL is configured */}
            {samplePdfUrl && (
              <div className="mt-5 overflow-hidden rounded-[14px] border border-[#1B2735] bg-[#070B12]">
                <iframe
                  src={samplePdfUrl}
                  title="The Closing Bell Sample PDF"
                  className="h-[420px] w-full"
                />
                <div className="flex items-center justify-between border-t border-[#1B2735] px-4 py-2.5 text-xs">
                  <span className="text-[#8D99A8]">Sample PDF Document</span>
                  <a
                    href={samplePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#19D3A2] hover:underline"
                  >
                    <span>Open Full PDF</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Publication Document Sheet */}
            <div className="mt-5 rounded-[16px] border border-[#1B2735] bg-[#070B12] p-5 sm:p-7">
              {/* Document Masthead */}
              <div className="border-b-2 border-[#19D3A2]/45 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono-tabular font-semibold tracking-[0.16em] uppercase text-[#19D3A2]">
                    FINANCEWITHDEV · DAILY MARKET BRIEF
                  </span>
                  <span className="font-mono-tabular text-[#8D99A8]">
                    Delivered Every Market Day
                  </span>
                </div>

                <h2
                  id="modal-heading"
                  className="mt-2 font-display text-[26px] font-extrabold tracking-tight text-[#F5F7FA] sm:text-[32px]"
                >
                  {closingBell.upperName}
                </h2>
                <p className="mt-1 text-[14px] font-medium text-[#8D99A8]">
                  {closingBell.documentSubtitle}
                </p>
              </div>

              {/* 2-Column Editorial Report Sections */}
              <div className="mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
                {CLOSING_BELL_PREVIEW_SECTIONS.map((sec) => (
                  <div
                    key={sec.number}
                    className="rounded-[12px] border border-[#1B2735] bg-[#0A1018] p-4"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono-tabular text-xs font-bold text-[#19D3A2]">
                        {sec.number}
                      </span>
                      <h3 className="font-display text-[15px] font-bold text-[#F5F7FA]">
                        {sec.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#8D99A8]">
                      {sec.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Report Viewer Action Bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[46px] items-center justify-center rounded-[12px] border border-[#1B2735] bg-[#0A1018] px-5 py-2.5 text-xs font-semibold text-[#F5F7FA] hover:border-[#2A3C52]"
              >
                Close Report Viewer
              </button>

              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#16E0A5] px-6 py-2.5 text-[13px] font-bold text-[#070B12] shadow-[0_0_24px_rgba(22,224,165,0.16)] transition-all hover:bg-[#19D3A2]"
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
            <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#19D3A2]">
              CENTRAL LINK CONFIGURATION
            </p>
            <h3
              id="modal-heading"
              className="mt-1.5 font-display text-xl font-bold text-[#F5F7FA]"
            >
              {activeModal.keyName}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8D99A8] sm:text-sm">
              Update{' '}
              <code className="font-mono-tabular text-[#19D3A2]">
                {activeModal.keyName}
              </code>{' '}
              (currently{' '}
              <code className="font-mono-tabular text-[#F5F7FA]">
                {activeModal.placeholderValue}
              </code>
              ) in{' '}
              <code className="font-mono-tabular text-[#F5F7FA]">
                src/config/siteConfig.ts
              </code>
              .
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[12px] bg-[#16E0A5] px-4 py-2.5 text-xs font-bold text-[#070B12] hover:bg-[#19D3A2]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: MANUAL MEMBERSHIP PAYMENT & VERIFICATION FLOW */}
        {activeModal.type === 'payment' && (
          <>
            {submittedRecord ? (
              /* STEP 5 — SUCCESS SCREEN */
              <div className="py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#19D3A2]/30 bg-[#19D3A2]/15 text-[#19D3A2]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <h2
                  id="modal-heading"
                  className="mt-5 font-display text-2xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-3xl"
                >
                  Payment details received ✓
                </h2>

                <p className="mt-2.5 text-base font-semibold text-[#19D3A2]">
                  Thank you for joining Finance With Dev Community.
                </p>

                <p className="mt-3 text-sm leading-relaxed text-[#8D99A8]">
                  Your payment details have been submitted for verification.
                </p>

                <p className="mt-3 text-sm font-semibold leading-relaxed text-[#F5F7FA]">
                  Once your payment is verified, your community access details will be shared with you on WhatsApp/email.
                </p>

                <p className="mt-3 text-xs leading-relaxed text-[#8D99A8]">
                  Please keep your payment confirmation available until verification is complete.
                </p>

                {/* Submission Reference & Status Summary */}
                <div className="mt-6 space-y-2.5 rounded-[14px] border border-[#1B2735] bg-[#070B12] p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D99A8]">Status</span>
                    <span className="font-mono-tabular font-bold text-amber-400">
                      {submittedRecord.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1B2735] pt-2">
                    <span className="text-[#8D99A8]">Reference ID</span>
                    <span className="font-mono-tabular font-semibold text-[#F5F7FA]">
                      {submittedRecord.submissionId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1B2735] pt-2">
                    <span className="text-[#8D99A8]">UTR / Transaction ID</span>
                    <span className="font-mono-tabular text-[#F5F7FA]">
                      {utr}
                    </span>
                  </div>
                </div>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-[#16E0A5] px-6 py-3 text-sm font-bold text-[#070B12] transition-colors hover:bg-[#19D3A2]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM (STEPS 1 TO 4) */
              <form onSubmit={handleSubmit} noValidate>
                {/* Header */}
                <div className="pr-10">
                  <h2
                    id="modal-heading"
                    className="font-display text-xl font-extrabold tracking-tight text-[#F5F7FA] sm:text-2xl"
                  >
                    Join Finance With Dev Community
                  </h2>
                  <p className="mt-1 font-mono-tabular text-base font-bold text-[#19D3A2] sm:text-lg">
                    {SITE_CONFIG.pricing.compactPrice}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#8D99A8] sm:text-sm">
                    Fill in your details, complete the ₹199 payment and submit your payment proof. Your membership will be verified manually.
                  </p>
                </div>

                {/* Progress Indicator: 01 DETAILS -> 02 PAYMENT -> 03 CONFIRM */}
                <div
                  aria-label="Checkout steps"
                  className="mt-5 flex items-center justify-between rounded-[12px] border border-[#1B2735] bg-[#070B12] px-3.5 py-2.5 font-mono-tabular text-[11px] font-semibold sm:text-xs"
                >
                  <span
                    className={
                      currentStep >= 1 ? 'text-[#19D3A2]' : 'text-[#8D99A8]'
                    }
                  >
                    01 DETAILS
                  </span>
                  <span aria-hidden="true" className="text-[#1B2735]">
                    →
                  </span>
                  <span
                    className={
                      currentStep >= 2 ? 'text-[#19D3A2]' : 'text-[#8D99A8]'
                    }
                  >
                    02 PAYMENT
                  </span>
                  <span aria-hidden="true" className="text-[#1B2735]">
                    →
                  </span>
                  <span
                    className={
                      currentStep === 3 ? 'text-[#19D3A2]' : 'text-[#8D99A8]'
                    }
                  >
                    03 CONFIRM
                  </span>
                </div>

                {/* General Error Banner */}
                {errors.general && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-[12px] border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* STEP 1 — PERSONAL DETAILS */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1B2735] pb-2">
                    <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#19D3A2]">
                      01 · YOUR DETAILS
                    </span>
                    <span className="text-[11px] text-[#8D99A8]">
                      * Required fields
                    </span>
                  </div>

                  {/* Full Name * */}
                  <div>
                    <label
                      htmlFor="member-full-name"
                      className="block text-xs font-semibold text-[#F5F7FA]"
                    >
                      Full Name <span className="text-[#19D3A2]">*</span>
                    </label>
                    <input
                      id="member-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) {
                          setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      placeholder="Enter your full name"
                      className={`mt-1.5 w-full min-h-[44px] rounded-[12px] border bg-[#070B12] px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder:text-[#8D99A8]/60 focus:outline-none ${
                        errors.fullName
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-[#1B2735] focus:border-[#19D3A2]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address * */}
                  <div>
                    <label
                      htmlFor="member-email"
                      className="block text-xs font-semibold text-[#F5F7FA]"
                    >
                      Email Address <span className="text-[#19D3A2]">*</span>
                    </label>
                    <input
                      id="member-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="Enter your email address"
                      className={`mt-1.5 w-full min-h-[44px] rounded-[12px] border bg-[#070B12] px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder:text-[#8D99A8]/60 focus:outline-none ${
                        errors.email
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-[#1B2735] focus:border-[#19D3A2]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Number * & City */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="member-whatsapp"
                        className="block text-xs font-semibold text-[#F5F7FA]"
                      >
                        WhatsApp Number <span className="text-[#19D3A2]">*</span>
                      </label>
                      <input
                        id="member-whatsapp"
                        type="tel"
                        inputMode="tel"
                        required
                        value={whatsappNumber}
                        onChange={(e) => {
                          setWhatsappNumber(e.target.value);
                          if (errors.whatsappNumber) {
                            setErrors((prev) => ({
                              ...prev,
                              whatsappNumber: undefined,
                            }));
                          }
                        }}
                        placeholder="Enter your WhatsApp number"
                        className={`mt-1.5 w-full min-h-[44px] rounded-[12px] border bg-[#070B12] px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder:text-[#8D99A8]/60 focus:outline-none ${
                          errors.whatsappNumber
                            ? 'border-rose-500/70 focus:border-rose-400'
                            : 'border-[#1B2735] focus:border-[#19D3A2]'
                        }`}
                      />
                      {errors.whatsappNumber && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.whatsappNumber}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="member-city"
                        className="block text-xs font-semibold text-[#F5F7FA]"
                      >
                        City <span className="text-[#8D99A8] font-normal">(Optional)</span>
                      </label>
                      <input
                        id="member-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter your city"
                        className="mt-1.5 w-full min-h-[44px] rounded-[12px] border border-[#1B2735] bg-[#070B12] px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder:text-[#8D99A8]/60 focus:border-[#19D3A2] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2 — COMPLETE YOUR PAYMENT */}
                <div className="mt-7 rounded-[16px] border border-[#19D3A2]/35 bg-[#0A1018] p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-bold tracking-wider text-[#19D3A2]">
                      02 · COMPLETE YOUR PAYMENT
                    </span>
                    <span className="font-mono-tabular text-[#8D99A8]">
                      Manual Verification
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-[#F5F7FA]">
                    Complete your payment
                  </h3>

                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-b border-[#1B2735] py-3.5">
                    <div>
                      <p className="font-mono-tabular text-2xl font-extrabold text-[#F5F7FA] sm:text-3xl">
                        {COMMUNITY_PRICE}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-[#8D99A8]">
                        Community Membership — {MEMBERSHIP_DURATION}
                      </p>
                    </div>

                    <a
                      href={PAYMENT_LINK}
                      target={
                        PAYMENT_LINK.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        PAYMENT_LINK.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      onClick={handlePayButtonClick}
                      className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#16E0A5] px-6 py-2.5 text-sm font-extrabold tracking-tight text-[#070B12] transition-colors hover:bg-[#19D3A2] active:scale-[0.99] whitespace-nowrap"
                    >
                      <span>PAY {COMMUNITY_PRICE}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </a>
                  </div>

                  {placeholderPayNotice && (
                    <div className="mt-3 rounded-[10px] border border-[#19D3A2]/25 bg-[#070B12] p-3 text-xs leading-relaxed text-[#8D99A8]">
                      <span className="font-semibold text-[#19D3A2]">
                        Payment Link Ready:{' '}
                      </span>
                      Configured as{' '}
                      <code className="font-mono-tabular text-[#F5F7FA]">
                        {PAYMENT_LINK}
                      </code>{' '}
                      in <code className="font-mono-tabular">src/config/siteConfig.ts</code>.
                      You can proceed below to submit your UTR &amp; screenshot.
                    </div>
                  )}

                  <p className="mt-3 text-xs font-medium leading-relaxed text-[#8D99A8]">
                    After completing the payment, return here and submit your payment details below.
                  </p>
                </div>

                {/* STEP 3 — CONFIRM PAYMENT (UTR + SCREENSHOT) */}
                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1B2735] pb-2">
                    <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#19D3A2]">
                      03 · CONFIRM PAYMENT
                    </span>
                    <span className="text-[11px] text-[#8D99A8]">
                      Proof of payment
                    </span>
                  </div>

                  {/* UTR / Transaction ID * */}
                  <div>
                    <label
                      htmlFor="member-utr"
                      className="block text-xs font-semibold text-[#F5F7FA]"
                    >
                      UTR / Transaction ID <span className="text-[#19D3A2]">*</span>
                    </label>
                    <input
                      id="member-utr"
                      type="text"
                      required
                      value={utr}
                      onChange={(e) => {
                        setUtr(e.target.value);
                        if (errors.utr) {
                          setErrors((prev) => ({ ...prev, utr: undefined }));
                        }
                      }}
                      placeholder="Enter your UTR / transaction ID"
                      className={`mt-1.5 w-full min-h-[44px] rounded-[12px] border bg-[#070B12] px-3.5 py-2.5 font-mono-tabular text-sm text-[#F5F7FA] placeholder:font-sans placeholder:text-[#8D99A8]/60 focus:outline-none ${
                        errors.utr
                          ? 'border-rose-500/70 focus:border-rose-400'
                          : 'border-[#1B2735] focus:border-[#19D3A2]'
                      }`}
                    />
                    {errors.utr && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.utr}</span>
                      </p>
                    )}
                  </div>

                  {/* Payment Screenshot * */}
                  <div>
                    <label
                      htmlFor="member-screenshot"
                      className="block text-xs font-semibold text-[#F5F7FA]"
                    >
                      Payment Screenshot <span className="text-[#19D3A2]">*</span>
                    </label>
                    <p className="mt-0.5 text-[11px] text-[#8D99A8]">
                      Accepted formats: JPG, JPEG, PNG, WEBP · Max size: 5 MB
                    </p>

                    <input
                      ref={fileInputRef}
                      id="member-screenshot"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />

                    {!screenshotDataUrl ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`mt-2 flex min-h-[84px] w-full flex-col items-center justify-center gap-1.5 rounded-[12px] border border-dashed bg-[#070B12] p-4 text-center transition-colors hover:border-[#19D3A2]/50 hover:bg-[#0A1018] ${
                          errors.screenshot
                            ? 'border-rose-500/70'
                            : 'border-[#1B2735]'
                        }`}
                      >
                        <Upload className="h-5 w-5 text-[#19D3A2]" />
                        <span className="text-xs font-semibold text-[#F5F7FA]">
                          Click to upload payment screenshot
                        </span>
                        <span className="text-[11px] text-[#8D99A8]">
                          JPG, JPEG, PNG or WEBP up to 5 MB
                        </span>
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-[12px] border border-[#19D3A2]/35 bg-[#070B12] p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={screenshotDataUrl}
                            alt="Uploaded payment proof preview"
                            className="h-14 w-14 shrink-0 rounded-[8px] border border-[#1B2735] object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[#F5F7FA]">
                              {screenshotFileName}
                            </p>
                            <p className="mt-0.5 font-mono-tabular text-[11px] text-[#19D3A2]">
                              {screenshotSizeLabel} · Ready to submit
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          aria-label="Remove screenshot"
                          className="inline-flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#1B2735] bg-[#0A1018] text-[#8D99A8] hover:border-rose-500/40 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {errors.screenshot && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.screenshot}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* STEP 4 — SUBMIT BUTTON */}
                <div className="mt-7">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#16E0A5] px-6 py-3.5 text-sm font-extrabold tracking-tight text-[#070B12] shadow-[0_0_24px_rgba(22,224,165,0.16)] transition-all hover:bg-[#19D3A2] disabled:opacity-60 whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>SUBMITTING PAYMENT PROOF...</span>
                      </>
                    ) : (
                      <span>SUBMIT PAYMENT &amp; REQUEST ACCESS</span>
                    )}
                  </button>

                  {/* Non-Refundable & Privacy Note */}
                  <div className="mt-3.5 space-y-1.5 text-center text-[11px] leading-relaxed text-[#8D99A8]">
                    <p>{SITE_CONFIG.pricing.nonRefundableNotePrimary}</p>
                    <p className="flex items-center justify-center gap-1.5 text-[#8D99A8]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#19D3A2] shrink-0" />
                      <span>
                        Your details &amp; screenshot are stored privately for manual verification.
                      </span>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
