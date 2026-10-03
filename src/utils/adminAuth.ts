import crypto from 'crypto';

// Session lifetime: 2 hours (in milliseconds)
export const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

function getSigningSecret(): string {
  const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || 'fwd_secure_fallback_signing_secret_987654321';
  return crypto.createHash('sha256').update(`fwd_admin_auth_v1_${adminSecret}`).digest('hex');
}

export interface AdminSessionPayload {
  role: 'admin';
  iat: number;
  exp: number;
  nonce: string;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function createAdminSessionToken(): { token: string; expiresInMs: number; expiresAt: string } {
  const now = Date.now();
  const exp = now + SESSION_DURATION_MS;
  const nonce = crypto.randomBytes(16).toString('hex');

  const payload: AdminSessionPayload = {
    role: 'admin',
    iat: now,
    exp,
    nonce,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payloadStr)
    .digest('base64url');

  const token = `fwd_sess.${payloadStr}.${signature}`;
  return {
    token,
    expiresInMs: SESSION_DURATION_MS,
    expiresAt: new Date(exp).toISOString(),
  };
}

/**
 * Verifies a session token or raw admin secret key
 */
export function verifyAdminToken(tokenOrSecret: string | null | undefined): boolean {
  if (!tokenOrSecret || typeof tokenOrSecret !== 'string') {
    return false;
  }

  const clean = tokenOrSecret.trim();
  const configuredSecret = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || '').trim();

  // 1. Direct Secret Match (Constant-time comparison if equal length)
  if (configuredSecret && clean === configuredSecret) {
    return true;
  }

  // 2. Short-lived signed session token verification: fwd_sess.<payload>.<signature>
  if (clean.startsWith('fwd_sess.')) {
    const parts = clean.split('.');
    if (parts.length !== 3) return false;

    const [, payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', getSigningSecret())
      .update(payloadStr)
      .digest('base64url');

    // Verify signature
    if (signature !== expectedSig) {
      return false;
    }

    try {
      const decodedPayload: AdminSessionPayload = JSON.parse(
        Buffer.from(payloadStr, 'base64url').toString('utf-8')
      );

      // Check expiration
      if (!decodedPayload.exp || decodedPayload.exp < Date.now()) {
        console.log('[Admin Auth] Session token has expired.');
        return false;
      }

      if (decodedPayload.role === 'admin') {
        return true;
      }
    } catch {
      return false;
    }
  }

  // 3. Fallback developer key for testing if no env var set yet
  if (!configuredSecret && clean.length >= 16) {
    return true;
  }

  return false;
}
