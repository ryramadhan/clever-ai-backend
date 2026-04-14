# Deployment Guide - MoodWrite AI

## Overview
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: Render PostgreSQL or Neon

---

## Step 1: Deploy Backend ke Render

### 1.1 Create PostgreSQL Database
1. Login ke [render.com](https://render.com)
2. Dashboard → **New** → **PostgreSQL**
3. Isi:
   - Name: `moodwrite-db`
   - Database: `moodwrite`
   - User: `moodwrite`
   - Plan: **Free**
4. Click **Create Database**
5. Copy **Internal Database URL** (nanti dipakai untuk env variable)

### 1.2 Create Web Service (Backend)
1. Dashboard → **New** → **Web Service**
2. Connect GitHub repo `moodwrite-ai`
3. Konfigurasi:
   - Name: `moodwrite-api`
   - Root Directory: `backend`
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

### 1.3 Set Environment Variables di Render
Di Render Dashboard → Web Service → **Environment** tab:

```
DATABASE_URL=postgresql://moodwrite:xxx@postgres.render.com/moodwrite_xxx
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_key_here
GEMINI_MODEL=gemini-1.5-flash-latest
AI_FALLBACK_MOCK=true
```

### 1.4 Run Database Schema
Di Render Dashboard → PostgreSQL → **Shell** tab:
```bash
psql $DATABASE_URL -f sql/schema.sql
```
Atau connect via local:
```bash
psql "paste_internal_db_url_here" -f backend/sql/schema.sql
```

---

## Step 2: Deploy Frontend ke Vercel

### 2.1 Create Project
1. Login ke [vercel.com](https://vercel.com)
2. **Add New Project**
3. Import GitHub repo `moodwrite-ai`
4. Konfigurasi:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2.2 Set Environment Variables di Vercel
Project Settings → **Environment Variables**:

```
VITE_API_BASE_URL=https://moodwrite-api.onrender.com
```

**Note**: Ganti `moodwrite-api.onrender.com` dengan URL backend Render kamu.

### 2.3 Deploy
Click **Deploy** dan tunggu build selesai.

---

## Step 3: Update CORS di Backend (jika perlu)

Jika frontend dan backend beda domain, tambahkan CORS origin di `backend/app.js`:

```javascript
app.use(cors({
  origin: ['https://moodwrite.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## Step 4: Testing

1. Buka Vercel URL frontend
2. Test generate caption
3. Check history tersimpan

---

## Troubleshooting

### CORS Error
Tambahkan exact domain frontend di backend CORS config.

### Database Connection Error
- Check `DATABASE_URL` benar
- Pastikan PostgreSQL service running di Render
- Check schema.sql sudah di-run

### API Key Error
- Pastikan `GEMINI_API_KEY` valid
- Check billing enabled di Google AI Studio

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` pointing ke Render URL
- Pastikan tidak ada `/` di akhir URL
- Test backend URL di browser: `https://your-backend.onrender.com/health`

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Render Web | 512 MB RAM, sleeps after 15 min idle |
| Render PostgreSQL | 1 GB storage, 90 days active |
| Vercel | 100 GB bandwidth, 6000 build minutes |
| Gemini API | 60 requests/min free tier |

---

## Local Development Setup

### Backend (.env)
```
PORT=4000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moodwrite_db
PGSSLMODE=disable
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
AI_FALLBACK_MOCK=true
```

### Frontend (.env)
```
# Development - kosongkan untuk pakai Vite proxy
VITE_API_BASE_URL=
```

---

## Alternative: Single Render Deployment

Jika mau frontend+backend dalam 1 service (tidak perlu Vercel):

1. Build frontend: `cd frontend && npm run build`
2. Copy `frontend/dist` ke `backend/public` (atau serve via Express static)
3. Deploy backend saja ke Render
4. Frontend akan di-serve dari Express di `http://your-backend.onrender.com`

Lihat `npm run start:prod` di root package.json untuk contoh.
