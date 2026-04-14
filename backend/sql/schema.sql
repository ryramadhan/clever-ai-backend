-- Run this in your PostgreSQL database:
-- psql "$DATABASE_URL" -f backend/sql/schema.sql

CREATE TABLE IF NOT EXISTS captions (
  id SERIAL PRIMARY KEY,
  mood TEXT,
  input_text TEXT,
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

