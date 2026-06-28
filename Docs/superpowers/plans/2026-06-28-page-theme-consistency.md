# Page-by-Page Theme Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ทำให้ทุกหน้าในแอปใช้ UX/UI แบบเดียวกับหน้าหลัก (Dashboard) — โทนฟ้า Apple Health, Card layout สม่ำเสมอ, ไม่มีสีเขียว/แดง/ส้มหลุดธีม

**Architecture:** ใช้ Dashboard เป็น reference (`space-y-6 px-4 py-6`, Card + icon header + `text-3xl` metric + `RiskIndicator`). แก้ทีละหน้าตามลำดับ P0 → P1 → P2 โดย extract shared components ก่อน (Task 0–2) แล้วค่อย refactor แต่ละ route ไม่แตะ P2 auth จนกว่า P0 demo flow จะสมบูรณ์

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, shadcn Card, Lucide icons, Recharts

**สถานะปัจจุบัน (ก่อนเริ่ม plan):**
- Dashboard + History: Card-based แล้ว (commit `cb1c6e6`)
- พาเลตสีฟ้าใน `globals.css` / `tailwind.config.ts`: แก้ใน working tree แล้ว **ยังไม่ commit**
- `InsightFactorCard`: layout แตก (ขาด `flex` wrapper) — ต้องแก้ด่วน
- `Docs/UI_UX_SPECIFICATION.md`: ยังอ้างสี traffic-light เก่า

---

## Design Reference (Dashboard Checklist)

ทุกหน้าที่แสดงผล risk ต้องผ่าน checklist นี้:

| รายการ | ค่าที่ใช้ |
|--------|----------|
| Page shell | `main className="space-y-6 px-4 py-6"` |
| Section title | `h2 text-base font-semibold` + `p text-xs text-secondary` **นอก** Card |
| Card | `rounded-2xl border border-border-subtle bg-surface shadow-card` |
| Card label | `CardTitle` → `text-sm font-medium text-secondary` + Lucide `text-accent-primary` |
| ตัวเลขหลัก | `text-3xl font-semibold tabular-nums tracking-tight` |
| สถานะ risk | `RiskIndicator` (ไม่ใช้ RiskBadge ยกเว้นกรณีพิเศษ) |
| สี status | ฟ้าอ่อน `#60A5FA` / ฟ้าหลัก `#2563EB` / น้ำเงินเข้ม `#1E3A8A` |
| Disclaimer | `DisclaimerBanner` ทุกหน้าที่มีผล risk |
| ห้ามใช้ | `text-green-*`, `text-red-*`, `text-orange-*`, gradient hero สีรุ้ง |

---

## File Map (สิ่งที่จะสร้าง/แก้)

| ไฟล์ใหม่ | หน้าที่ |
|----------|--------|
| `components/shared/PageSectionHeader.tsx` | หัวข้อ section (`h2` + subtitle) |
| `components/shared/TabPageHeader.tsx` | หัวข้อ tab page (`h1` + subtitle + optional icon) |
| `components/shared/RiskScoreCard.tsx` | การ์ดคะแนน + `RiskIndicator` |
| `components/shared/SensorValueCard.tsx` | การ์ดเซนเซอร์คู่ (แอมโมเนีย/อะซิโทน) |

| ไฟล์แก้ต่อหน้า | หน้า |
|---------------|------|
| `app/globals.css`, `tailwind.config.ts` | Foundation |
| `Docs/UI_UX_SPECIFICATION.md` | Docs sync |
| `components/dashboard/DashboardLatestSection.tsx` | Dashboard |
| `components/history/*` | History |
| `app/(app)/ai-insight/page.tsx`, `components/ai-insight/*` | AI Insight |
| `app/result/[id]/page.tsx`, `components/result/*` | Result |
| `components/onboarding/*` | Onboarding |
| `components/profile/ProfilePageClient.tsx` | Profile |
| `app/page.tsx` | Landing |
| `app/not-found.tsx` | 404 |

---

## Task 0: Foundation — Lock Blue Palette & Docs

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `Docs/UI_UX_SPECIFICATION.md` (ส่วน Colors + RiskBadge + RiskHeroCard)

- [ ] **Step 1: ยืนยันพาเลตสีฟ้าใน tokens**

```css
/* app/globals.css */
--accent-primary: #2563eb;
--accent-secondary: #7dd3fc;
--risk-low: #60a5fa;
--risk-moderate: #2563eb;
--risk-high: #1e3a8a;
```

```ts
// tailwind.config.ts — risk + accent ต้องตรงกับ globals.css
```

- [ ] **Step 2: อัปเดต UI_UX_SPECIFICATION.md**
  - แทนที่สี `#34C759`, `#FF9500`, `#FF3B30` ด้วยพาเลตฟ้า
  - เปลี่ยน `RiskHeroCard` → `DashboardLatestSection` pattern
  - ระบุว่า UI ใช้ `RiskIndicator` เป็นหลัก ไม่ใช่ RiskBadge

- [ ] **Step 3: รัน verification**

```bash
npm run test
npm run build
```

Expected: 12 tests PASS, build success

- [ ] **Step 4: Commit**

```bash
git add app/globals.css tailwind.config.ts Docs/UI_UX_SPECIFICATION.md \
  components/ai-insight/InsightFactorCard.tsx components/dashboard/DeviceStatusBadge.tsx \
  components/shared/SensorChipRow.tsx components/profile/ProfilePageClient.tsx \
  components/result/HealthTips.tsx components/result/DoctorCTA.tsx \
  components/result/RiskResultCard.tsx app/(app)/ai-insight/page.tsx components/ui/button.tsx
git commit -m "Unify status colors to blue palette across shared components."
```

---

## Task 1: Hotfix — InsightFactorCard Layout

**Files:**
- Modify: `components/ai-insight/InsightFactorCard.tsx`

- [ ] **Step 1: เพิ่ม flex row wrapper**

```tsx
return (
  <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4 shadow-card">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/10">
      ...
    </div>
    <div className="min-w-0 flex-1">...</div>
    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", statusClasses[factor.status])}>
      ...
    </span>
  </div>
);
```

- [ ] **Step 2: เปิด `/ai-insight` บน dev — ยืนยัน icon | text | badge อยู่แถวเดียวกัน**

- [ ] **Step 3: Commit**

```bash
git commit -m "Fix AI insight factor card horizontal layout."
```

---

## Task 2: Extract Shared Components

**Files:**
- Create: `components/shared/PageSectionHeader.tsx`
- Create: `components/shared/TabPageHeader.tsx`
- Create: `components/shared/RiskScoreCard.tsx`
- Create: `components/shared/SensorValueCard.tsx`
- Modify: `components/dashboard/DashboardLatestSection.tsx`
- Modify: `components/result/RiskResultCard.tsx`

- [ ] **Step 1: สร้าง `PageSectionHeader`**

```tsx
interface PageSectionHeaderProps {
  title: string;
  subtitle?: string;
}
export function PageSectionHeader({ title, subtitle }: PageSectionHeaderProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      {subtitle && <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>}
    </div>
  );
}
```

- [ ] **Step 2: สร้าง `TabPageHeader`**

```tsx
interface TabPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}
// h1 text-xl font-semibold + optional icon gap-2
```

- [ ] **Step 3: ย้าย `SensorValueCard` จาก DashboardLatestSection → shared**

- [ ] **Step 4: สร้าง `RiskScoreCard`**

```tsx
interface RiskScoreCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  riskDelta?: number | null;
}
// Card + Activity icon + formatRiskScoreDisplay + RiskIndicator + optional delta
```

- [ ] **Step 5: Refactor `DashboardLatestSection` และ `RiskResultCard` ให้ import shared**

- [ ] **Step 6: `npm run build` — ต้องผ่าน**

- [ ] **Step 7: Commit**

```bash
git commit -m "Extract shared measurement and section header components."
```

---

## Task 3: Page — Dashboard (Polish)

**Priority:** P0 | **Scope:** Small

**Files:**
- Modify: `components/dashboard/DashboardDeviceInfo.tsx`
- Modify: `components/dashboard/DashboardTrendSection.tsx`
- Modify: `components/dashboard/TrendChart.tsx`
- Modify: `components/layout/AIInsightCard.tsx`

- [ ] **Step 1: `DashboardDeviceInfo` — เปลี่ยน `rounded-xl` → `rounded-2xl` ให้ตรง Card**

- [ ] **Step 2: Chart colors ใช้ CSS vars**

```tsx
stroke="var(--accent-primary)"
stroke="var(--accent-secondary)"
```

ใน `TrendChart.tsx` และ `AIInsightCard.tsx`

- [ ] **Step 3: ใช้ `PageSectionHeader` ใน `DashboardLatestSection` (แทน inline h2)**

- [ ] **Step 4: Manual check** — เปิด `/dashboard` ดู Demo flow: device info → ผลล่าสุด → gamification → trend → AI card

- [ ] **Step 5: Commit**

```bash
git commit -m "Polish dashboard cards and chart theme tokens."
```

---

## Task 4: Page — History

**Priority:** P0 | **Scope:** Small

**Files:**
- Modify: `components/history/HistoryPageClient.tsx`

- [ ] **Step 1: แทนที่ inline header ด้วย `TabPageHeader`**

```tsx
<TabPageHeader
  title="ประวัติการวัด"
  subtitle="ติดตามแนวโน้มและผลย้อนหลัง"
/>
```

- [ ] **Step 2: ใช้ `PageSectionHeader` สำหรับ "รายการวัด"**

- [ ] **Step 3: พิจารณา risk filter**
  - ตัวเลือก A (แนะนำ): คง `grid grid-cols-4` pill 44px — ใช้งานดีบนมือถือ
  - ตัวเลือก B: เปลี่ยนเป็น `SegmentedControl` แบบ 7/30 วัน (อาจแคบเกินสำหรับ "ปานกลาง")

- [ ] **Step 4: `DisclaimerBanner` — ใช้ variant เดียวกับ dashboard (ไม่ compact) หรือคง compact ถ้าพื้นที่น้อย — เลือกหนึ่งแบบแล้วใช้ทุก tab page**

- [ ] **Step 5: Manual check** — `/history` filter pills, card rows, trend chart สีฟ้า

- [ ] **Step 6: Commit**

```bash
git commit -m "Align history page headers with shared tab layout."
```

---

## Task 5: Page — AI Insight

**Priority:** P0 | **Scope:** Medium

**Files:**
- Modify: `app/(app)/ai-insight/page.tsx`
- Modify: `components/ai-insight/InsightContextSection.tsx`
- Modify: `components/ai-insight/InsightFactorCard.tsx`

- [ ] **Step 1: `TabPageHeader` + Sparkles icon**

- [ ] **Step 2: แทนการ์ดผลล่าสุดด้วย `PageSectionHeader` + `RiskScoreCard`**

```tsx
<PageSectionHeader title="ผลล่าสุด" subtitle={formatDateTimeThai(latest.measured_at)} />
<RiskScoreCard riskLevel={...} riskScore={...} />
<Card> {/* AI explanation text only */} </Card>
```

- [ ] **Step 3: `InsightContextSection` — ใช้ `PageSectionHeader`**

- [ ] **Step 4: `InsightFactorCard` — migrate เป็น `Card` หรือคง div แต่ต้องมี `flex items-center gap-3`**

- [ ] **Step 5: คำแนะนำสั้น ๆ — ใช้ pattern เดียวกับ `HealthTips` (CheckCircle2 + accent-primary) แทน disc list**

- [ ] **Step 6: Manual check** — `/ai-insight` ทุก status badge เป็นฟ้า/เทา ไม่มีสีรุ้ง

- [ ] **Step 7: Commit**

```bash
git commit -m "Refactor AI insight page to match dashboard card system."
```

---

## Task 6: Page — Result Detail

**Priority:** P0 | **Scope:** Medium

**Files:**
- Modify: `app/result/[id]/page.tsx`
- Modify: `components/result/AIExplanation.tsx`

- [ ] **Step 1: ปรับ `main` padding ให้ตรง tab pages**

```tsx
<main className="space-y-6 px-4 py-6 pb-10">
```

- [ ] **Step 2: ใช้ `RiskScoreCard` + `SensorValueCard` ผ่าน `RiskResultCard` (หลัง Task 2)**

- [ ] **Step 3: พิจารณารวม `AIExplanation` กับ `AIInsightCard` pattern** — sparkline optional บน result

- [ ] **Step 4: Manual check** — คลิกจาก History → Result → กลับ; สีและขนาดตัวเลขตรง dashboard

- [ ] **Step 5: Commit**

```bash
git commit -m "Align result detail page layout with dashboard reference."
```

---

## Task 7: Page — Landing

**Priority:** P0 (demo entry) | **Scope:** Small

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: ตรวจว่า CTA ใช้ `Button` primary (ฟ้า) — ไม่มี risk colors**

- [ ] **Step 2: (Optional) ใช้ `AppLogo` + spacing สอดคล้องกับ tab header typography**

- [ ] **Step 3: ไม่บังคับ Card wrapper** — Landing ตาม spec เป็น hero แยกจาก tab pages

- [ ] **Step 4: Manual check** — Landing → ดู Demo → Dashboard transition รู้สึกเป็นชุดเดียวกัน

- [ ] **Step 5: Commit (ถ้ามีการเปลี่ยน)**

---

## Task 8: Page — 404

**Priority:** P0 | **Scope:** Small

**Files:**
- Modify: `app/not-found.tsx`
- Reuse: `components/shared/EmptyState.tsx`

- [ ] **Step 1: ใช้ `EmptyState` + primary Button แทน custom markup**

- [ ] **Step 2: Manual check** — เปิด URL ไม่มีอยู่

- [ ] **Step 3: Commit**

---

## Task 9: Page — Onboarding (P1)

**Priority:** P1 | **Scope:** Medium

**Files:**
- Modify: `components/onboarding/OnboardingPageClient.tsx`

- [ ] **Step 1: เปลี่ยน `rounded-xl border bg-surface` panels → `Card` component**

- [ ] **Step 2: Step 3 — ใช้ `DisclaimerBanner` แทน inline disclaimer text**

- [ ] **Step 3: Spacing `space-y-6 px-4 py-6` ให้ใกล้ tab pages**

- [ ] **Step 4: Step indicator คง blue/grey (ไม่เพิ่มเขียว)**

- [ ] **Step 5: Manual check** — onboarding ทุก step บนมือถือ 430px

- [ ] **Step 6: Commit**

---

## Task 10: Page — Profile (P1)

**Priority:** P1 | **Scope:** Medium

**Files:**
- Modify: `components/profile/ProfilePageClient.tsx`

- [ ] **Step 1: `TabPageHeader` สำหรับหัวข้อโปรไฟล์**

- [ ] **Step 2: Device block — reuse `DashboardDeviceInfo` หรือ extract `DeviceInfoCard`**

- [ ] **Step 3: Settings rows — ใช้ `Card` แทน manual `rounded-2xl border bg-surface`**

- [ ] **Step 4: ปุ่มออกจากโหมดสาธิต — neutral grey (ไม่ใช่แดง) — ยืนยันหลัง Task 0**

- [ ] **Step 5: Commit**

---

## Task 11: Dead Code Cleanup (P1)

**Files:**
- Modify: `lib/risk-engine/risk-level.ts`
- Evaluate: `components/shared/RiskBadge.tsx`

- [ ] **Step 1: ลบ `riskHeroCardClasses` / `riskHeroGlowClasses` ถ้าไม่มี consumer**

- [ ] **Step 2: ตัดสินใจ RiskBadge**
  - แนะนำ: **deprecate** — ใช้ `RiskIndicator` ทุกที่; เก็บ `RiskBadge` + badge variants สำหรับอนาคต หรือลบถ้าไม่ใช้

- [ ] **Step 3: `npm run build`**

- [ ] **Step 4: Commit**

---

## Task 12: Login / Register (P2 — Defer)

**Priority:** P2 | **Scope:** Medium

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/register/page.tsx`
- Create: `app/(auth)/layout.tsx` (optional)

- [ ] **Defer จนกว่า P0 demo flow + manual TEST_CHECKLIST ผ่านครบ**

เมื่อทำ: Card form + logo + primary CTA + link ข้ามไป Demo

---

## Final Verification (ทุก Task เสร็จ)

- [ ] รัน `Docs/TEST_CHECKLIST.md` ทุกข้อบน local + production
- [ ] เปิดทุก route: `/`, `/dashboard`, `/history`, `/ai-insight`, `/result/[id]`, `/onboarding`, `/profile`, 404
- [ ] Grep ยืนยันไม่มี traffic-light hex ใน TSX:

```bash
rg "#34[Cc]759|#FF9500|#FF3B30|text-green|text-red|text-orange" --glob "*.{tsx,ts,css}"
```

Expected: ไม่พบใน component code (ยกเว้น docs ถ้ายังไม่ sync)

- [ ] `npm run test && npm run build`
- [ ] Push + Vercel deploy

---

## ลำดับการทำงานแนะนำ (สรุป)

```
Task 0 Foundation (commit สีฟ้า)
  → Task 1 InsightFactorCard hotfix
  → Task 2 Shared components
  → Task 3 Dashboard polish
  → Task 4 History
  → Task 5 AI Insight
  → Task 6 Result
  → Task 7 Landing + Task 8 404
  → Task 9 Onboarding (P1)
  → Task 10 Profile (P1)
  → Task 11 Cleanup
  → Final verification
```

**ประมาณเวลา:** P0 (Task 0–8) ~2–3 sessions | P1 (Task 9–11) ~1 session | P2 defer

---

## Self-Review (plan vs spec)

| ความต้องการผู้ใช้ | Task ที่ครอบคลุม |
|------------------|----------------|
| โทนฟ้า Apple Health | Task 0, ทุก page task |
| ไม่มีเขียว/แดง/เหลืองหลุด | Task 0 + Final grep |
| UX เหมือนหน้าหลัก | Task 2 shared + Task 3–6 |
| แก้ทีละหน้า | Task 3–10 แยก per page |
| AI Insight status แปลก | Task 1, 5 |
| History ใหญ่ชัด | Task 4 (done บางส่วนใน cb1c6e6) |
| ไม่ทำ auth ก่อน demo | Task 12 defer P2 |

**Gap:** ไม่มี automated visual regression tests — ใช้ manual TEST_CHECKLIST แทน (ตาม MVP scope)
