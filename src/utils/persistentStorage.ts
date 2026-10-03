import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export interface PersistentSubmissionRecord {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  city: string;
  utr: string;
  status: string;
  submittedAt: string;
  screenshotStorageRef: string;
  screenshotOriginalName: string;
  screenshotMimeType: string;
  screenshotSizeBytes: number;
}

// ---------------------------------------------------------------------------
// 1. DATABASE LAYER (PostgreSQL / Neon / Supabase / Vercel Postgres)
// ---------------------------------------------------------------------------

export function getDatabaseConnectionString(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    null
  );
}

let isTableInitialized = false;

export async function ensureDatabaseSchema(sql?: any) {
  if (isTableInitialized) return;
  const dbUrl = getDatabaseConnectionString();
  if (!dbUrl) return;

  const sqlClient = sql || neon(dbUrl);
  try {
    await sqlClient`
      CREATE TABLE IF NOT EXISTS membership_submissions (
        id VARCHAR(100) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(50) NOT NULL,
        city VARCHAR(255),
        utr VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        submitted_at TIMESTAMPTZ NOT NULL,
        screenshot_storage_ref TEXT NOT NULL,
        screenshot_original_name VARCHAR(255) NOT NULL,
        screenshot_mime_type VARCHAR(100) NOT NULL,
        screenshot_size_bytes INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sqlClient`
      CREATE INDEX IF NOT EXISTS idx_membership_utr_email 
      ON membership_submissions (utr, email);
    `;
    await sqlClient`
      CREATE INDEX IF NOT EXISTS idx_membership_submitted_at 
      ON membership_submissions (submitted_at DESC);
    `;
    isTableInitialized = true;
    console.log('[PostgreSQL] Database schema and indexes verified successfully.');
  } catch (error) {
    console.error('[PostgreSQL] Error initializing database schema:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// 2. BLOB / OBJECT STORAGE LAYER (@vercel/blob)
// ---------------------------------------------------------------------------

export function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

/**
 * Persists screenshot buffer to persistent Vercel Blob storage (or local fallback in dev)
 */
export async function persistScreenshotFile(
  submissionId: string,
  fileExt: string,
  imageBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const blobToken = getBlobToken();
  const filename = `screenshots/${submissionId}.${fileExt}`;

  // Production path: Vercel Blob Storage
  if (blobToken) {
    try {
      const blobResult = await put(filename, imageBuffer, {
        access: 'public', // Blob URL has randomized crypto hash
        token: blobToken,
        contentType: mimeType,
      });
      console.log(`[Vercel Blob] Uploaded screenshot for ${submissionId} to ${blobResult.url}`);
      return blobResult.url;
    } catch (err) {
      console.error('[Vercel Blob] Failed to upload screenshot to Vercel Blob:', err);
      throw new Error(`Failed to upload screenshot to persistent blob storage: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Local/Development fallback storage
  let baseDir = path.join(process.cwd(), 'data', 'submissions', 'screenshots');
  try {
    fs.mkdirSync(baseDir, { recursive: true });
  } catch {
    baseDir = path.join('/tmp', 'data', 'submissions', 'screenshots');
    try {
      fs.mkdirSync(baseDir, { recursive: true });
    } catch {
      // Ignore
    }
  }

  const localFilePath = path.join(baseDir, `${submissionId}.${fileExt}`);
  try {
    fs.writeFileSync(localFilePath, imageBuffer);
    return `local:${localFilePath}`;
  } catch {
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
  }
}

/**
 * Retrieves the raw screenshot image binary from persistent blob or storage ref
 */
export async function retrieveScreenshotBinary(
  storageRef: string,
  mimeType: string
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  if (!storageRef) return null;

  // 1. Check if it's a Vercel Blob / HTTPS URL
  if (storageRef.startsWith('http://') || storageRef.startsWith('https://')) {
    try {
      const resp = await fetch(storageRef);
      if (resp.ok) {
        const arrayBuf = await resp.arrayBuffer();
        const detectedMime = resp.headers.get('content-type') || mimeType || 'image/png';
        return { buffer: Buffer.from(arrayBuf), mimeType: detectedMime };
      }
    } catch (err) {
      console.error('[Storage] Error fetching screenshot from persistent blob URL:', err);
    }
  }

  // 2. Check if it's a local file path
  if (storageRef.startsWith('local:')) {
    const filePath = storageRef.slice(6);
    if (fs.existsSync(filePath)) {
      try {
        const buf = fs.readFileSync(filePath);
        return { buffer: buf, mimeType: mimeType || 'image/png' };
      } catch (err) {
        console.error('[Storage] Error reading screenshot from local file:', err);
      }
    }
  }

  // 3. Check if stored as base64 data URI
  if (storageRef.startsWith('data:')) {
    const commaIdx = storageRef.indexOf(',');
    if (commaIdx !== -1) {
      const base64Str = storageRef.substring(commaIdx + 1);
      return { buffer: Buffer.from(base64Str, 'base64'), mimeType: mimeType || 'image/png' };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// 3. COMBINED RECORD PERSISTENCE
// ---------------------------------------------------------------------------

// Fallback in-memory and disk cache for dev/offline testing
const localFallbackMap = new Map<string, PersistentSubmissionRecord>();

export async function findRecentSubmissionByUtrAndEmail(
  utr: string,
  email: string
): Promise<PersistentSubmissionRecord | null> {
  const dbUrl = getDatabaseConnectionString();

  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureDatabaseSchema(sql);

      // Query database for recent submission with same UTR and email (last 10 minutes)
      const rows = await sql`
        SELECT 
          id,
          full_name AS "fullName",
          email,
          whatsapp_number AS "whatsappNumber",
          city,
          utr,
          status,
          submitted_at AS "submittedAt",
          screenshot_storage_ref AS "screenshotStorageRef",
          screenshot_original_name AS "screenshotOriginalName",
          screenshot_mime_type AS "screenshotMimeType",
          screenshot_size_bytes AS "screenshotSizeBytes"
        FROM membership_submissions
        WHERE LOWER(utr) = LOWER(${utr})
          AND LOWER(email) = LOWER(${email})
          AND submitted_at >= NOW() - INTERVAL '10 minutes'
        LIMIT 1;
      `;

      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        return {
          id: row.id,
          fullName: row.fullName,
          email: row.email,
          whatsappNumber: row.whatsappNumber,
          city: row.city || '',
          utr: row.utr,
          status: row.status,
          submittedAt: new Date(row.submittedAt).toISOString(),
          screenshotStorageRef: row.screenshotStorageRef,
          screenshotOriginalName: row.screenshotOriginalName,
          screenshotMimeType: row.screenshotMimeType,
          screenshotSizeBytes: row.screenshotSizeBytes,
        };
      }
      return null;
    } catch (err) {
      console.error('[PostgreSQL] Error querying database for duplicate UTR:', err);
      throw err;
    }
  }

  // Fallback check in local cache
  const now = Date.now();
  for (const item of localFallbackMap.values()) {
    if (
      item.utr.toLowerCase() === utr.toLowerCase() &&
      item.email.toLowerCase() === email.toLowerCase()
    ) {
      const timeDiff = Math.abs(now - new Date(item.submittedAt).getTime());
      if (timeDiff < 10 * 60 * 1000) {
        return item;
      }
    }
  }

  return null;
}

export async function savePersistentSubmission(
  record: PersistentSubmissionRecord
): Promise<void> {
  localFallbackMap.set(record.id, record);

  const dbUrl = getDatabaseConnectionString();
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureDatabaseSchema(sql);

      await sql`
        INSERT INTO membership_submissions (
          id,
          full_name,
          email,
          whatsapp_number,
          city,
          utr,
          status,
          submitted_at,
          screenshot_storage_ref,
          screenshot_original_name,
          screenshot_mime_type,
          screenshot_size_bytes
        ) VALUES (
          ${record.id},
          ${record.fullName},
          ${record.email},
          ${record.whatsappNumber},
          ${record.city},
          ${record.utr},
          ${record.status},
          ${record.submittedAt},
          ${record.screenshotStorageRef},
          ${record.screenshotOriginalName},
          ${record.screenshotMimeType},
          ${record.screenshotSizeBytes}
        )
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          screenshot_storage_ref = EXCLUDED.screenshot_storage_ref;
      `;
      console.log(`[PostgreSQL] Saved membership submission ${record.id} to PostgreSQL database.`);
      return;
    } catch (err) {
      console.error('[PostgreSQL] Failed to insert record into database:', err);
      throw err;
    }
  }
}

export async function findPersistentSubmissionById(
  id: string
): Promise<PersistentSubmissionRecord | null> {
  const dbUrl = getDatabaseConnectionString();

  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureDatabaseSchema(sql);

      const rows = await sql`
        SELECT 
          id,
          full_name AS "fullName",
          email,
          whatsapp_number AS "whatsappNumber",
          city,
          utr,
          status,
          submitted_at AS "submittedAt",
          screenshot_storage_ref AS "screenshotStorageRef",
          screenshot_original_name AS "screenshotOriginalName",
          screenshot_mime_type AS "screenshotMimeType",
          screenshot_size_bytes AS "screenshotSizeBytes"
        FROM membership_submissions
        WHERE id = ${id}
        LIMIT 1;
      `;

      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        return {
          id: row.id,
          fullName: row.fullName,
          email: row.email,
          whatsappNumber: row.whatsappNumber,
          city: row.city || '',
          utr: row.utr,
          status: row.status,
          submittedAt: new Date(row.submittedAt).toISOString(),
          screenshotStorageRef: row.screenshotStorageRef,
          screenshotOriginalName: row.screenshotOriginalName,
          screenshotMimeType: row.screenshotMimeType,
          screenshotSizeBytes: row.screenshotSizeBytes,
        };
      }
      return null;
    } catch (err) {
      console.error('[PostgreSQL] Error finding record in database:', err);
      throw err;
    }
  }

  // Fallback from memory/local store
  if (localFallbackMap.has(id)) {
    return localFallbackMap.get(id)!;
  }

  return null;
}

export async function updatePersistentSubmissionStatus(
  id: string,
  newStatus: string
): Promise<boolean> {
  const dbUrl = getDatabaseConnectionString();
  let updated = false;

  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureDatabaseSchema(sql);

      const result = await sql`
        UPDATE membership_submissions
        SET status = ${newStatus}
        WHERE id = ${id}
        RETURNING id;
      `;
      if (result && result.length > 0) {
        updated = true;
      }
    } catch (err) {
      console.error('[PostgreSQL] Error updating status in database:', err);
      throw err;
    }
  }

  if (localFallbackMap.has(id)) {
    const item = localFallbackMap.get(id)!;
    item.status = newStatus;
    localFallbackMap.set(id, item);
    updated = true;
  }

  return updated;
}

export async function listPersistentSubmissions(limit = 50): Promise<PersistentSubmissionRecord[]> {
  const dbUrl = getDatabaseConnectionString();

  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await ensureDatabaseSchema(sql);

      const rows = await sql`
        SELECT 
          id,
          full_name AS "fullName",
          email,
          whatsapp_number AS "whatsappNumber",
          city,
          utr,
          status,
          submitted_at AS "submittedAt",
          screenshot_storage_ref AS "screenshotStorageRef",
          screenshot_original_name AS "screenshotOriginalName",
          screenshot_mime_type AS "screenshotMimeType",
          screenshot_size_bytes AS "screenshotSizeBytes"
        FROM membership_submissions
        ORDER BY submitted_at DESC
        LIMIT ${limit};
      `;

      return rows.map((row: any) => ({
        id: row.id,
        fullName: row.fullName,
        email: row.email,
        whatsappNumber: row.whatsappNumber,
        city: row.city || '',
        utr: row.utr,
        status: row.status,
        submittedAt: new Date(row.submittedAt).toISOString(),
        screenshotStorageRef: row.screenshotStorageRef,
        screenshotOriginalName: row.screenshotOriginalName,
        screenshotMimeType: row.screenshotMimeType,
        screenshotSizeBytes: row.screenshotSizeBytes,
      }));
    } catch (err) {
      console.error('[PostgreSQL] Error listing submissions from database:', err);
      throw err;
    }
  }

  return Array.from(localFallbackMap.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

