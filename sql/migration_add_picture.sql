-- Migration: Add picture column to users table for Google profile photo
-- Run: psql "$DATABASE_URL" -f sql/migration_add_picture.sql

-- Add picture column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS picture VARCHAR(500);

-- Add index for picture queries (optional, for future use)
CREATE INDEX IF NOT EXISTS idx_users_picture ON users(picture) WHERE picture IS NOT NULL;
