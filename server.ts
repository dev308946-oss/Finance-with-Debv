import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ADMIN_EMAIL as CONFIG_ADMIN_EMAIL } from './src/config/siteConfig.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data', 'submissions');
const SCREENSHOTS_DIR = path.join(DATA_DIR, 'screenshots');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const NOTIFICATIONS_LOG_FILE = path.join(DATA_DIR, 'admin-notifications.log');

// Ensure private storage directories exist (outside public/dist)
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

export type SubmissionStatus =
  | 'Pending Verification'
  | 'Payment Verified'
  | 'Access Sent'
  | 'Rejected';

export interface StoredMembershipSubmission {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  city: string;
  utr: string;
  screenshotStoragePath: string;
  screenshotOriginalName: string;
  screenshotMimeType: string;
  screenshotSizeBytes: number;
  submittedAt: string;
  status: SubmissionStatus;
}

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeAndValidateIndianPhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}

async function sendAdminNotification(record: StoredMembershipSubmission) {
  const targetAdminEmail =
    process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== 'YOUR_ADMIN_EMAIL_HERE'
      ? process.env.ADMIN_EMAIL
      : CONFIG_ADMIN_EMAIL;

  const subject = 'New Finance With Dev Community Membership Request';
  const bodyText = [
    'New Finance With Dev Community Membership Request',
    '',
    `Name: ${record.fullName}`,
    `Email: ${record.email}`,
    `WhatsApp: ${record.whatsappNumber}`,
    `City: ${record.city || 'Not provided'}`,
    `UTR: ${record.utr}`,
    `Submitted: ${record.submittedAt}`,
    `Status: ${record.status}`,
    `Secure Submission Reference: ${record.id}`,
    `Stored Screenshot Path: ${record.screenshotStoragePath}`,
  ].join('\n');

  // Persist notification entry in private server log so admin always has a record
  const logEntry = `\n--- [${record.submittedAt}] TO: ${targetAdminEmail} ---\n${bodyText}\n`;
  fs.appendFileSync(NOTIFICATIONS_LOG_FILE, logEntry, 'utf-8');

  // Optional Resend / Webhook integration when configured in environment
  const resendApiKey = process.env.RESEND_API_KEY;
  if (
    resendApiKey &&
    targetAdminEmail &&
    targetAdminEmail !== 'YOUR_ADMIN_EMAIL_HERE'
  ) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [targetAdminEmail],
          subject,
          text: bodyText,
        }),
      });
    } catch {
      // Fail silently on external email transport errors; submission is safely persisted
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow up to 8MB JSON payload to support 5MB base64-encoded image uploads
  app.use(express.json({ limit: '8mb' }));

  // Helper handler for manual verification membership requests
  const handleMembershipRequest = async (req: express.Request, res: express.Response) => {
    try {
      const {
        fullName,
        email,
        whatsappNumber,
        city,
        utr,
        screenshotDataUrl,
        screenshotFileName,
      } = req.body ?? {};

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
        fieldErrors.whatsappNumber =
          'Please enter a valid 10-digit Indian WhatsApp number.';
      }

      // 4. Optional City
      const cleanCity =
        typeof city === 'string' ? city.trim().slice(0, 100) : '';

      // 5. Validate UTR / Transaction ID
      const cleanUtr = typeof utr === 'string' ? utr.trim() : '';
      if (!cleanUtr || cleanUtr.length < 4) {
        fieldErrors.utr = 'Please enter a valid UTR or transaction ID.';
      } else if (cleanUtr.length > 80) {
        fieldErrors.utr = 'UTR / transaction ID must be 80 characters or fewer.';
      }

      // 6. Validate Payment Screenshot
      let imageBuffer: Buffer | null = null;
      let mimeType = '';
      let fileExt = '';

      if (typeof screenshotDataUrl !== 'string' || !screenshotDataUrl.startsWith('data:')) {
        fieldErrors.screenshot = 'Please upload your payment screenshot.';
      } else {
        const commaIndex = screenshotDataUrl.indexOf(',');
        if (commaIndex === -1) {
          fieldErrors.screenshot = 'Invalid image data. Please upload a JPG, JPEG, PNG or WEBP image.';
        } else {
          const header = screenshotDataUrl.substring(0, commaIndex);
          const base64Data = screenshotDataUrl.substring(commaIndex + 1).replace(/\s/g, '');
          const headerMatch = header.match(/^data:([^;]+);base64$/i);

          if (!headerMatch) {
            fieldErrors.screenshot = 'Unsupported file format. Please upload a JPG, JPEG, PNG or WEBP image.';
          } else {
            mimeType = headerMatch[1].toLowerCase();
            fileExt = ALLOWED_MIME_TYPES[mimeType] || '';

            if (!fileExt) {
              fieldErrors.screenshot = 'Unsupported file format. Please upload a JPG, JPEG, PNG or WEBP image.';
            } else {
              try {
                imageBuffer = Buffer.from(base64Data, 'base64');
                if (imageBuffer.byteLength === 0) {
                  fieldErrors.screenshot = 'Uploaded screenshot file is empty.';
                } else if (imageBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
                  fieldErrors.screenshot = 'Screenshot exceeds the 5 MB maximum file size limit.';
                }
              } catch {
                fieldErrors.screenshot = 'Could not process screenshot image. Please try again.';
              }
            }
          }
        }
      }

      if (Object.keys(fieldErrors).length > 0 || !imageBuffer || !normalizedPhone) {
        res.status(400).json({
          success: false,
          ok: false,
          error: 'Please check the highlighted fields and try again.',
          message: 'Please check the highlighted fields and try again.',
          fieldErrors,
        });
        return;
      }

      // Create unique submission reference ID
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const submissionId = `FWD-${datePart}-${randomSuffix}`;

      // Save screenshot to private directory (never publicly exposed)
      const safeFileName = `${submissionId}.${fileExt}`;
      const screenshotFilePath = path.join(SCREENSHOTS_DIR, safeFileName);
      fs.writeFileSync(screenshotFilePath, imageBuffer);

      const newSubmission: StoredMembershipSubmission = {
        id: submissionId,
        fullName: cleanName,
        email: cleanEmail,
        whatsappNumber: normalizedPhone,
        city: cleanCity,
        utr: cleanUtr,
        screenshotStoragePath: `data/submissions/screenshots/${safeFileName}`,
        screenshotOriginalName:
          typeof screenshotFileName === 'string'
            ? screenshotFileName.slice(0, 120)
            : safeFileName,
        screenshotMimeType: mimeType,
        screenshotSizeBytes: imageBuffer.byteLength,
        submittedAt: now.toISOString(),
        status: 'Pending Verification',
      };

      // Append to private submissions.json store
      let existingSubmissions: StoredMembershipSubmission[] = [];
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        try {
          const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            existingSubmissions = parsed;
          }
        } catch {
          existingSubmissions = [];
        }
      }

      // Backend duplicate check: If the same UTR and email was submitted recently (within last 5 minutes), return the existing submission
      const recentDuplicate = existingSubmissions.find((item) => {
        if (item.utr.toLowerCase() === cleanUtr.toLowerCase() && item.email.toLowerCase() === cleanEmail) {
          const itemTime = new Date(item.submittedAt).getTime();
          const timeDiffMs = Math.abs(now.getTime() - itemTime);
          return timeDiffMs < 5 * 60 * 1000;
        }
        return false;
      });

      if (recentDuplicate) {
        // Return existing submission gracefully without creating duplicate
        res.status(200).json({
          success: true,
          ok: true,
          submissionId: recentDuplicate.id,
          submittedAt: recentDuplicate.submittedAt,
          status: recentDuplicate.status,
          isExisting: true,
        });
        return;
      }

      existingSubmissions.push(newSubmission);
      fs.writeFileSync(
        SUBMISSIONS_FILE,
        JSON.stringify(existingSubmissions, null, 2),
        'utf-8'
      );

      // Trigger admin notification
      await sendAdminNotification(newSubmission);

      // Return both success flags for maximum compatibility
      res.status(201).json({
        success: true,
        ok: true,
        submissionId: newSubmission.id,
        submittedAt: newSubmission.submittedAt,
        status: newSubmission.status,
      });
    } catch {
      res.status(500).json({
        success: false,
        ok: false,
        error: 'Unable to process your submission right now. Please try again.',
        message: 'Unable to process your submission right now. Please try again.',
      });
    }
  };

  // Register both endpoint aliases so any call succeeds
  app.post('/api/membership-requests', handleMembershipRequest);
  app.post('/api/membership/submit', handleMembershipRequest);

  // Vite middleware in development, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
