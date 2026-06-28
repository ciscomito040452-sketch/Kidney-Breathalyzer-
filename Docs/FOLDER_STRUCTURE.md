# FOLDER_STRUCTURE.md

Kidney Breathalyzer — Project File Organization

Version: 1.0 (MVP)

---

## Root Layout

```
Kidney Breathalyzer V.2/
├── AGENTS.md                    # กฎสำหรับ AI (Cursor อ่านอัตโนมัติ)
├── .cursor/
│   └── rules/
│       └── kidney-breathalyzer.mdc
├── .env.example
├── .env.local                   # gitignored
├── Docs/
│   ├── PROJECT_CONTEXT.md
│   ├── PRODUCT_REQUIREMENT_DOCUMENT.md
│   ├── TECH_STACK.md
│   ├── FOLDER_STRUCTURE.md      # ไฟล์นี้
│   └── UI_UX_SPECIFICATION.md
├── app/                         # Next.js App Router
├── components/
├── lib/
├── types/
├── locales/                     # i18n (future)
├── public/
├── scripts/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## `app/` — Routes & API

```
app/
├── layout.tsx                   # Root layout: font, providers
├── page.tsx                     # Landing (/)
├── globals.css                  # Tailwind + CSS variables
│
├── (auth)/                      # Route group — ไม่มี bottom nav
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (app)/                       # Route group — มี bottom nav
│   ├── layout.tsx               # AppShell + BottomNav
│   ├── dashboard/
│   │   └── page.tsx
│   ├── measure/
│   │   └── page.tsx             # redirect → /dashboard
│   ├── history/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
│
├── onboarding/
│   └── page.tsx                 # ไม่มี bottom nav
│
├── result/
│   └── [id]/
│       └── page.tsx             # ไม่มี bottom nav
│
└── api/
    ├── device/
    │   └── ingest/
    │       └── route.ts         # POST — ESP32 ส่งข้อมูลการวัด
    ├── measurements/
    │   ├── route.ts             # GET list, POST create
    │   ├── [id]/
    │   │   └── route.ts         # GET single
    │   └── trend/
    │       └── route.ts         # GET chart data
    ├── mock/
    │   └── generate/
    │       └── route.ts         # POST mock measurement
    ├── profile/
    │   └── route.ts             # GET, PUT
    └── auth/
        ├── login/
        │   └── route.ts         # P2
        └── register/
            └── route.ts         # P2
```

### Route → Nav Visibility

| Route | Bottom Nav | Notes |
|-------|------------|-------|
| `/` | ไม่มี | Landing |
| `/login`, `/register` | ไม่มี | Auth |
| `/onboarding` | ไม่มี | First-time setup |
| `/dashboard` | มี | Tab: หน้าหลัก |
| `/measure` | ไม่มี | Redirect → `/dashboard` |
| `/history` | มี | Tab: ประวัติ |
| `/ai-insight` | มี | Tab: เชิงลึก |
| `/profile` | มี | Tab: โปรไฟล์ |
| `/result/[id]` | ไม่มี | Back button + CTA |

---

## `components/` — UI Components

```
components/
├── ui/                          # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   ├── skeleton.tsx
│   └── ...
│
├── layout/
│   ├── AppShell.tsx             # wrapper สำหรับ (app) routes
│   ├── BottomNav.tsx            # 4-tab navigation
│   ├── DisclaimerBanner.tsx     # medical disclaimer footer
│   ├── PageHeader.tsx           # greeting + date
│   └── AIInsightCard.tsx        # AI summary card
│
├── dashboard/
│   ├── RiskHeroCard.tsx
│   ├── TrendChart.tsx
│   ├── LatestMeasurementCard.tsx
│   ├── DeviceStatusBadge.tsx
│   ├── DashboardDeviceInfo.tsx  # status + last sync
│   └── PageHeader.tsx
│
├── onboarding/
│   └── OnboardingPageClient.tsx # 4-step flow
│
├── profile/
│   └── ProfilePageClient.tsx
│
├── result/                      # inline in page (optional split)
│   ├── RiskResultCard.tsx
│   ├── AIExplanation.tsx
│   ├── HealthTips.tsx
│   └── DoctorCTA.tsx            # ปุ่ม "พบแพทย์" (high risk)
│
├── history/
│   ├── MeasurementList.tsx
│   └── HistoryFilters.tsx
│
├── gamification/                # P1
│   ├── StreakCard.tsx
│   ├── WeeklyGoalCard.tsx
│   └── ChallengeProgressBar.tsx
│
└── shared/
    ├── RiskBadge.tsx            # low | moderate | high badge
    └── EmptyState.tsx
```

---

## `lib/` — Business Logic

```
lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
│
├── risk-engine/
│   ├── normalize.ts
│   ├── calculate-score.ts
│   ├── risk-level.ts
│   ├── explanations.ts
│   └── index.ts
│
├── mock/
│   ├── generator.ts
│   ├── demo-store.ts
│   └── demo-user.ts
│
├── device/
│   └── status.ts                # resolveDeviceStatus()
│
├── measurements/
│   └── ingest.ts                # shared ingest logic
│
├── gamification/
│   ├── streak.ts
│   └── weekly-goal.ts
│
├── utils.ts                     # cn(), formatDate(), etc.
└── constants.ts                 # disclaimer text, demo IDs
```

---

## `types/` — TypeScript Types

```
types/
├── database.ts                  # Supabase table types
├── measurement.ts               # Measurement, RiskLevel
├── profile.ts                   # UserProfile
└── api.ts                       # API request/response shapes
```

### Key Types

```ts
// types/measurement.ts
type RiskLevel = 'low' | 'moderate' | 'high';

interface Measurement {
  id: string;
  user_id: string;
  measured_at: string;
  mq135_value: number;
  mq3_value: number;
  risk_score: number;
  risk_level: RiskLevel;
  is_mock: boolean;
  ai_explanation: string;
  created_at: string;
}
```

---

## `public/` — Static Assets

```
public/
├── logo.png                     # 512px app logo
├── icon-192.png                 # PWA / favicon
└── images/
    └── onboarding-device.png    # ภาพวิธีใช้อุปกรณ์ (optional)
```

---

## `locales/` — i18n (Future)

```
locales/
├── th.json                      # ภาษาไทย (default)
└── en.json                      # ภาษาอังกฤษ (ทีหลัง)
```

---

## `scripts/` — Dev Utilities

```
scripts/
└── seed-demo.ts                 # seed 30 วัน demo data
```

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `RiskHeroCard.tsx` |
| Files (utils) | kebab-case or camelCase | `calculate-score.ts` |
| API routes | kebab-case folders | `api/measurements/trend/` |
| Types / Interfaces | PascalCase | `RiskLevel` |
| CSS variables | kebab-case | `--accent-primary` |
| DB columns | snake_case | `mq135_value` |
| Route paths | lowercase | `/dashboard`, `/result/[id]` |

---

## Import Aliases

ตั้งใน `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

ใช้: `import { RiskBadge } from '@/components/shared/RiskBadge'`

---

## Co-location Rules

1. **Feature components** อยู่ใน `components/{feature}/` — ไม่ใส่ logic หนักใน page.tsx
2. **Business logic** อยู่ใน `lib/` — ไม่ใส่ใน components
3. **Page files** เป็น thin — compose components + fetch data
4. **API routes** เรียก `lib/` functions — ไม่ duplicate logic
5. **Types** shared อยู่ใน `types/` — ไม่ define ซ้ำในแต่ละไฟล์

---

## Build Priority → Folder Creation Order

| Phase | สร้าง folder/file |
|-------|-------------------|
| Scaffold | `app/`, `components/ui/`, `components/layout/`, `lib/`, `types/` |
| P0 | `components/dashboard/`, `components/measure/`, `components/result/`, `lib/risk-engine/`, `lib/mock/` |
| P1 | `components/history/`, `components/gamification/`, `lib/gamification/` |
| P2 | `app/(auth)/`, `app/api/auth/` |

---

## Related Docs

- [TECH_STACK.md](./TECH_STACK.md)
- [UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md)
- [PRODUCT_REQUIREMENT_DOCUMENT.md](./PRODUCT_REQUIREMENT_DOCUMENT.md)
