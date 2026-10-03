import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { processMembershipSubmission } from './src/utils/membershipService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow up to 8MB JSON payload to support 5MB base64-encoded image uploads
  app.use(express.json({ limit: '8mb' }));

  // Helper handler for manual verification membership requests
  const handleMembershipRequest = async (req: express.Request, res: express.Response) => {
    try {
      const result = await processMembershipSubmission(req.body ?? {});
      res.status(result.statusCode).json(result.body);
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

  // Admin lookup and status management route parity for server.ts
  app.all('/api/membership/lookup', async (req, res) => {
    const lookupHandler = (await import('./api/membership/lookup')).default;
    await lookupHandler(req as any, res as any);
  });

  // Client direct blob upload token handler
  app.all('/api/membership/upload', async (req, res) => {
    const uploadHandler = (await import('./api/membership/upload.ts')).default;
    await uploadHandler(req as any, res as any);
  });

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
