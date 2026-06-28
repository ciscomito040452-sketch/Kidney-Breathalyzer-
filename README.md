# Kidney Breathalyzer

Web app สำหรับคัดกรองความเสี่ยงโรคไตจากลมหายใจ (Hackathon PoC)

**Live Demo:** [https://kidney-breathalyzer.vercel.app](https://kidney-breathalyzer.vercel.app)

## Quick Start

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) แล้วกด **ดู Demo**

## Demo Script (สำหรับกรรมการ)

เปิด [https://kidney-breathalyzer.vercel.app](https://kidney-breathalyzer.vercel.app) แล้วทำตามขั้นตอน:

1. Landing → อธิบาย tagline + disclaimer
2. กด **ดู Demo** → Dashboard: สถานะอุปกรณ์, risk, gamification, trend (สลับ 7/30 วัน)
3. เน้น: ผู้ใช้เป่าที่อุปกรณ์ ESP32 — ข้อมูลซิงค์เข้าแอปอัตโนมัติ (แอปเป็น companion แสดงผล)
4. **ประวัติ** → กดรายการ → Result + AI explanation + disclaimer
5. **โปรไฟล์** → วิธีใช้อุปกรณ์ (onboarding step 4)

ปุ่ม **เริ่มต้นใช้งาน** นำไป onboarding 4 ขั้น (profile → risk factors → disclaimer → วิธีใช้อุปกรณ์)

## Deploy (Vercel)

Demo Mode ไม่ต้องตั้ง environment variables

```bash
npm run build          # ตรวจสอบ build ก่อน deploy
npx vercel             # deploy preview (ครั้งแรกจะถาม login)
npx vercel --prod      # deploy production URL สำหรับกรรมการ
```

หรือเชื่อม GitHub repo กับ [vercel.com](https://vercel.com) — Next.js auto-detect, ไม่ต้อง config พิเศษ

**หมายเหตุ:** วาง `Logo.png` ใน `public/` ก่อน deploy ถ้าต้องการ app icon แบบเต็ม (ตอนนี้ใช้ `favicon.svg` เป็น fallback)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | รัน development server |
| `npm run build` | Build production |
| `npm run start` | รัน production server |
| `npm run lint` | ESLint |
| `npm run seed:demo` | ทดสอบ seed demo data |

## Environment

คัดลอก `.env.example` เป็น `.env.local` — **ไม่จำเป็นสำหรับ Demo Mode**

## Docs

ดูรายละเอียดในโฟลเดอร์ `Docs/` และ `AGENTS.md`

## Stack

Next.js 14, TypeScript, Tailwind CSS, Supabase (optional), Recharts
