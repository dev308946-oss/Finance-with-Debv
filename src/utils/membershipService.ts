import { ADMIN_EMAIL as CONFIG_ADMIN_EMAIL } from '../config/siteConfig.ts';
import {
  findRecentSubmissionByUtrAndEmail,
  savePersistentSubmission,
  findPersistentSubmissionById,
  persistScreenshotFile,
  retrieveScreenshotBinary,
  type PersistentSubmissionRecord,
} from './persistentStorage.ts';

// Allowed mime types & extension mapping
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeAndValidateIndianPhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}

/**
 * Validates actual binary signature (magic bytes) to ensure file content matches image type
 */
export function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; detectedMime: string; ext: string } {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, detectedMime: '', ext: '' };
  }

  // JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, detectedMime: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, detectedMime: 'image/png', ext: 'png' };
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, detectedMime: 'image/webp', ext: 'webp' };
  }

  return { isValid: false, detectedMime: '', ext: '' };
}

export interface MembershipSubmissionInput {
  fullName?: unknown;
  email?: unknown;
  whatsappNumber?: unknown;
  city?: unknown;
  utr?: unknown;
  screenshotDataUrl?: unknown;
  screenshotFileName?: unknown;
}

export type SubmissionStatus =
  | 'Pending Verification'
  | 'Payment Verified'
  | 'Access Sent'
  | 'Rejected';

export type StoredMembershipSubmission = PersistentSubmissionRecord;

/**
 * Retrieve a single submission by its reference ID from the persistent database
 */
export async function getSubmissionById(id: string): Promise<PersistentSubmissionRecord | null> {
  return await findPersistentSubmissionById(id);
}

export { retrieveScreenshotBinary };

/**
 * Sends admin notification email via Resend for new membership submissions
 */
export async function sendAdminNotification(record: PersistentSubmissionRecord): Promise<{ success: boolean; error?: string }> {
  const targetAdminEmail =
    (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== 'YOUR_ADMIN_EMAIL_HERE' && process.env.ADMIN_EMAIL.trim()) ||
    CONFIG_ADMIN_EMAIL;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`[Resend Notification] RESEND_API_KEY not configured. Skipping email dispatch for submission ${record.id}.`);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  if (!targetAdminEmail) {
    console.log(`[Resend Notification] No recipient ADMIN_EMAIL found for submission ${record.id}.`);
    return { success: false, error: 'No ADMIN_EMAIL recipient' };
  }

  const appBaseUrl = (process.env.APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL || process.env.APP_URL}` : 'http://localhost:3000').replace(/^https?:\/\//, 'https://').replace(/\/$/, '');
  const adminVerificationUrl = `${appBaseUrl}/admin/membership?id=${encodeURIComponent(record.id)}`;

  const subject = `[New Membership Payment] ₹199 Received - ${record.fullName} (${record.id})`;

  const formattedDate = new Date(record.submittedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const plainText = [
    'New Membership Payment Received',
    '==================================================',
    `Submission / Reference ID: ${record.id}`,
    `Amount:                    ₹199`,
    `Member Name:               ${record.fullName}`,
    `Email:                     ${record.email}`,
    `WhatsApp Number:           ${record.whatsappNumber}`,
    `City:                      ${record.city || 'Not specified'}`,
    `UTR / Txn ID:              ${record.utr}`,
    `Submission Date/Time:      ${formattedDate} (IST)`,
    `Status:                    ${record.status}`,
    `Screenshot Proof:          ${record.screenshotOriginalName} (${Math.round(record.screenshotSizeBytes / 1024)} KB)`,
    '==================================================',
    `Review Submission on Admin Page: ${adminVerificationUrl}`,
    '',
    'Note: Membership records and payment proofs are securely protected. Authenticate with your ADMIN_SECRET_KEY on the verification page to view.',
  ].join('\n');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.025em; }
    .header p { margin: 6px 0 0 0; color: #d1fae5; font-size: 14px; font-weight: 500; }
    .content { padding: 24px; }
    .badge-bar { display: flex; justify-content: space-between; align-items: center; background: #1f2937; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
    .badge-price { font-size: 18px; font-weight: 700; color: #10b981; }
    .badge-status { background: #374151; color: #fbbf24; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table td { padding: 10px 0; border-bottom: 1px solid #1f2937; font-size: 14px; }
    .table td.label { color: #9ca3af; width: 40%; font-weight: 500; }
    .table td.value { color: #f9fafb; font-weight: 600; width: 60%; }
    .table tr:last-child td { border-bottom: none; }
    .btn-container { text-align: center; margin: 28px 0 16px 0; }
    .btn { display: inline-block; background: #10b981; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Membership Payment Received</h1>
      <p>Finance With Dev Community Verification</p>
    </div>
    <div class="content">
      <div class="badge-bar">
        <span class="badge-price">Amount Paid: ₹199</span>
        <span class="badge-status">Status: Pending Verification</span>
      </div>
      <table class="table">
        <tr>
          <td class="label">Reference ID:</td>
          <td class="value" style="font-family: monospace; color: #34d399;">${record.id}</td>
        </tr>
        <tr>
          <td class="label">Member Name:</td>
          <td class="value">${record.fullName}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td class="value"><a href="mailto:${record.email}" style="color: #60a5fa; text-decoration: none;">${record.email}</a></td>
        </tr>
        <tr>
          <td class="label">WhatsApp Number:</td>
          <td class="value"><a href="https://wa.me/${record.whatsappNumber.replace('+', '')}" style="color: #34d399; text-decoration: none;">${record.whatsappNumber}</a></td>
        </tr>
        <tr>
          <td class="label">City:</td>
          <td class="value">${record.city || 'Not provided'}</td>
        </tr>
        <tr>
          <td class="label">UTR / Txn ID:</td>
          <td class="value" style="font-family: monospace;">${record.utr}</td>
        </tr>
        <tr>
          <td class="label">Submission Time:</td>
          <td class="value">${formattedDate} (IST)</td>
        </tr>
        <tr>
          <td class="label">Payment Screenshot:</td>
          <td class="value">${record.screenshotOriginalName} (${Math.round(record.screenshotSizeBytes / 1024)} KB)</td>
        </tr>
      </table>
      <div class="btn-container">
        <a href="${adminVerificationUrl}" class="btn">Review Submission & Proof</a>
      </div>
      <p class="footer">
        This record is permanently stored in PostgreSQL and payment screenshot in Vercel Blob.<br>
        Admin endpoint is protected with your secret key.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const fromAddress =
      process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim()
        ? process.env.EMAIL_FROM.trim()
        : 'Finance With Dev <onboarding@resend.dev>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [targetAdminEmail.trim()],
        subject,
        text: plainText,
        html: htmlContent,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`[Resend Notification Error] Failed to dispatch email for ${record.id}:`, data);
      return { success: false, error: JSON.stringify(data) };
    }

    console.log(`[Resend Notification] Successfully delivered email notification for ${record.id} to ${targetAdminEmail} (Resend ID: ${data.id})`);
    return { success: true };
  } catch (err) {
    console.error(`[Resend Notification Exception] Error sending notification for ${record.id}:`, err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function processMembershipSubmission(body: MembershipSubmissionInput): Promise<{
  statusCode: number;
  body: Record<string, any>;
}> {
  const {
    fullName,
    email,
    whatsappNumber,
    city,
    utr,
    screenshotDataUrl,
    screenshotFileName,
  } = body ?? {};

  const fieldErrors: Record<string, string> = {};

  // 1. Validate Full Name
  const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
  if (!cleanName || cleanName.length < 2) {
    fieldErrors.fullName = 'Please enter your full name.';
  } else if (cleanName.length > 120) {
    fieldErrors.fullName = 'Name must be 120 characters or fewer.';
  }

  // 2. Validate Email
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  // 3. Validate Indian WhatsApp Number
  const rawPhone = typeof whatsappNumber === 'string' ? whatsappNumber.trim() : '';
  const normalizedPhone = normalizeAndValidateIndianPhone(rawPhone);
  if (!normalizedPhone) {
    fieldErrors.whatsappNumber = 'Please enter a valid 10-digit Indian WhatsApp number.';
  }

  // 4. Optional City
  const cleanCity = typeof city === 'string' ? city.trim().slice(0, 100) : '';

  // 5. Validate UTR / Transaction ID
  const cleanUtr = typeof utr === 'string' ? utr.trim() : '';
  if (!cleanUtr || cleanUtr.length < 4) {
    fieldErrors.utr = 'Please enter a valid UTR or transaction ID.';
  } else if (cleanUtr.length > 80) {
    fieldErrors.utr = 'UTR / transaction ID must be 80 characters or fewer.';
  }

  // 6. Validate Payment Screenshot Header & Actual Binary Magic Bytes
  let imageBuffer: Buffer | null = null;
  let mimeType = '';
  let fileExt = '';
  const rawScreenshotStr = typeof screenshotDataUrl === 'string' ? screenshotDataUrl : '';

  if (!rawScreenshotStr || !rawScreenshotStr.startsWith('data:')) {
    fieldErrors.screenshot = 'Please upload your payment screenshot.';
  } else {
    const commaIndex = rawScreenshotStr.indexOf(',');
    if (commaIndex === -1) {
      fieldErrors.screenshot = 'Invalid image data. Please upload a JPG, JPEG, PNG or WEBP image.';
    } else {
      const header = rawScreenshotStr.substring(0, commaIndex);
      const base64Data = rawScreenshotStr.substring(commaIndex + 1).replace(/\s/g, '');
      const headerMatch = header.match(/^data:([^;]+);base64$/i);

      if (!headerMatch) {
        fieldErrors.screenshot = 'Unsupported file format. Please upload a JPG, JPEG, PNG or WEBP image.';
      } else {
        const declaredMime = headerMatch[1].toLowerCase();
        fileExt = ALLOWED_MIME_TYPES[declaredMime] || '';

        if (!fileExt) {
          fieldErrors.screenshot = 'Unsupported file format. Please upload a JPG, JPEG, PNG or WEBP image.';
        } else {
          try {
            imageBuffer = Buffer.from(base64Data, 'base64');
            if (imageBuffer.byteLength === 0) {
              fieldErrors.screenshot = 'Uploaded screenshot file is empty.';
            } else if (imageBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
              fieldErrors.screenshot = 'Screenshot exceeds the 5 MB maximum file size limit.';
            } else {
              // Deep inspection: verify actual binary magic bytes match genuine image
              const magicCheck = validateImageMagicBytes(imageBuffer);
              if (!magicCheck.isValid) {
                fieldErrors.screenshot = 'Invalid image file content. Please upload a genuine JPG, JPEG, PNG or WEBP image.';
              } else {
                mimeType = magicCheck.detectedMime;
                fileExt = magicCheck.ext;
              }
            }
          } catch {
            fieldErrors.screenshot = 'Could not process screenshot image. Please try again.';
          }
        }
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0 || !imageBuffer || !normalizedPhone) {
    return {
      statusCode: 400,
      body: {
        success: false,
        ok: false,
        error: 'Please check the highlighted fields and try again.',
        message: 'Please check the highlighted fields and try again.',
        fieldErrors,
      },
    };
  }

  // 7. Duplicate check against persistent database (Same UTR & email recently submitted)
  const recentDuplicate = await findRecentSubmissionByUtrAndEmail(cleanUtr, cleanEmail);
  if (recentDuplicate) {
    // Return existing submission confirmation without re-sending duplicate emails or leaking data
    return {
      statusCode: 200,
      body: {
        success: true,
        ok: true,
        submissionId: recentDuplicate.id,
        submittedAt: recentDuplicate.submittedAt,
        status: recentDuplicate.status,
        isExisting: true,
      },
    };
  }

  // 8. Generate unique Reference ID
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const submissionId = `FWD-${datePart}-${randomSuffix}`;

  // 9. Persist Screenshot to Object/Blob Storage (Vercel Blob / S3)
  const screenshotStorageRef = await persistScreenshotFile(
    submissionId,
    fileExt,
    imageBuffer,
    mimeType
  );

  // 10. Persist Record to Database
  const newRecord: PersistentSubmissionRecord = {
    id: submissionId,
    fullName: cleanName,
    email: cleanEmail,
    whatsappNumber: normalizedPhone,
    city: cleanCity,
    utr: cleanUtr,
    status: 'Pending Verification',
    submittedAt: now.toISOString(),
    screenshotStorageRef,
    screenshotOriginalName:
      typeof screenshotFileName === 'string'
        ? screenshotFileName.slice(0, 120)
        : `${submissionId}.${fileExt}`,
    screenshotMimeType: mimeType,
    screenshotSizeBytes: imageBuffer.byteLength,
  };

  await savePersistentSubmission(newRecord);

  // 11. Send admin notification ONLY AFTER successful database & blob persistence
  sendAdminNotification(newRecord).catch((err) => {
    console.error('[Admin Notification Error]:', err);
  });

  // 12. Return strictly minimal public confirmation response (no PII or raw binaries)
  return {
    statusCode: 201,
    body: {
      success: true,
      ok: true,
      submissionId: newRecord.id,
      submittedAt: newRecord.submittedAt,
      status: newRecord.status,
    },
  };
}
