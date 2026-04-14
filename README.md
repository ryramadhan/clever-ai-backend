# 🖤 MoodWrite AI Backend

REST API untuk AI Mood Caption Generator. Generate caption aesthetic berdasarkan mood dengan AI (Google Gemini) + fallback mock, simpan ke PostgreSQL.

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |
| Deploy | Vercel |

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/generate` | Generate caption (rate limited: 20/min) |
| GET | `/api/captions?limit=20&offset=0` | List caption history |

### POST /api/generate

**Request:**
```json
{
  "mood": "malam",
  "text": "tentang kehilangan"
}
```

**Response:**
```json
{
  "result": "Malam selalu tahu cara menenangkan...",
  "provider": "gemini",
  "mood": "malam",
  "latency": 1200
}
```

**Supported moods:** `sunyi`, `malam`, `nostalgia`, `kehilangan`, `tenang`

## 🚀 Setup Local

```bash
npm install
```

### 🔧 Environment Variables

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Model (default: `gemini-1.5-flash-latest`) |
| `AI_FALLBACK_MOCK` | Fallback ke mock jika quota habis (default: `true`) |

### 🗄️ Database Schema

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

### ▶️ Run Dev

```bash
npm run dev
```

## ☁️ Deployment (Vercel)

### 1. Vercel Project Settings

- **Framework Preset:** Other
- **Build Command:** (none)
- **Output Directory:** (none)
- **Install Command:** `npm install`

### 2. Environment Variables

Add di Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
AI_FALLBACK_MOCK=true
```

### 3. Database (Neon)

1. Buat project di [Neon](https://neon.tech)
2. Copy connection string ke `DATABASE_URL`
3. Jalankan schema:
   ```bash
   psql "$DATABASE_URL" -f sql/schema.sql
   ```

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │──────▶   Vercel    │──────▶    Neon     │
│  Frontend   │      │   Backend   │      │  PostgreSQL │
└─────────────┘      └─────────────┘      └─────────────┘
```

## ✨ Features

- **Rate limiting:** 20 requests/minute per endpoint
- **AI fallback:** Auto-switch ke mock captions jika Gemini quota habis
- **Multi-model retry:** Fallback antar model Gemini jika error
- **Input validation:** Strict mood validation + sanitization
- **Security:** Helmet, CORS, SSL-ready PostgreSQL

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/          # Route definitions + middleware
├── services/        # Business logic (AI, DB, captions)
├── utils/           # Helpers (asyncHandler)
sql/
└── schema.sql       # Database schema
```

## 🔗 Related

- [moodwrite-ai-frontend](https://github.com/ryramadhan/moodwrite-ai-frontend) — React frontend
