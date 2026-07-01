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
| 13 | Result ล่าสุด — AI text vs sensor badge | PASS | — | parity test + แอมโมเนียใน explanation |
| 14 | History — กรอง "ต่ำ" / "สูง" | PASS | — | generator.test risk distribution |
| 15 | Dashboard summary vs Result AI | PASS | — | result-explanation-parity.test.ts |
| 16 | Trend 3 วัน — กราฟ ammonia | PASS | — | curated 268→288→308 in generator |
| 17 | Acetone 3 วันล่าสุด | PASS | — | curated < 225 ppb in generator.test |
| 18 | DoctorCTA — ไม่โทร 1669, เปิด guidance sheet | PASS | redeploy | doctor-guidance.test.ts |
| 19 | Dashboard — สรุป + ปักหมุด(3) + ไฮไลต์ + เพิ่มเติม | PASS | redeploy | PinnedHealthCard pattern |
| 20 | History — SummaryPageHeader + latest pinned hero | PASS | redeploy | qualitative headlines |
| 21 | Apple Health cards — grouped list, iOS segmented control | PASS | — | components/health/* |

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
