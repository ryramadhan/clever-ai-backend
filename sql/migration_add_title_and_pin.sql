-- Migration: Add title and is_pinned columns to captions table
-- Run: psql "$DATABASE_URL" -f sql/migration_add_title_and_pin.sql

-- 1. Add title column (nullable, for custom chat names)
ALTER TABLE captions ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- 2. Add is_pinned column (default false, for pinning chats)
ALTER TABLE captions ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- 3. Index for pinned queries (pinned items first, then by date)
CREATE INDEX IF NOT EXISTS idx_captions_pinned ON captions(is_pinned DESC, created_at DESC);

-- 4. Index for user + pinned queries (for user's pinned items)
CREATE INDEX IF NOT EXISTS idx_captions_user_pinned ON captions(user_id, is_pinned DESC, created_at DESC);
