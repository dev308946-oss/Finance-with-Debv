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
  Copy,
} from 'lucide-react';
import {
  SITE_CONFIG,
  PAYMENT_LINK,
  OFFICIAL_UPI_ID,
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

function normalizeErrorMessage(err: unknown): string {
  if (!err) {
    return 'An unexpected error occurred. Please try again.';
  }

  // 1. String primitive
  if (typeof err === 'string') {
    return err.trim() || 'An unexpected error occurred. Please try again.';
  }

  // 2. Standard Error instance
  if (err instanceof Error) {
    return err.message || 'An error occurred. Please try again.';
  }

  // 3. Array of errors or strings
  if (Array.isArray(err)) {
    const list = err.map(normalizeErrorMessage).filter(Boolean);
    return list.length > 0 ? list.join(' · ') : 'An unexpected error occurred.';
  }

  // 4. Object structures
  if (typeof err === 'object') {
    const obj = err as Record<string, any>;

    // Case: { message: "..." }
    if (obj.message && typeof obj.message === 'string') {
      return obj.message;
    }

    // Case: { error: "..." or error: { ... } }
    if (obj.error) {
      if (typeof obj.error === 'string') {
        return obj.error;
      }
      return normalizeErrorMessage(obj.error);
    }

    // Case: { errors: { field: "..." } or errors: [...] }
    if (obj.errors) {
      if (typeof obj.errors === 'string') {
        return obj.errors;
      }
      if (Array.isArray(obj.errors)) {
        return obj.errors.map(normalizeErrorMessage).filter(Boolean).join(' · ');
      }
      if (typeof obj.errors === 'object') {
        const fieldMsgs = Object.values(obj.errors).map(normalizeErrorMessage).filter(Boolean);
        if (fieldMsgs.length > 0) {
          return fieldMsgs.join(' · ');
        }
      }
    }

    // Case: { fieldErrors: { ... } }
    if (obj.fieldErrors && typeof obj.fieldErrors === 'object') {
      const fieldMsgs = Object.values(obj.fieldErrors).map(normalizeErrorMessage).filter(Boolean);
      if (fieldMsgs.length > 0) {
        return fieldMsgs.join(' · ');
      }
    }

    // Fallback: serialize safely to string
    try {
      const serialized = JSON.stringify(obj);
      if (serialized && serialized !== '{}') {
        return serialized;
      }
    } catch {
      // Fall through to default
    }
  }

  return 'An unexpected error occurred. Please try again.';
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
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    submissionId: string;
    submittedAt: string;
    status: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  if (!activeModal) return null;

  const isReportViewer = activeModal.type === 'closing_bell_sample';

  const detailsComplete =
    fullName.trim().length >= 2 &&
    isValidEmail(email) &&
    isValidIndianPhone(whatsappNumber);

  const confirmStarted = Boolean(utr.trim() || screenshotDataUrl);

  const currentStep: 1 | 2 | 3 = confirmStarted
    ? 3
    : detailsComplete
    ? 2
    : 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Please upload a JPG, PNG or WEBP image.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Screenshot size must be under 5 MB.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotDataUrl(reader.result);
        setScreenshotFileName(file.name);
        const kb = (file.size / 1024).toFixed(0);
        setScreenshotSizeLabel(`${kb} KB`);
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

    if (isSubmitting) {
      return;
    }

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        whatsappNumber: whatsappNumber.trim(),
        city: city.trim(),
        utr: utr.trim(),
        screenshotDataUrl,
        screenshotFileName,
      });

      // Try primary endpoint /api/membership/submit first, and fallback to /api/membership-requests if 404 or HTML
      let response = await fetch('/api/membership/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: payload,
      });

      let contentType = response.headers.get('content-type') || '';

      // If the primary route was not found or returned non-JSON, try fallback endpoint
      if (response.status === 404 || !contentType.includes('application/json')) {
        try {
          const fallbackResponse = await fetch('/api/membership-requests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: payload,
          });

          const fallbackContentType = fallbackResponse.headers.get('content-type') || '';
          if (fallbackContentType.includes('application/json')) {
            response = fallbackResponse;
            contentType = fallbackContentType;
          }
        } catch {
          // If fallback fails, continue with original response
        }
      }

      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      } else {
        // Response is HTML or plain text (e.g. 404 / 502 page from proxy/CDN)
        const text = await response.text();
        console.warn('Server returned non-JSON response:', text.slice(0, 200));
      }

      if (!response.ok) {
        // Extract human-readable error from server response
        let readableError = '';
        if (data) {
          if (data.message && typeof data.message === 'string') {
            readableError = data.message;
          } else if (data.error && typeof data.error === 'string') {
            readableError = data.error;
          } else if (data.error || data.message || data.errors || data.fieldErrors) {
            readableError = normalizeErrorMessage(data.error || data.message || data.errors || data.fieldErrors);
          }
        }

        if (!readableError) {
          readableError = `Submission failed (${response.status}). Please check your details and try again.`;
        }

        // Safely extract field-level errors as strings
        const nextFieldErrors: FormFieldErrors = { general: readableError };
        const rawFieldErrors = data?.fieldErrors || data?.errors;
        if (rawFieldErrors && typeof rawFieldErrors === 'object' && !Array.isArray(rawFieldErrors)) {
          for (const [key, val] of Object.entries(rawFieldErrors)) {
            if (val) {
              (nextFieldErrors as Record<string, string>)[key] = normalizeErrorMessage(val);
            }
          }
        }

        setErrors(nextFieldErrors);
        throw new Error(readableError);
      }

      const isSuccessful = data && (data.success === true || data.ok === true);
      if (!isSuccessful || !data.submissionId) {
        const fallbackMsg = data
          ? normalizeErrorMessage(data.error || data.message || data)
          : 'Submission could not be confirmed. Please try again.';
        throw new Error(fallbackMsg);
      }

      setSubmittedRecord({
        submissionId: String(data.submissionId),
        submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : new Date().toISOString(),
        status: typeof data.status === 'string' ? data.status : 'Pending Verification',
      });

      trackEvent(SITE_CONFIG.analytics.events.paymentFormSubmit, {
        submissionId: String(data.submissionId),
        utr: utr.trim(),
      });
    } catch (err) {
      const normalizedGeneralError = normalizeErrorMessage(err);
      setErrors((prev) => ({
        ...prev,
        general: normalizedGeneralError,
      }));
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

        {/* MODAL 3: MANUAL MEMBERSHIP PAYMENT & VERIFICATION FLOW */}
        {activeModal.type === 'payment' && (
          <>
            {submittedRecord ? (
              /* STEP 5 — SUCCESS SCREEN */
              <div className="py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#059669]/30 bg-[#ECFDF5] text-[#059669]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <h2
                  id="modal-heading"
                  className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0F172A]"
                >
                  Payment proof submitted successfully ✓
                </h2>

                <p className="mt-1.5 text-sm font-semibold text-[#059669]">
                  Your membership is pending verification.
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Thank you for joining Finance With Dev Community. Your payment details and proof have been securely received.
                </p>

                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#0F172A]">
                  Once your payment is verified, your community access details will be shared with you on WhatsApp/email.
                </p>

                <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                  Please keep your payment confirmation available until verification is complete.
                </p>

                {/* Submission Reference & Status Summary */}
                <div className="mt-5 space-y-2 rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Status</span>
                    <span className="font-mono-tabular font-bold text-[#D97706]">
                      {submittedRecord.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2">
                    <span className="text-[#64748B]">Reference ID</span>
                    <span className="font-mono-tabular font-semibold text-[#0F172A]">
                      {submittedRecord.submissionId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2">
                    <span className="text-[#64748B]">UTR / Transaction ID</span>
                    <span className="font-mono-tabular text-[#0F172A]">
                      {utr}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-[#0F172A] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1E293B]"
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
                    className="font-display text-xl font-bold tracking-tight text-[#0F172A]"
                  >
                    Join Finance With Dev Community
                  </h2>
                  <p className="mt-0.5 font-mono-tabular text-base font-bold text-[#059669]">
                    {SITE_CONFIG.pricing.compactPrice}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#475569] sm:text-[13px]">
                    Fill in your details, complete the ₹199 payment and submit your payment proof. Your membership will be verified manually.
                  </p>
                </div>

                {/* Progress Indicator: 01 DETAILS -> 02 PAYMENT -> 03 CONFIRM */}
                <div
                  aria-label="Checkout steps"
                  className="mt-4 flex items-center justify-between rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 font-mono-tabular text-[11px] font-semibold"
                >
                  <span
                    className={
                      currentStep >= 1 ? 'text-[#0F172A] font-bold' : 'text-[#64748B]'
                    }
                  >
                    01 DETAILS
                  </span>
                  <span aria-hidden="true" className="text-[#CBD5E1]">
                    →
                  </span>
                  <span
                    className={
                      currentStep >= 2 ? 'text-[#0F172A] font-bold' : 'text-[#64748B]'
                    }
                  >
                    02 PAYMENT
                  </span>
                  <span aria-hidden="true" className="text-[#CBD5E1]">
                    →
                  </span>
                  <span
                    className={
                      currentStep === 3 ? 'text-[#0F172A] font-bold' : 'text-[#64748B]'
                    }
                  >
                    03 CONFIRM
                  </span>
                </div>

                {/* General Error Banner */}
                {errors.general && (
                  <div className="mt-3.5 flex items-start gap-2 rounded-[8px] border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <span>{normalizeErrorMessage(errors.general)}</span>
                  </div>
                )}

                {/* STEP 1 — PERSONAL DETAILS */}
                <div className="mt-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#0F172A]">
                      01 · YOUR DETAILS
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      * Required fields
                    </span>
                  </div>

                  {/* Full Name * */}
                  <div>
                    <label
                      htmlFor="member-full-name"
                      className="block text-xs font-semibold text-[#0F172A]"
                    >
                      Full Name <span className="text-rose-500">*</span>
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
                      className={`mt-1 w-full min-h-[40px] rounded-[6px] border bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none ${
                        errors.fullName
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-[#CBD5E1] focus:border-[#0F172A]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address * */}
                  <div>
                    <label
                      htmlFor="member-email"
                      className="block text-xs font-semibold text-[#0F172A]"
                    >
                      Email Address <span className="text-rose-500">*</span>
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
                      className={`mt-1 w-full min-h-[40px] rounded-[6px] border bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none ${
                        errors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-[#CBD5E1] focus:border-[#0F172A]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Number * & City */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="member-whatsapp"
                        className="block text-xs font-semibold text-[#0F172A]"
                      >
                        WhatsApp Number <span className="text-rose-500">*</span>
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
                        placeholder="Enter 10-digit number"
                        className={`mt-1 w-full min-h-[40px] rounded-[6px] border bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none ${
                          errors.whatsappNumber
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-[#CBD5E1] focus:border-[#0F172A]'
                        }`}
                      />
                      {errors.whatsappNumber && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{errors.whatsappNumber}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="member-city"
                        className="block text-xs font-semibold text-[#0F172A]"
                      >
                        City <span className="text-[#64748B] font-normal">(Optional)</span>
                      </label>
                      <input
                        id="member-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter your city"
                        className="mt-1 w-full min-h-[40px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F172A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2 — COMPLETE YOUR PAYMENT VIA UPI */}
                <div className="mt-6 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-bold tracking-wider text-[#0F172A]">
                      02 · COMPLETE YOUR PAYMENT
                    </span>
                    <span className="font-mono-tabular text-[#64748B]">
                      Manual UPI Verification
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
                    Pay <strong className="text-[#0F172A]">₹199</strong> to the UPI ID above using any UPI app (GPay, PhonePe, Paytm, etc.). Then enter your UTR / Transaction ID and upload your payment screenshot below.
                  </p>
                </div>

                {/* STEP 3 — CONFIRM PAYMENT (UTR + SCREENSHOT) */}
                <div className="mt-6 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#0F172A]">
                      03 · CONFIRM PAYMENT
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Proof of payment
                    </span>
                  </div>

                  {/* UTR / Transaction ID * */}
                  <div>
                    <label
                      htmlFor="member-utr"
                      className="block text-xs font-semibold text-[#0F172A]"
                    >
                      UTR / Transaction ID <span className="text-rose-500">*</span>
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
                      className={`mt-1 w-full min-h-[40px] rounded-[6px] border bg-white px-3 py-2 font-mono-tabular text-sm text-[#0F172A] placeholder:font-sans placeholder:text-[#94A3B8] focus:outline-none ${
                        errors.utr
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-[#CBD5E1] focus:border-[#0F172A]'
                      }`}
                    />
                    {errors.utr && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.utr}</span>
                      </p>
                    )}
                  </div>

                  {/* Payment Screenshot * */}
                  <div>
                    <label
                      htmlFor="member-screenshot"
                      className="block text-xs font-semibold text-[#0F172A]"
                    >
                      Payment Screenshot <span className="text-rose-500">*</span>
                    </label>
                    <p className="mt-0.5 text-[11px] text-[#64748B]">
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
                        className={`mt-2 flex min-h-[80px] w-full flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed bg-[#F8FAFC] p-4 text-center transition-colors hover:bg-[#F1F5F9] ${
                          errors.screenshot
                            ? 'border-rose-400'
                            : 'border-[#CBD5E1]'
                        }`}
                      >
                        <Upload className="h-4 w-4 text-[#0F172A]" />
                        <span className="text-xs font-semibold text-[#0F172A]">
                          Click to upload payment screenshot
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          JPG, JPEG, PNG or WEBP up to 5 MB
                        </span>
                      </button>
                    ) : (
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-[8px] border border-[#CBD5E1] bg-white p-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={screenshotDataUrl}
                            alt="Uploaded payment proof preview"
                            className="h-12 w-12 shrink-0 rounded-[6px] border border-[#E2E8F0] object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[#0F172A]">
                              {screenshotFileName}
                            </p>
                            <p className="mt-0.5 font-mono-tabular text-[11px] text-[#059669]">
                              {screenshotSizeLabel} · Ready to submit
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          aria-label="Remove screenshot"
                          className="inline-flex min-h-[34px] min-w-[34px] shrink-0 items-center justify-center rounded-[6px] border border-[#CBD5E1] bg-white text-[#64748B] hover:border-rose-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {errors.screenshot && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.screenshot}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* STEP 4 — SUBMIT BUTTON */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#0F172A] px-5 py-2.5 text-sm font-bold tracking-tight text-white shadow-sm transition-all hover:bg-[#1E293B] disabled:opacity-60 whitespace-nowrap"
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
                  <div className="mt-3 space-y-1 text-center text-[11px] leading-relaxed text-[#64748B]">
                    <p>{SITE_CONFIG.pricing.nonRefundableNotePrimary}</p>
                    <p className="flex items-center justify-center gap-1 text-[#64748B]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#059669] shrink-0" />
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
