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
  screenshotStorageRef?: unknown;
  screenshotDataUrl?: unknown;
  screenshotFileName?: unknown;
  screenshotMimeType?: unknown;
  screenshotSizeBytes?: unknown;
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
    screenshotStorageRef: rawStorageRef,
    screenshotDataUrl,
    screenshotFileName,
    screenshotMimeType: clientMimeType,
    screenshotSizeBytes: clientSizeBytes,
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

  // 6. Validate Payment Screenshot (Direct Vercel Blob URL or base64 fallback)
  let finalScreenshotStorageRef = '';
  let imageBuffer: Buffer | null = null;
  let mimeType = '';
  let fileExt = '';
  let finalSizeBytes = typeof clientSizeBytes === 'number' ? clientSizeBytes : 0;

  const directBlobUrl = typeof rawStorageRef === 'string' ? rawStorageRef.trim() : '';
  const rawScreenshotStr = typeof screenshotDataUrl === 'string' ? screenshotDataUrl : '';

  if (directBlobUrl && (directBlobUrl.startsWith('https://') || directBlobUrl.startsWith('http://'))) {
    // Direct client upload path
    finalScreenshotStorageRef = directBlobUrl;
    mimeType = typeof clientMimeType === 'string' && clientMimeType ? clientMimeType : 'image/png';
    fileExt = ALLOWED_MIME_TYPES[mimeType] || (directBlobUrl.endsWith('.jpg') || directBlobUrl.endsWith('.jpeg') ? 'jpg' : directBlobUrl.endsWith('.webp') ? 'webp' : 'png');
    if (!finalSizeBytes) {
      finalSizeBytes = 100 * 1024; // Default estimate if not passed
    }
  } else if (rawScreenshotStr && rawScreenshotStr.startsWith('data:')) {
    // Base64 fallback path
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
                finalSizeBytes = imageBuffer.byteLength;
              }
            }
          } catch {
            fieldErrors.screenshot = 'Could not process screenshot image. Please try again.';
          }
        }
      }
    }
  } else {
    fieldErrors.screenshot = 'Please upload your payment screenshot.';
  }

  if (Object.keys(fieldErrors).length > 0 || (!finalScreenshotStorageRef && !imageBuffer) || !normalizedPhone) {
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

  // 9. Persist Screenshot (if not already uploaded via client direct upload)
  if (!finalScreenshotStorageRef && imageBuffer) {
    finalScreenshotStorageRef = await persistScreenshotFile(
      submissionId,
      fileExt,
      imageBuffer,
      mimeType
    );
  }

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
    screenshotStorageRef: finalScreenshotStorageRef,
    screenshotOriginalName:
      typeof screenshotFileName === 'string' && screenshotFileName
        ? screenshotFileName.slice(0, 120)
        : `${submissionId}.${fileExt || 'png'}`,
    screenshotMimeType: mimeType || 'image/png',
    screenshotSizeBytes: finalSizeBytes,
  };

  await savePersistentSubmission(newRecord);

  // 11. Return strictly minimal public confirmation response (no PII or raw binaries)
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
