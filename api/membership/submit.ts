import type { IncomingMessage, ServerResponse } from 'http';
import { processMembershipSubmission } from '../../src/utils/membershipService.ts';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse & { status?: any; json?: any }) {
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
    if (!body) {
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

    const result = await processMembershipSubmission(body);

    res.statusCode = result.statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.body));
  } catch (error) {
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
