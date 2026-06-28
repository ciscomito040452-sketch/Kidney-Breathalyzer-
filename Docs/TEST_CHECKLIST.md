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
