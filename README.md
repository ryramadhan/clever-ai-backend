# 🤖 Clerver AI Backend

REST API untuk AI Assistant dengan sistem autentikasi lengkap. Terima pertanyaan konteks dari user, generate respons dengan AI (Google Gemini) + fallback mock berbasis keyword, simpan history ke PostgreSQL dengan data separation antar user.

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |
| Auth | JWT + bcrypt + Google OAuth |
| Security | Rate limiting, input sanitization, CORS |
| Deploy | Vercel |

## 🌐 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Register new user (rate limited: 10/15min) |
| POST | `/api/auth/login` | Login user (rate limited: 10/15min) |
| POST | `/api/auth/google` | Google OAuth login (auto-register/login, rate limited) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Protected Endpoints (Auth Optional)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user (requires Bearer token) |
| POST | `/api/generate/stream` | **SSE Streaming** - Generate AI response with real-time streaming (rate limited: 20/min). Uses Server-Sent Events for chunk-by-chunk delivery |
| POST | `/api/generate` | Legacy non-streaming endpoint (rate limited: 20/min). Returns full response at once |
| GET | `/api/captions?limit=20&offset=0` | List history. Guest: only global data (user_id IS NULL). Auth: only own data |
| GET | `/api/stats` | Public stats for social proof: total generated results, avg response time, total users |

### POST /api/auth/register

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "min6chars"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "min6chars"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/google

**Request:**
```json
{
  "idToken": "google_id_token_from_frontend"
}
```

**Response:** Same as login/register

### POST /api/generate/stream (SSE Streaming)

**Server-Sent Events (SSE) endpoint untuk real-time AI response streaming.**

**Request (without auth - public):**
```json
{
  "context": "Bagaimana cara mengatasi stres kerja?"
}
```

**Request (with auth - saves to user history):**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response Format (SSE - Stream):**
```
data: {"chunk": "Stres kerja", "provider": "gemini", "model": "gemini-1.5-flash-latest"}

data: {"chunk": " bisa diatasi dengan", "provider": "gemini", "model": "gemini-1.5-flash-latest"}

data: {"chunk": " teknik relaksasi...", "provider": "gemini", "model": "gemini-1.5-flash-latest"}

data: {"done": true, "result": "Stres kerja bisa diatasi dengan teknik relaksasi...", "provider": "gemini", "context": "Bagaimana cara mengatasi stres kerja?", "latency": 1200}
```

**Error Handling (SSE):**
```
data: {"error": true, "message": "Gemini API error", "statusCode": 500}
```

**Note:** 
- Menggunakan Google Gemini `generateContentStream()` untuk real-time streaming
- Jika Gemini quota habis (429 error), otomatis fallback ke **mock streaming** (word-by-word)
- Fallback mock juga di-stream untuk UX yang konsisten

### POST /api/generate (Legacy Non-Streaming)

**Legacy endpoint yang mengembalikan response lengkap sekaligus.**

**Response:**
```json
{
  "result": "Stres kerja bisa diatasi dengan teknik relaksasi...",
  "provider": "gemini",
  "context": "Bagaimana cara mengatasi stres kerja?",
  "latency": 1200
}
```

**Note:** Jika Gemini quota habis, otomatis fallback ke mock response berbasis 80+ keyword.

---

## 🌊 Server-Sent Events (SSE) Architecture

### Backend Streaming Architecture

```javascript
// services/gemini.js - Async Generator untuk streaming
genAI.models.generateContentStream({
  model: modelName,
  contents: prompt,
})

// controllers/generateController.js - SSE response
res.setHeader('Content-Type', 'text/event-stream');
for await (const chunk of stream) {
  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
}
```

### Fallback Mock Streaming

Ketika Gemini API error (429 quota exceeded, dll), backend tidak mengembalikan response lengkap. Sebaliknya, mock response di-**stream** juga:

```javascript
// services/ai.js - Mock streaming
const words = result.split(/(\s+)/);
for (const word of words) {
  yield { chunk: word, provider: "mock", model: "mock" };
  await new Promise((r) => setTimeout(r, 10)); // Simulate streaming delay
}
```

Ini memastikan UX frontend tetap konsisten - user selalu melihat text muncul chunk-by-chunk.

---

### GET /api/captions (with metadata)

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "context": "Bagaimana cara mengatasi stres?",
      "result": "Stres bisa diatasi dengan...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "isAuthenticated": false,
    "isGuest": true,
    "count": 1
  }
}
```

## 🚀 Setup Local

```bash
npm install
```

### 🔧 Environment Variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `JWT_SECRET` | Yes | JWT secret key (min 32 chars) |
| `JWT_EXPIRES_IN` | No | JWT expiry (default: `7d`) |
| `GEMINI_MODEL` | No | Model (default: `gemini-1.5-flash-latest`) |
| `AI_FALLBACK_MOCK` | No | Fallback ke mock jika quota habis (default: `true`) |
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth Client ID (*required for Google login) |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth Client Secret (*required for Google login) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: `http://localhost:5173`) |
| `SMTP_HOST` | No | SMTP server for forgot password emails |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | No | SMTP username/email |
| `SMTP_PASS` | No | SMTP password/app password |

### 🗄️ Database Schema

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

### 🔐 Data Separation & Access Rules

**Production-Grade Data Privacy:**

| Mode | Behavior | Data Access |
|------|----------|-------------|
| **Guest** (no token) | Can chat, history saved with `user_id = NULL` | Only sees global/public data (`user_id IS NULL`) |
| **Authenticated** (with JWT) | Chat saved with `user_id = current_user` | Only sees own data (`user_id = ?`) |

**Security Guarantees:**
- ✅ Strict user data isolation
- ✅ No cross-user data leakage
- ✅ Guest data never mixed with user data
- ✅ All queries filtered by `user_id`

### 📊 Database Migrations

**Add authentication support to existing database:**

```bash
psql "$DATABASE_URL" -f sql/migration_simple.sql
```

This creates:
- `users` table (id, name, email, password, google_id, etc)
- Adds `user_id` column to `captions` table
- Creates indexes for performance

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

### 2. Vercel.json

File `vercel.json` sudah tersedia:

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/api/index.js" }]
}
```

### 3. Environment Variables

Add di Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
JWT_SECRET=your_random_secret_min_32_chars
```

**For Google Login:**
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
FRONTEND_URL=https://your-frontend.vercel.app
```

**For Email (Forgot Password):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Optional (for Google Login):**
```
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Optional (AI settings):**
```
AI_FALLBACK_MOCK=true
GEMINI_MODEL=gemini-1.5-flash-latest
```

### 4. Database (Neon)

1. Buat project di [Neon](https://neon.tech)
2. Copy connection string ke `DATABASE_URL`
3. Jalankan schema:
   ```bash
   psql "$DATABASE_URL" -f sql/schema.sql
   ```

##  Stats API Implementation

### Endpoint

```
GET /api/stats
```

### Response

```json
{
  "totalGenerated": 1250,
  "avgGenerateTime": 2450,
  "totalUsers": 150
}
```

### Data Sources

| Field | Source | Description |
|-------|--------|-------------|
| `totalGenerated` | `COUNT(*) FROM captions` | Total AI responses generated |
| `avgGenerateTime` | `AVG(duration_ms) FROM generate_logs` (last 7 days) | Average response time in ms |
| `totalUsers` | `COUNT(*) FROM users` | Total registered users |

### Non-blocking Logging

Generation duration is logged asynchronously without affecting response time:

```javascript
// In generateController.js
insertGenerateLog(latency).catch(() => {}); // Fire and forget
```

## 🏗️ Architecture

### System Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │──────▶   Vercel    │──────▶    Neon     │
│  Frontend   │      │   Backend   │      │  PostgreSQL │
│  (React)    │      │  (Express)  │      │  (User data)│
└─────────────┘      └─────────────┘      └─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │  JWT    │        │ Google  │        │ Gemini  │
   │  Auth   │        │  OAuth  │        │   AI    │
   └─────────┘        └─────────┘        └─────────┘
```

### Authentication Flow

```
Guest Mode                    Authenticated Mode
───────────                   ──────────────────
No Token                      Bearer Token (JWT)
   │                                │
   ▼                                ▼
user_id = NULL              user_id = current_user
   │                                │
   ▼                                ▼
Global Data                   Private Data Only
(user_id IS NULL)             (user_id = ?)
```

## ✨ Features

- **Real-time AI Streaming:** Server-Sent Events (SSE) endpoint for chunk-by-chunk response delivery
- **Rate limiting:** 20 requests/minute per endpoint, 10 auth attempts per 15 minutes
- **AI fallback:** Auto-switch ke mock streaming (80+ keyword) jika Gemini quota habis
- **Multi-model retry:** Fallback antar model Gemini jika error (flash-latest, pro, etc)
- **Input validation:** Sanitasi context input + rate limiting
- **Security:** Helmet, CORS, SSL-ready PostgreSQL, bcrypt password hashing
- **Authentication:** JWT-based auth (7d expiry), Google OAuth, password reset
- **Data Separation:** Strict isolation - guests see global data, users see only their data
- **Streaming Fallback:** Mock data juga di-stream (word-by-word) untuk UX konsisten
- **Live Stats API:** Public endpoint untuk social proof (total generated, avg response time, total users)
- **Analytics Logging:** Non-blocking generation duration tracking untuk performance metrics

## 📁 Project Structure

```
src/
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── captionsController.js
│   ├── generateController.js    # SSE streaming + duration logging
│   └── statsController.js       # Public stats endpoint
├── routes/              # Route definitions + middleware
├── services/            # Business logic
│   ├── ai.js
│   ├── authService.js
│   ├── captionsService.js
│   ├── db.js
│   ├── generateLogService.js    # Analytics logging
│   └── statsService.js          # Stats aggregation
├── middleware/          # Auth middleware
└── utils/               # Helpers (asyncHandler)
sql/
├── schema.sql                    # Initial schema
├── migration_add_title_and_pin.sql
├── migration_add_picture.sql
└── migration_generate_logs.sql   # Analytics table
```

## 🔗 Related

- [clever-ai-frontend](https://github.com/ryramadhan/clever-ai-frontend) — React AI Assistant frontend
