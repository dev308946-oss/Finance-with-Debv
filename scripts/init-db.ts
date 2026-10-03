import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function runDatabaseMigration() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    console.log('No DATABASE_URL found in local process.env. When deploying to Vercel, the app will connect to your configured DATABASE_URL.');
    return;
  }

  console.log('Connecting to PostgreSQL database...');
  try {
    const sql = neon(connectionString);

    console.log('Creating table membership_submissions if not exists...');
    await sql`
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

    console.log('Creating index idx_membership_utr_email if not exists...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_membership_utr_email 
      ON membership_submissions (utr, email);
    `;

    console.log('Creating index idx_membership_submitted_at if not exists...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_membership_submitted_at 
      ON membership_submissions (submitted_at DESC);
    `;

    console.log('✓ PostgreSQL database migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  }
}

runDatabaseMigration().catch((err) => {
  console.error('Fatal migration failure:', err);
});
