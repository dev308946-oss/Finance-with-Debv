import type { IncomingMessage, ServerResponse } from 'http';
import { handleUpload } from '@vercel/blob/client';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      if (typeof (req as any)[Symbol.asyncIterator] === 'function') {
        const chunks: Buffer[] = [];
        for await (const chunk of req as any) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const raw = Buffer.concat(chunks).toString('utf-8');
        body = raw ? JSON.parse(raw) : {};
      }
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'BLOB_READ_WRITE_TOKEN is not configured on the server.',
        })
      );
      return;
    }

    const jsonResponse = await handleUpload({
      body,
      request: req,
      token,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 15 * 1024 * 1024, // Allow up to 15 MB high-resolution screenshots
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Vercel Blob Client Upload Completed]:', blob.url);
      },
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jsonResponse));
  } catch (error) {
    console.error('[Blob Client Upload Error]:', error);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process blob upload token',
      })
    );
  }
}
