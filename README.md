# MoodWrite AI

Monochrome **AI Mood Caption Generator** untuk portfolio: generate caption aesthetic berdasarkan mood (dan input opsional), lalu simpan ke PostgreSQL.

## Highlights

- **Monochrome UI**: minimal, modern, responsive (mobile & desktop)
- **Smooth UX**: loading state, typing effect, copy button, animation halus
- **Persistence**: history dari database (bukan localStorage)
- **Production-like**: bisa jalan fullstack dengan 1 command, dan bisa serve frontend build dari Express

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI Provider**: Google Gemini (jika quota tersedia) dengan **mock fallback** saat quota/billing tidak tersedia

## Project Structure

- `frontend/` — UI (React + Vite)
- `backend/` — API (Express) + DB (PostgreSQL)

## Requirements

- Node.js 18+ (direkomendasikan terbaru)
- PostgreSQL (via pgAdmin/psql)

## Setup

### Install dependencies

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Database

1. Buat database (contoh: `moodwrite_db`)
2. Jalankan schema:

```bash
psql "postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME" -f backend/sql/schema.sql
```

### Backend env

Buat `backend/.env` dari template:

```bash
cd backend
cp .env.example .env
```

Isi minimal:

- DB: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
- AI:
  - `AI_PROVIDER=gemini`
  - `GEMINI_API_KEY=...`
  - `GEMINI_MODEL=gemini-1.5-flash-latest`
  - `AI_FALLBACK_MOCK=true`

## Run (dev)

Dari root:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Run (production-like / single server)

Build frontend lalu serve dari Express:

```bash
npm run start:prod
```

Buka: `http://localhost:4000`

## API

- `POST /api/generate`

Request:

```json
{ "mood": "malam", "text": "tentang kehilangan" }
```

Response:

```json
{ "result": "...", "provider": "gemini", "mood": "malam", "latency": 1200 }
```

- `GET /api/captions?limit=20&offset=0` → history dari database


