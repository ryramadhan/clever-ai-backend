-- Migration: Create generate_logs table for tracking AI generation duration
-- Used for calculating average response time statistics

CREATE TABLE IF NOT EXISTS generate_logs (
  id SERIAL PRIMARY KEY,
  duration_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_generate_logs_created_at 
  ON generate_logs(created_at DESC);

COMMENT ON TABLE generate_logs IS 'Tracks AI generation duration for performance analytics';
COMMENT ON COLUMN generate_logs.duration_ms IS 'Time taken for AI to generate response in milliseconds';
