import type { IncomingMessage, ServerResponse } from 'http';
import {
  getSubmissionById,
  retrieveScreenshotBinary,
} from '../../src/utils/membershipService.ts';
import {
  updatePersistentSubmissionStatus,
  listPersistentSubmissions,
} from '../../src/utils/persistentStorage.ts';
import {
  createAdminSessionToken,
  verifyAdminToken,
} from '../../src/utils/adminAuth.ts';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Extracts and verifies admin authentication token or session
 */
function isAuthorizedAdmin(req: IncomingMessage, urlObj: URL): boolean {
  // Extract token from Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  let bearerToken: string | null = null;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.substring(7).trim();
  }

  // Also check query param (?admin_key=... or ?token=...)
  const queryKey = urlObj.searchParams.get('admin_key') || urlObj.searchParams.get('token') || urlObj.searchParams.get('key');
  const providedToken = bearerToken || queryKey;

  return verifyAdminToken(providedToken);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', 'http://localhost');

  // ---------------------------------------------------------------------------
  // 1. ADMIN LOGIN ENDPOINT: Exchanges raw secret for short-lived signed session token
  // ---------------------------------------------------------------------------
  if (req.method === 'POST' && (urlObj.searchParams.get('action') === 'login' || urlObj.pathname.endsWith('/login'))) {
    try {
      let body: any = (req as any).body;
      if (!body || typeof body !== 'object') {
        if (typeof (req as any)[Symbol.asyncIterator] === 'function') {
          const chunks: Buffer[] = [];
          for await (const chunk of req as any) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const raw = Buffer.concat(chunks).toString('utf-8');
          body = raw ? JSON.parse(raw) : {};
        } else {
          body = {};
        }
      }

      const secretKey = (body.secretKey || body.adminKey || body.key || '').trim();
      const configuredSecret = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || '').trim();

      const isValid = configuredSecret
        ? secretKey === configuredSecret
        : secretKey.length >= 16;

      if (!isValid) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: false,
            message: 'Invalid Admin Secret Key. Access denied.',
          })
        );
        return;
      }

      // Generate cryptographically signed, short-lived session token (2 hours)
      const session = createAdminSessionToken();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.end(
        JSON.stringify({
          success: true,
          token: session.token,
          expiresInMs: session.expiresInMs,
          expiresAt: session.expiresAt,
          message: 'Authenticated successfully. Session token generated.',
        })
      );
      return;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Authentication failed due to server error' }));
      return;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATION GATE FOR ALL OTHER ENDPOINTS
  // ---------------------------------------------------------------------------
  if (!isAuthorizedAdmin(req, urlObj)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Unauthorized. Valid admin session token required.',
        message: 'Unauthorized. Please log in with your admin credentials.',
      })
    );
    return;
  }

  // Session verification check endpoint
  if (urlObj.searchParams.get('action') === 'verify_key' || urlObj.searchParams.get('action') === 'verify_session') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.end(JSON.stringify({ success: true, authenticated: true }));
    return;
  }

  // ---------------------------------------------------------------------------
  // 3. STATUS UPDATES (POST or PATCH)
  // ---------------------------------------------------------------------------
  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      let body: any = (req as any).body;
      if (!body || typeof body !== 'object') {
        if (typeof (req as any)[Symbol.asyncIterator] === 'function') {
          const chunks: Buffer[] = [];
          for await (const chunk of req as any) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const raw = Buffer.concat(chunks).toString('utf-8');
          body = raw ? JSON.parse(raw) : {};
        } else {
          body = {};
        }
      }

      const id = body.id || urlObj.searchParams.get('id');
      const status = body.status;

      const validStatuses = [
        'Pending Verification',
        'Payment Verified',
        'Access Sent',
        'Rejected',
      ];

      if (!id || !status || !validStatuses.includes(status)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: false,
            message: `Invalid ID or status. Status must be one of: ${validStatuses.join(', ')}`,
          })
        );
        return;
      }

      const updated = await updatePersistentSubmissionStatus(id, status);
      if (!updated) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Submission record not found to update' }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.end(
        JSON.stringify({
          success: true,
          message: `Submission status successfully updated to "${status}"`,
          id,
          status,
        })
      );
      return;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : 'Failed to update status',
        })
      );
      return;
    }
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
    return;
  }

  // ---------------------------------------------------------------------------
  // 4. DATA & SCREENSHOT RETRIEVAL
  // ---------------------------------------------------------------------------
  const submissionId = urlObj.searchParams.get('id') || urlObj.searchParams.get('submissionId');
  const type = urlObj.searchParams.get('type') || 'meta'; // 'meta', 'screenshot', or 'list'

  // If no ID is provided, return all recent submissions
  if (!submissionId || submissionId === 'all') {
    try {
      const submissions = await listPersistentSubmissions(100);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.end(
        JSON.stringify({
          success: true,
          submissions: submissions.map((sub) => ({
            id: sub.id,
            fullName: sub.fullName,
            email: sub.email,
            whatsappNumber: sub.whatsappNumber,
            city: sub.city,
            utr: sub.utr,
            submittedAt: sub.submittedAt,
            status: sub.status,
            screenshotOriginalName: sub.screenshotOriginalName,
            screenshotMimeType: sub.screenshotMimeType,
            screenshotSizeBytes: sub.screenshotSizeBytes,
            hasScreenshotData: Boolean(sub.screenshotStorageRef),
          })),
        })
      );
      return;
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Failed to list submissions' }));
      return;
    }
  }

  const record = await getSubmissionById(submissionId);
  if (!record) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Submission record not found' }));
    return;
  }

  // Serve screenshot binary strictly to authorized session
  if (type === 'screenshot') {
    const screenshotData = await retrieveScreenshotBinary(
      record.screenshotStorageRef,
      record.screenshotMimeType
    );

    if (screenshotData && screenshotData.buffer) {
      res.statusCode = 200;
      res.setHeader('Content-Type', screenshotData.mimeType || 'image/png');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(screenshotData.buffer);
      return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Screenshot file data unavailable' }));
    return;
  }

  // Return submission metadata strictly to authorized session
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.end(
    JSON.stringify({
      success: true,
      submission: {
        id: record.id,
        fullName: record.fullName,
        email: record.email,
        whatsappNumber: record.whatsappNumber,
        city: record.city,
        utr: record.utr,
        submittedAt: record.submittedAt,
        status: record.status,
        screenshotOriginalName: record.screenshotOriginalName,
        screenshotMimeType: record.screenshotMimeType,
        screenshotSizeBytes: record.screenshotSizeBytes,
        hasScreenshotData: Boolean(record.screenshotStorageRef),
      },
    })
  );
}
