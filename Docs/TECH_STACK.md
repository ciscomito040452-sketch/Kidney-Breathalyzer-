# TECH_STACK.md

Kidney Breathalyzer — Locked Technology Decisions

Version: 1.0 (MVP / Hackathon)

---

## Overview

Web application แบบ mobile-first สำหรับคัดกรองความเสี่ยงโรคไตจากลมหายใจ  
Deploy บน Vercel, ทดลองใช้งานได้โดยไม่ต้องมีอุปกรณ์ฮาร์ดแวร์ (Mock Mode)

---

## Core Stack

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | strict mode |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | บน Radix UI + Lucide icons |
| Database | Supabase (PostgreSQL) | hosted |
| Auth | Supabase Auth | hybrid (ดูด้านล่าง) |
| Charts | Recharts | trend graphs |
| Forms | react-hook-form + zod | validation |
| Icons | lucide-react | ห้ามใช้ Emoji |
| Font | Noto Sans Thai | via `next/font/google` |
| Deploy | Vercel | free tier |
| Package Manager | npm | lock ด้วย `package-lock.json` |

---

## Auth Strategy (Hybrid)

### Demo Mode (P0 — ต้องทำงานก่อน)

- ปุ่ม **"ดู Demo"** บน Landing ข้าม login เข้าระบบทันที
- ใช้ demo user ID คงที่ (เก็บใน session/cookie หรือ localStorage)
- Pre-load ข้อมูล 30 วันสำหรับ demo account
- ไม่ต้องมี Supabase credentials ก็ demo ได้ (fallback: mock data ใน memory/local)

### Supabase Auth (P2)

- Register / Login ด้วย Email + Password
- หลัง register → redirect `/onboarding`
- Row Level Security (RLS) บน Supabase tables

### Session Handling

- Server Components ดึง user จาก Supabase session
- Demo mode ใช้ flag `isDemo: true` ใน client context
- Middleware ป้องกัน route ที่ต้อง login (ยกเว้น demo bypass)

---

## Rendering Strategy

| ใช้ Server Component | ใช้ Client Component (`"use client"`) |
|----------------------|--------------------------------------|
| Landing (static parts) | Dashboard (charts, interactive) |
| Layout shells | Measurement (real-time mock values) |
| API route handlers | BottomNav, forms |
| Data fetch ใน server ที่เป็นไปได้ | Recharts, stepper, toggles |

---

## State Management

- **Default:** React `useState` + props
- **Server data:** Next.js Server Actions หรือ fetch ใน Server Components
- **ไม่ใช้** Redux / Zustand ใน MVP — YAGNI
- Demo context: React Context (`DemoProvider`) สำหรับ `isDemo`, `deviceStatus`

---

## API Pattern

ใช้ Next.js App Router API Routes:

```
app/api/measurements/route.ts       POST, GET
app/api/measurements/[id]/route.ts  GET
app/api/measurements/trend/route.ts GET
app/api/mock/generate/route.ts      POST
app/api/profile/route.ts            GET, PUT
app/api/auth/register/route.ts      POST (P2)
app/api/auth/login/route.ts         POST (P2)
```

- Request/response validation ด้วย zod
- Error format: `{ error: string }` + HTTP status code

---

## Database (Supabase)

### Tables (จาก PRD)

- `users` — จัดการโดย Supabase Auth (`auth.users`)
- `user_profiles` — ข้อมูลส่วนตัว + risk factors
- `measurements` — ผลการวัด + risk score
- `user_streaks` — gamification (P1): `current_streak`, `longest_streak`, `weekly_count`, `challenge_days`

### Client Setup

```
lib/supabase/
  client.ts    # browser client (createBrowserClient)
  server.ts    # server client (createServerClient + cookies)
  middleware.ts
```

---

## Risk Engine

Rule-based scoring ใน MVP — **ไม่ใช้ ML model**

```
lib/risk-engine/
  normalize.ts       # normalize MQ-135, MQ-3 to 0-1
  calculate-score.ts # base_score + multipliers + trend_bonus
  risk-level.ts      # map score → low | moderate | high
  explanations.ts    # template strings สำหรับ AI insight
  index.ts           # public API
```

---

## Mock Data

```
lib/mock/
  generator.ts    # สุ่ม MQ-135 (150-400), MQ-3 (0.1-0.8)
  seed-demo.ts    # seed 30 วัน, risk level สลับ
  demo-user.ts    # demo user constants
```

---

## i18n (Future)

- Launch: ภาษาไทยล้วน (hardcode หรือ `locales/th.json`)
- ทีหลัง: `next-intl` หรือ JSON locale files
- เตรียม structure: `locales/th.json`, `locales/en.json`

---

## Environment Variables

สร้าง `.env.example` ที่ root:

```env
# Supabase (optional สำหรับ demo-only mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | P2+ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | P2+ | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | Deploy | Production URL สำหรับ Vercel |

---

## Tailwind Configuration

กำหนด design tokens ใน `tailwind.config.ts`:

```ts
colors: {
  accent: {
    primary: '#2B7FD4',
    secondary: '#5BB5E8',
  },
  surface: '#F5F5F7',
  risk: {
    low: '#34C759',
    moderate: '#FF9500',
    high: '#FF3B30',
  },
}
```

Font family: `Noto Sans Thai` เป็น default sans

---

## shadcn/ui Components (ติดตั้งตอน scaffold)

ติดตั้งขั้นต่ำ:

- `button`, `card`, `badge`, `progress`, `skeleton`
- `input`, `label`, `checkbox` (forms P2)
- `tabs` (chart 7d/30d toggle)

Customize ให้ตรง `UI_UX_SPECIFICATION.md`

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "seed:demo": "tsx scripts/seed-demo.ts"
}
```

---

## Deploy (Vercel)

1. Connect GitHub repo
2. Framework preset: Next.js
3. Set env vars จาก `.env.example`
4. Root directory: project root
5. Build command: `npm run build`

---

## What NOT to Use (MVP)

| ห้ามใช้ | เหตุผล |
|---------|--------|
| ML model จริง | PRD กำหนด rule-based |
| Redux / Zustand | over-engineering |
| Emoji ใน UI | ตาม UI spec |
| GraphQL | REST API routes พอ |
| Separate backend server | Next.js API routes พอ |

---

## Related Docs

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — vision และ medical scope
- [PRODUCT_REQUIREMENT_DOCUMENT.md](./PRODUCT_REQUIREMENT_DOCUMENT.md) — features และ pages
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — โครงสร้างไฟล์
- [UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md) — design tokens และ components
- [../AGENTS.md](../AGENTS.md) — กฎสำหรับ AI assistants
