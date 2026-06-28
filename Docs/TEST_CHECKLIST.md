# Manual Test Checklist

Production: https://kidney-breathalyzer.vercel.app

| # | ขั้นตอน | Local | Production | หมายเหตุ |
|---|---------|-------|------------|----------|
| 1 | `npm run lint` | PASS | — | warning font เท่านั้น |
| 2 | `npm run build` | PASS | — | |
| 3 | `npm run test` | PASS | — | Vitest unit tests |
| 4 | Landing — logo, disclaimer, ดู Demo | PASS | PASS | แก้ logo.svg แล้ว |
| 5 | Dashboard — โหมดสาธิต, sync animation | PASS | redeploy | กำลังซิงค์ → เชื่อมต่อ |
| 6 | Dashboard — risk, trend, gamification | PASS | redeploy | 30 วัน seed |
| 7 | History — กรอง risk + กราฟ | PASS | redeploy | truncate mobile |
| 8 | Result — AI + disclaimer + DoctorCTA | PASS | redeploy | deterministic IDs |
| 9 | AI Insight | PASS | redeploy | |
| 10 | Profile — สถานะอุปกรณ์ | PASS | redeploy | |
| 11 | Onboarding → scoring cookie | PASS | redeploy | enterDemoMode หลังจบ |
| 12 | `/result/invalid` — 404 ไทย | PASS | redeploy | not-found.tsx |
| 13 | Result ล่าสุด — AI text vs sensor badge | — | — | ต้องกล่าวถึงแอมโมเนีย (ไม่ใช่ข้อความ generic อย่างเดียว) |
| 14 | History — กรอง "ต่ำ" / "สูง" | — | — | ต้องมีอย่างน้อย 1 รายการแต่ละระดับใน 30 วัน |
| 15 | Dashboard summary vs Result AI | — | — | เนื้อหาหลักสอดคล้องกัน (ไม่ generic ฝั่ง Result) |
| 16 | Trend 3 วัน — กราฟ ammonia | — | — | ขึ้นต่อเนื่อง 268→288→308 |
| 17 | Acetone 3 วันล่าสุด | — | — | ทุกวัน curated < 225 ppb (ปกติ) |

## Viewport (375px / 320px)

| หน้า | สถานะ |
|------|--------|
| History list rows | PASS — truncate + shrink badge |
| Result bottom padding | PASS — pb-10 |
| Trend chart labels | ตรวจด้วยตา — ยอมรับได้ |

## Known limitations (ไม่ block demo)

- P2 login/register เป็น stub
- ข้อมูล in-memory บน serverless
- UI ไม่เรียก API โดยตรง (ใช้ demo-store)
