import type { IncomingMessage, ServerResponse } from 'http';
import { processMembershipSubmission } from '../../src/utils/membershipService';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse & { status?: any; json?: any }) {
  console.log('[SUBMIT_API] Handler start - Method:', req.method);

  // Enable CORS headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, ok: false, message: 'Method Not Allowed' }));
    return;
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    console.log('[SUBMIT_API] Request body parsed successfully - keys:', Object.keys(body || {}));

    const result = await processMembershipSubmission(body);

    console.log('[SUBMIT_API] Response about to be sent - Status:', result.statusCode, 'Body:', JSON.stringify(result.body));
    res.statusCode = result.statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.body));
    console.log('[SUBMIT_API] Handler completed successfully');
  } catch (error) {
    console.error('[SUBMIT_API] Caught exception with stack trace:', error instanceof Error ? error.stack : error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        ok: false,
        error: error instanceof Error ? error.message : 'Server error occurred. Please try again.',
        message: 'Server error occurred. Please try again.',
      })
    );
  }
}
